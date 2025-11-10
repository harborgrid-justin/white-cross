"use strict";
/**
 * LOC: WMS-LAYOUT-001
 * File: /reuse/logistics/warehouse-layout-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Warehouse management controllers
 *   - Inventory allocation services
 *   - Picking optimization services
 *   - Receiving and putaway services
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlottingRuleType = exports.AssignmentType = exports.VelocityRating = exports.LocationStatus = exports.StorageType = exports.LocationType = exports.ZoneStatus = exports.TemperatureZone = exports.ZoneType = exports.WarehouseStatus = exports.WarehouseType = void 0;
exports.createWarehouseZone = createWarehouseZone;
exports.updateZoneCapacity = updateZoneCapacity;
exports.calculateZoneUtilization = calculateZoneUtilization;
exports.filterZonesByTypeAndStatus = filterZonesByTypeAndStatus;
exports.sortZonesByPickPriority = sortZonesByPickPriority;
exports.identifyZonesRequiringAttention = identifyZonesRequiringAttention;
exports.calculateOptimalZoneAllocation = calculateOptimalZoneAllocation;
exports.generateZoneCapacityAnalysis = generateZoneCapacityAnalysis;
exports.generateZoneRebalancingPlan = generateZoneRebalancingPlan;
exports.createStorageLocation = createStorageLocation;
exports.buildLocationHierarchy = buildLocationHierarchy;
exports.getAllChildLocations = getAllChildLocations;
exports.getLocationPath = getLocationPath;
exports.generateLocationCode = generateLocationCode;
exports.parseLocationCode = parseLocationCode;
exports.findAvailableLocations = findAvailableLocations;
exports.validateLocationHierarchy = validateLocationHierarchy;
exports.updateLocationCapacity = updateLocationCapacity;
exports.calculateLocationUtilization = calculateLocationUtilization;
exports.canLocationAccommodateItem = canLocationAccommodateItem;
exports.setLocationVelocityRating = setLocationVelocityRating;
exports.updateLocationPickingSequence = updateLocationPickingSequence;
exports.addLocationRestriction = addLocationRestriction;
exports.removeLocationRestriction = removeLocationRestriction;
exports.updateLocationStatus = updateLocationStatus;
exports.calculateLocationVolume = calculateLocationVolume;
exports.createSlottingRule = createSlottingRule;
exports.evaluateSlottingRules = evaluateSlottingRules;
exports.generateABCClassification = generateABCClassification;
exports.calculateVelocityBasedSlotting = calculateVelocityBasedSlotting;
exports.calculateProductAffinity = calculateProductAffinity;
exports.optimizePickPath = optimizePickPath;
exports.generateSeasonalSlottingRecommendations = generateSeasonalSlottingRecommendations;
exports.validateSlottingRule = validateSlottingRule;
exports.calculateSlottingEfficiency = calculateSlottingEfficiency;
exports.createLocationAssignment = createLocationAssignment;
exports.updateAssignmentQuantity = updateAssignmentQuantity;
exports.calculateAvailableCapacityByZone = calculateAvailableCapacityByZone;
exports.findOptimalPutawayLocation = findOptimalPutawayLocation;
exports.generateCapacityUtilizationReport = generateCapacityUtilizationReport;
exports.allocateInventoryToLocation = allocateInventoryToLocation;
exports.releaseAllocatedInventory = releaseAllocatedInventory;
exports.calculateLocationTurnoverRate = calculateLocationTurnoverRate;
/**
 * File: /reuse/logistics/warehouse-layout-management-kit.ts
 * Locator: WC-LOGISTICS-WMS-LAYOUT-001
 * Purpose: Comprehensive Warehouse Layout and Location Management - Complete warehouse organization and slotting optimization
 *
 * Upstream: Independent utility module for warehouse layout operations
 * Downstream: ../backend/logistics/*, WMS modules, Inventory services, Picking services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 43 utility functions for warehouse zones, locations, slotting, capacity, optimization
 *
 * LLM Context: Enterprise-grade warehouse layout management utilities to compete with JD Edwards EnterpriseOne WMS.
 * Provides comprehensive warehouse organization including zone management, location hierarchies, capacity tracking,
 * slotting optimization, ABC analysis, velocity-based placement, pick path optimization, and dynamic location
 * assignment with support for multi-warehouse, multi-zone, and complex storage strategies.
 *
 * SEQUELIZE MIGRATION REFERENCE:
 *
 * // Migration: create-warehouse-layout-tables.js
 * module.exports = {
 *   async up(queryInterface, Sequelize) {
 *     const transaction = await queryInterface.sequelize.transaction();
 *
 *     try {
 *       // 1. Warehouse table
 *       await queryInterface.createTable('Warehouses', {
 *         id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
 *         warehouseCode: { type: Sequelize.STRING(20), allowNull: false, unique: true },
 *         name: { type: Sequelize.STRING(100), allowNull: false },
 *         type: { type: Sequelize.ENUM('DC', 'FC', 'CROSS_DOCK', 'COLD_STORAGE', 'HAZMAT'), allowNull: false },
 *         status: { type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE'), defaultValue: 'ACTIVE' },
 *         totalArea: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
 *         usableArea: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
 *         address: { type: Sequelize.JSONB, allowNull: true },
 *         operatingHours: { type: Sequelize.JSONB, allowNull: true },
 *         metadata: { type: Sequelize.JSONB, defaultValue: {} },
 *         createdAt: { type: Sequelize.DATE, allowNull: false },
 *         updatedAt: { type: Sequelize.DATE, allowNull: false },
 *         deletedAt: { type: Sequelize.DATE, allowNull: true }
 *       }, { transaction });
 *
 *       // 2. Warehouse zones table
 *       await queryInterface.createTable('WarehouseZones', {
 *         id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
 *         warehouseId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Warehouses', key: 'id' } },
 *         zoneCode: { type: Sequelize.STRING(20), allowNull: false },
 *         name: { type: Sequelize.STRING(100), allowNull: false },
 *         zoneType: { type: Sequelize.ENUM('RECEIVING', 'STORAGE', 'PICKING', 'PACKING', 'SHIPPING', 'STAGING', 'RETURNS', 'QUARANTINE'), allowNull: false },
 *         temperature: { type: Sequelize.ENUM('AMBIENT', 'REFRIGERATED', 'FROZEN', 'CONTROLLED'), defaultValue: 'AMBIENT' },
 *         status: { type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'FULL', 'MAINTENANCE'), defaultValue: 'ACTIVE' },
 *         totalLocations: { type: Sequelize.INTEGER, defaultValue: 0 },
 *         occupiedLocations: { type: Sequelize.INTEGER, defaultValue: 0 },
 *         totalCapacity: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
 *         usedCapacity: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
 *         pickPriority: { type: Sequelize.INTEGER, defaultValue: 100 },
 *         metadata: { type: Sequelize.JSONB, defaultValue: {} },
 *         createdAt: { type: Sequelize.DATE, allowNull: false },
 *         updatedAt: { type: Sequelize.DATE, allowNull: false },
 *         deletedAt: { type: Sequelize.DATE, allowNull: true }
 *       }, { transaction });
 *
 *       await queryInterface.addIndex('WarehouseZones', ['warehouseId', 'zoneCode'], { unique: true, transaction });
 *       await queryInterface.addIndex('WarehouseZones', ['zoneType', 'status'], { transaction });
 *
 *       // 3. Storage locations table
 *       await queryInterface.createTable('StorageLocations', {
 *         id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
 *         warehouseId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Warehouses', key: 'id' } },
 *         zoneId: { type: Sequelize.UUID, allowNull: false, references: { model: 'WarehouseZones', key: 'id' } },
 *         locationCode: { type: Sequelize.STRING(30), allowNull: false },
 *         parentLocationId: { type: Sequelize.UUID, allowNull: true, references: { model: 'StorageLocations', key: 'id' } },
 *         locationType: { type: Sequelize.ENUM('AISLE', 'BAY', 'LEVEL', 'BIN', 'PALLET', 'SHELF', 'FLOOR'), allowNull: false },
 *         storageType: { type: Sequelize.ENUM('PALLET_RACK', 'DRIVE_IN', 'PUSH_BACK', 'CANTILEVER', 'FLOW_RACK', 'SHELF', 'FLOOR_STACK', 'MEZZANINE'), allowNull: false },
 *         status: { type: Sequelize.ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'DAMAGED', 'BLOCKED', 'MAINTENANCE'), defaultValue: 'AVAILABLE' },
 *         xCoordinate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
 *         yCoordinate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
 *         zCoordinate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
 *         aisle: { type: Sequelize.STRING(10), allowNull: true },
 *         bay: { type: Sequelize.STRING(10), allowNull: true },
 *         level: { type: Sequelize.STRING(10), allowNull: true },
 *         position: { type: Sequelize.STRING(10), allowNull: true },
 *         capacityWeight: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
 *         capacityVolume: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
 *         capacityUnits: { type: Sequelize.INTEGER, allowNull: true },
 *         usedWeight: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
 *         usedVolume: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
 *         usedUnits: { type: Sequelize.INTEGER, defaultValue: 0 },
 *         pickingSequence: { type: Sequelize.INTEGER, allowNull: true },
 *         velocityRating: { type: Sequelize.ENUM('A', 'B', 'C', 'D'), allowNull: true },
 *         allowMixedItems: { type: Sequelize.BOOLEAN, defaultValue: false },
 *         allowMixedLots: { type: Sequelize.BOOLEAN, defaultValue: false },
 *         requiresLicensePlate: { type: Sequelize.BOOLEAN, defaultValue: false },
 *         dimensions: { type: Sequelize.JSONB, allowNull: true },
 *         restrictions: { type: Sequelize.JSONB, defaultValue: {} },
 *         metadata: { type: Sequelize.JSONB, defaultValue: {} },
 *         lastInventoryDate: { type: Sequelize.DATE, allowNull: true },
 *         lastPickDate: { type: Sequelize.DATE, allowNull: true },
 *         createdAt: { type: Sequelize.DATE, allowNull: false },
 *         updatedAt: { type: Sequelize.DATE, allowNull: false },
 *         deletedAt: { type: Sequelize.DATE, allowNull: true }
 *       }, { transaction });
 *
 *       await queryInterface.addIndex('StorageLocations', ['warehouseId', 'locationCode'], { unique: true, transaction });
 *       await queryInterface.addIndex('StorageLocations', ['zoneId', 'status'], { transaction });
 *       await queryInterface.addIndex('StorageLocations', ['status', 'locationType'], { transaction });
 *       await queryInterface.addIndex('StorageLocations', ['aisle', 'bay', 'level'], { transaction });
 *       await queryInterface.addIndex('StorageLocations', ['velocityRating', 'pickingSequence'], { transaction });
 *
 *       // 4. Location assignments table
 *       await queryInterface.createTable('LocationAssignments', {
 *         id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
 *         locationId: { type: Sequelize.UUID, allowNull: false, references: { model: 'StorageLocations', key: 'id' } },
 *         productId: { type: Sequelize.UUID, allowNull: false },
 *         lotNumber: { type: Sequelize.STRING(50), allowNull: true },
 *         licensePlateId: { type: Sequelize.STRING(50), allowNull: true },
 *         quantity: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
 *         quantityUom: { type: Sequelize.STRING(10), allowNull: false },
 *         weight: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
 *         volume: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
 *         assignmentType: { type: Sequelize.ENUM('PRIMARY', 'OVERFLOW', 'TEMPORARY', 'PICK_FACE', 'RESERVE'), allowNull: false },
 *         allocatedQuantity: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
 *         receivedDate: { type: Sequelize.DATE, allowNull: true },
 *         expiryDate: { type: Sequelize.DATE, allowNull: true },
 *         lastPickDate: { type: Sequelize.DATE, allowNull: true },
 *         pickCount: { type: Sequelize.INTEGER, defaultValue: 0 },
 *         metadata: { type: Sequelize.JSONB, defaultValue: {} },
 *         createdAt: { type: Sequelize.DATE, allowNull: false },
 *         updatedAt: { type: Sequelize.DATE, allowNull: false }
 *       }, { transaction });
 *
 *       await queryInterface.addIndex('LocationAssignments', ['locationId', 'productId'], { transaction });
 *       await queryInterface.addIndex('LocationAssignments', ['productId', 'assignmentType'], { transaction });
 *       await queryInterface.addIndex('LocationAssignments', ['licensePlateId'], { transaction });
 *
 *       // 5. Slotting rules table
 *       await queryInterface.createTable('SlottingRules', {
 *         id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
 *         warehouseId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Warehouses', key: 'id' } },
 *         ruleName: { type: Sequelize.STRING(100), allowNull: false },
 *         ruleType: { type: Sequelize.ENUM('VELOCITY_BASED', 'ABC_ANALYSIS', 'SIZE_BASED', 'WEIGHT_BASED', 'AFFINITY', 'SEASONAL', 'CUSTOM'), allowNull: false },
 *         priority: { type: Sequelize.INTEGER, defaultValue: 100 },
 *         status: { type: Sequelize.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' },
 *         conditions: { type: Sequelize.JSONB, allowNull: false },
 *         actions: { type: Sequelize.JSONB, allowNull: false },
 *         validFrom: { type: Sequelize.DATE, allowNull: true },
 *         validTo: { type: Sequelize.DATE, allowNull: true },
 *         metadata: { type: Sequelize.JSONB, defaultValue: {} },
 *         createdAt: { type: Sequelize.DATE, allowNull: false },
 *         updatedAt: { type: Sequelize.DATE, allowNull: false }
 *       }, { transaction });
 *
 *       await queryInterface.addIndex('SlottingRules', ['warehouseId', 'status', 'priority'], { transaction });
 *
 *       // 6. Location metrics table
 *       await queryInterface.createTable('LocationMetrics', {
 *         id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
 *         locationId: { type: Sequelize.UUID, allowNull: false, references: { model: 'StorageLocations', key: 'id' } },
 *         metricDate: { type: Sequelize.DATEONLY, allowNull: false },
 *         pickCount: { type: Sequelize.INTEGER, defaultValue: 0 },
 *         replenishmentCount: { type: Sequelize.INTEGER, defaultValue: 0 },
 *         avgUtilization: { type: Sequelize.DECIMAL(5, 2), allowNull: true },
 *         emptyTime: { type: Sequelize.INTEGER, defaultValue: 0 },
 *         turnoverRate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
 *         accessTime: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
 *         accuracy: { type: Sequelize.DECIMAL(5, 2), allowNull: true },
 *         metadata: { type: Sequelize.JSONB, defaultValue: {} },
 *         createdAt: { type: Sequelize.DATE, allowNull: false },
 *         updatedAt: { type: Sequelize.DATE, allowNull: false }
 *       }, { transaction });
 *
 *       await queryInterface.addIndex('LocationMetrics', ['locationId', 'metricDate'], { unique: true, transaction });
 *
 *       await transaction.commit();
 *     } catch (error) {
 *       await transaction.rollback();
 *       throw error;
 *     }
 *   },
 *
 *   async down(queryInterface, Sequelize) {
 *     const transaction = await queryInterface.sequelize.transaction();
 *     try {
 *       await queryInterface.dropTable('LocationMetrics', { transaction });
 *       await queryInterface.dropTable('SlottingRules', { transaction });
 *       await queryInterface.dropTable('LocationAssignments', { transaction });
 *       await queryInterface.dropTable('StorageLocations', { transaction });
 *       await queryInterface.dropTable('WarehouseZones', { transaction });
 *       await queryInterface.dropTable('Warehouses', { transaction });
 *       await transaction.commit();
 *     } catch (error) {
 *       await transaction.rollback();
 *       throw error;
 *     }
 *   }
 * };
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Warehouse type enumeration
 */
var WarehouseType;
(function (WarehouseType) {
    WarehouseType["DC"] = "DC";
    WarehouseType["FC"] = "FC";
    WarehouseType["CROSS_DOCK"] = "CROSS_DOCK";
    WarehouseType["COLD_STORAGE"] = "COLD_STORAGE";
    WarehouseType["HAZMAT"] = "HAZMAT";
})(WarehouseType || (exports.WarehouseType = WarehouseType = {}));
/**
 * Warehouse status
 */
var WarehouseStatus;
(function (WarehouseStatus) {
    WarehouseStatus["ACTIVE"] = "ACTIVE";
    WarehouseStatus["INACTIVE"] = "INACTIVE";
    WarehouseStatus["MAINTENANCE"] = "MAINTENANCE";
})(WarehouseStatus || (exports.WarehouseStatus = WarehouseStatus = {}));
/**
 * Zone type enumeration
 */
var ZoneType;
(function (ZoneType) {
    ZoneType["RECEIVING"] = "RECEIVING";
    ZoneType["STORAGE"] = "STORAGE";
    ZoneType["PICKING"] = "PICKING";
    ZoneType["PACKING"] = "PACKING";
    ZoneType["SHIPPING"] = "SHIPPING";
    ZoneType["STAGING"] = "STAGING";
    ZoneType["RETURNS"] = "RETURNS";
    ZoneType["QUARANTINE"] = "QUARANTINE";
})(ZoneType || (exports.ZoneType = ZoneType = {}));
/**
 * Temperature control requirements
 */
var TemperatureZone;
(function (TemperatureZone) {
    TemperatureZone["AMBIENT"] = "AMBIENT";
    TemperatureZone["REFRIGERATED"] = "REFRIGERATED";
    TemperatureZone["FROZEN"] = "FROZEN";
    TemperatureZone["CONTROLLED"] = "CONTROLLED";
})(TemperatureZone || (exports.TemperatureZone = TemperatureZone = {}));
/**
 * Zone status
 */
var ZoneStatus;
(function (ZoneStatus) {
    ZoneStatus["ACTIVE"] = "ACTIVE";
    ZoneStatus["INACTIVE"] = "INACTIVE";
    ZoneStatus["FULL"] = "FULL";
    ZoneStatus["MAINTENANCE"] = "MAINTENANCE";
})(ZoneStatus || (exports.ZoneStatus = ZoneStatus = {}));
/**
 * Location type in hierarchy
 */
var LocationType;
(function (LocationType) {
    LocationType["AISLE"] = "AISLE";
    LocationType["BAY"] = "BAY";
    LocationType["LEVEL"] = "LEVEL";
    LocationType["BIN"] = "BIN";
    LocationType["PALLET"] = "PALLET";
    LocationType["SHELF"] = "SHELF";
    LocationType["FLOOR"] = "FLOOR";
})(LocationType || (exports.LocationType = LocationType = {}));
/**
 * Storage type/configuration
 */
var StorageType;
(function (StorageType) {
    StorageType["PALLET_RACK"] = "PALLET_RACK";
    StorageType["DRIVE_IN"] = "DRIVE_IN";
    StorageType["PUSH_BACK"] = "PUSH_BACK";
    StorageType["CANTILEVER"] = "CANTILEVER";
    StorageType["FLOW_RACK"] = "FLOW_RACK";
    StorageType["SHELF"] = "SHELF";
    StorageType["FLOOR_STACK"] = "FLOOR_STACK";
    StorageType["MEZZANINE"] = "MEZZANINE";
})(StorageType || (exports.StorageType = StorageType = {}));
/**
 * Location status
 */
var LocationStatus;
(function (LocationStatus) {
    LocationStatus["AVAILABLE"] = "AVAILABLE";
    LocationStatus["OCCUPIED"] = "OCCUPIED";
    LocationStatus["RESERVED"] = "RESERVED";
    LocationStatus["DAMAGED"] = "DAMAGED";
    LocationStatus["BLOCKED"] = "BLOCKED";
    LocationStatus["MAINTENANCE"] = "MAINTENANCE";
})(LocationStatus || (exports.LocationStatus = LocationStatus = {}));
/**
 * Velocity rating for ABC analysis
 */
var VelocityRating;
(function (VelocityRating) {
    VelocityRating["A"] = "A";
    VelocityRating["B"] = "B";
    VelocityRating["C"] = "C";
    VelocityRating["D"] = "D";
})(VelocityRating || (exports.VelocityRating = VelocityRating = {}));
/**
 * Assignment type
 */
var AssignmentType;
(function (AssignmentType) {
    AssignmentType["PRIMARY"] = "PRIMARY";
    AssignmentType["OVERFLOW"] = "OVERFLOW";
    AssignmentType["TEMPORARY"] = "TEMPORARY";
    AssignmentType["PICK_FACE"] = "PICK_FACE";
    AssignmentType["RESERVE"] = "RESERVE";
})(AssignmentType || (exports.AssignmentType = AssignmentType = {}));
/**
 * Slotting rule type
 */
var SlottingRuleType;
(function (SlottingRuleType) {
    SlottingRuleType["VELOCITY_BASED"] = "VELOCITY_BASED";
    SlottingRuleType["ABC_ANALYSIS"] = "ABC_ANALYSIS";
    SlottingRuleType["SIZE_BASED"] = "SIZE_BASED";
    SlottingRuleType["WEIGHT_BASED"] = "WEIGHT_BASED";
    SlottingRuleType["AFFINITY"] = "AFFINITY";
    SlottingRuleType["SEASONAL"] = "SEASONAL";
    SlottingRuleType["CUSTOM"] = "CUSTOM";
})(SlottingRuleType || (exports.SlottingRuleType = SlottingRuleType = {}));
// ============================================================================
// SECTION 1: ZONE MANAGEMENT (Functions 1-9)
// ============================================================================
/**
 * Function 1: Create a new warehouse zone
 *
 * @param warehouseId - Warehouse identifier
 * @param zoneData - Zone creation data
 * @returns Created warehouse zone
 */
function createWarehouseZone(warehouseId, zoneData) {
    const now = new Date();
    return {
        id: crypto.randomUUID(),
        warehouseId,
        zoneCode: zoneData.zoneCode.toUpperCase(),
        name: zoneData.name,
        zoneType: zoneData.zoneType,
        temperature: zoneData.temperature || TemperatureZone.AMBIENT,
        status: ZoneStatus.ACTIVE,
        totalLocations: 0,
        occupiedLocations: 0,
        totalCapacity: zoneData.totalCapacity,
        usedCapacity: 0,
        pickPriority: zoneData.pickPriority || 100,
        metadata: zoneData.metadata || {},
        createdAt: now,
        updatedAt: now,
    };
}
/**
 * Function 2: Update zone capacity metrics
 *
 * @param zone - Warehouse zone to update
 * @param capacityChange - Change in capacity usage
 * @returns Updated zone
 */
function updateZoneCapacity(zone, capacityChange) {
    const newUsedCapacity = zone.usedCapacity + capacityChange.usedCapacityDelta;
    const newOccupiedLocations = zone.occupiedLocations + (capacityChange.locationCountDelta || 0);
    // Determine status based on utilization
    let newStatus = zone.status;
    if (zone.totalCapacity && newUsedCapacity >= zone.totalCapacity * 0.98) {
        newStatus = ZoneStatus.FULL;
    }
    else if (zone.status === ZoneStatus.FULL && newUsedCapacity < zone.totalCapacity * 0.90) {
        newStatus = ZoneStatus.ACTIVE;
    }
    return {
        ...zone,
        usedCapacity: Math.max(0, newUsedCapacity),
        occupiedLocations: Math.max(0, newOccupiedLocations),
        status: newStatus,
        updatedAt: new Date(),
    };
}
/**
 * Function 3: Calculate zone utilization rate
 *
 * @param zone - Warehouse zone
 * @returns Utilization metrics
 */
function calculateZoneUtilization(zone) {
    const locationUtilization = zone.totalLocations > 0
        ? (zone.occupiedLocations / zone.totalLocations) * 100
        : 0;
    const capacityUtilization = zone.totalCapacity
        ? (zone.usedCapacity / zone.totalCapacity) * 100
        : 0;
    return {
        locationUtilization: Math.round(locationUtilization * 100) / 100,
        capacityUtilization: Math.round(capacityUtilization * 100) / 100,
        isNearCapacity: capacityUtilization >= 90,
        isOverCapacity: capacityUtilization > 100,
    };
}
/**
 * Function 4: Get zones by type and status
 *
 * @param zones - Array of zones to filter
 * @param filters - Filter criteria
 * @returns Filtered zones
 */
function filterZonesByTypeAndStatus(zones, filters) {
    return zones.filter(zone => {
        if (filters.zoneTypes && !filters.zoneTypes.includes(zone.zoneType)) {
            return false;
        }
        if (filters.statuses && !filters.statuses.includes(zone.status)) {
            return false;
        }
        if (filters.temperatures && !filters.temperatures.includes(zone.temperature)) {
            return false;
        }
        if (filters.minUtilization !== undefined || filters.maxUtilization !== undefined) {
            const utilization = calculateZoneUtilization(zone);
            if (filters.minUtilization !== undefined && utilization.capacityUtilization < filters.minUtilization) {
                return false;
            }
            if (filters.maxUtilization !== undefined && utilization.capacityUtilization > filters.maxUtilization) {
                return false;
            }
        }
        return true;
    });
}
/**
 * Function 5: Sort zones by pick priority
 *
 * @param zones - Array of zones to sort
 * @param direction - Sort direction
 * @returns Sorted zones
 */
function sortZonesByPickPriority(zones, direction = 'ASC') {
    return [...zones].sort((a, b) => {
        const comparison = a.pickPriority - b.pickPriority;
        return direction === 'ASC' ? comparison : -comparison;
    });
}
/**
 * Function 6: Identify zones requiring attention
 *
 * @param zones - Array of zones to analyze
 * @returns Zones with issues and recommendations
 */
function identifyZonesRequiringAttention(zones) {
    const results = [];
    for (const zone of zones) {
        const issues = [];
        let priority = 'LOW';
        const utilization = calculateZoneUtilization(zone);
        if (zone.status === ZoneStatus.INACTIVE) {
            issues.push('Zone is inactive');
            priority = 'MEDIUM';
        }
        if (zone.status === ZoneStatus.MAINTENANCE) {
            issues.push('Zone under maintenance');
            priority = 'MEDIUM';
        }
        if (utilization.isOverCapacity) {
            issues.push('Zone over capacity');
            priority = 'HIGH';
        }
        else if (utilization.isNearCapacity) {
            issues.push('Zone near capacity (>90%)');
            priority = priority === 'HIGH' ? 'HIGH' : 'MEDIUM';
        }
        if (utilization.locationUtilization < 20 && zone.status === ZoneStatus.ACTIVE) {
            issues.push('Low location utilization (<20%)');
        }
        if (issues.length > 0) {
            results.push({ zone, issues, priority });
        }
    }
    return results.sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}
/**
 * Function 7: Calculate optimal zone allocation for new product
 *
 * @param zones - Available zones
 * @param productData - Product characteristics
 * @returns Recommended zone
 */
function calculateOptimalZoneAllocation(zones, productData) {
    // Filter zones by temperature requirement and status
    const eligibleZones = zones.filter(zone => zone.temperature === productData.temperatureRequirement &&
        (zone.status === ZoneStatus.ACTIVE || zone.status === ZoneStatus.FULL));
    if (eligibleZones.length === 0) {
        return null;
    }
    // Score each zone
    const scoredZones = eligibleZones.map(zone => {
        let score = 0;
        const utilization = calculateZoneUtilization(zone);
        // Prefer zones for storage
        if (zone.zoneType === ZoneType.STORAGE) {
            score += 50;
        }
        // Prefer zones with appropriate pick priority for velocity
        if (productData.velocity === VelocityRating.A && zone.pickPriority <= 50) {
            score += 30;
        }
        else if (productData.velocity === VelocityRating.B && zone.pickPriority <= 100) {
            score += 20;
        }
        // Prefer zones with available capacity
        const availableCapacity = (zone.totalCapacity || 0) - zone.usedCapacity;
        if (availableCapacity >= productData.requiredCapacity) {
            score += 40;
        }
        // Prefer zones with moderate utilization (not too empty, not too full)
        if (utilization.capacityUtilization >= 40 && utilization.capacityUtilization <= 80) {
            score += 20;
        }
        return { zone, score };
    });
    // Return highest scoring zone
    scoredZones.sort((a, b) => b.score - a.score);
    return scoredZones[0]?.zone || null;
}
/**
 * Function 8: Generate zone capacity analysis
 *
 * @param zone - Zone to analyze
 * @param locations - Locations in the zone
 * @returns Capacity analysis
 */
function generateZoneCapacityAnalysis(zone, locations) {
    const zoneLocations = locations.filter(loc => loc.zoneId === zone.id);
    const availableLocations = zoneLocations.filter(loc => loc.status === LocationStatus.AVAILABLE).length;
    const occupiedLocations = zoneLocations.filter(loc => loc.status === LocationStatus.OCCUPIED).length;
    const totalCapacity = {
        weight: zoneLocations.reduce((sum, loc) => sum + (loc.capacity.weight || 0), 0),
        volume: zoneLocations.reduce((sum, loc) => sum + (loc.capacity.volume || 0), 0),
        units: zoneLocations.reduce((sum, loc) => sum + (loc.capacity.units || 0), 0),
    };
    const usedCapacity = {
        weight: zoneLocations.reduce((sum, loc) => sum + loc.used.weight, 0),
        volume: zoneLocations.reduce((sum, loc) => sum + loc.used.volume, 0),
        units: zoneLocations.reduce((sum, loc) => sum + loc.used.units, 0),
    };
    const utilizationRate = totalCapacity.volume > 0
        ? (usedCapacity.volume / totalCapacity.volume) * 100
        : 0;
    const recommendations = [];
    if (utilizationRate > 95) {
        recommendations.push('Zone near full capacity - consider overflow zone or expansion');
    }
    else if (utilizationRate < 30) {
        recommendations.push('Low utilization - consider consolidation or repurposing');
    }
    if (availableLocations < zoneLocations.length * 0.1) {
        recommendations.push('Limited available locations - initiate replenishment review');
    }
    return {
        zoneId: zone.id,
        zoneCode: zone.zoneCode,
        zoneName: zone.name,
        totalLocations: zoneLocations.length,
        availableLocations,
        occupiedLocations,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        capacityRemaining: {
            weight: totalCapacity.weight - usedCapacity.weight,
            volume: totalCapacity.volume - usedCapacity.volume,
            units: totalCapacity.units - usedCapacity.units,
        },
        recommendations,
    };
}
/**
 * Function 9: Rebalance zones based on current utilization
 *
 * @param zones - Zones to rebalance
 * @returns Rebalancing recommendations
 */
function generateZoneRebalancingPlan(zones) {
    const recommendations = [];
    const activeZones = zones.filter(z => z.status === ZoneStatus.ACTIVE);
    for (const overloadedZone of activeZones) {
        const overloadedUtilization = calculateZoneUtilization(overloadedZone);
        if (overloadedUtilization.capacityUtilization > 90) {
            // Find underutilized zones of same temperature
            const underutilizedZones = activeZones.filter(z => z.id !== overloadedZone.id &&
                z.temperature === overloadedZone.temperature &&
                calculateZoneUtilization(z).capacityUtilization < 60);
            for (const targetZone of underutilizedZones) {
                const transferAmount = overloadedZone.usedCapacity * 0.2; // Transfer 20%
                recommendations.push({
                    sourceZoneId: overloadedZone.id,
                    targetZoneId: targetZone.id,
                    recommendedTransferCapacity: transferAmount,
                    reason: `Source zone at ${overloadedUtilization.capacityUtilization.toFixed(1)}% capacity, target at ${calculateZoneUtilization(targetZone).capacityUtilization.toFixed(1)}%`,
                });
                break; // One recommendation per overloaded zone
            }
        }
    }
    return recommendations;
}
// ============================================================================
// SECTION 2: LOCATION HIERARCHY (Functions 10-17)
// ============================================================================
/**
 * Function 10: Create a storage location
 *
 * @param locationData - Location creation data
 * @returns Created storage location
 */
function createStorageLocation(locationData) {
    const now = new Date();
    return {
        id: crypto.randomUUID(),
        warehouseId: locationData.warehouseId,
        zoneId: locationData.zoneId,
        locationCode: locationData.locationCode.toUpperCase(),
        parentLocationId: locationData.parentLocationId,
        locationType: locationData.locationType,
        storageType: locationData.storageType,
        status: LocationStatus.AVAILABLE,
        coordinates: locationData.coordinates,
        address: locationData.address,
        capacity: locationData.capacity || { weight: undefined, volume: undefined, units: undefined },
        used: { weight: 0, volume: 0, units: 0 },
        pickingSequence: undefined,
        velocityRating: undefined,
        allowMixedItems: locationData.allowMixedItems || false,
        allowMixedLots: locationData.allowMixedLots || false,
        requiresLicensePlate: locationData.requiresLicensePlate || false,
        dimensions: locationData.dimensions,
        restrictions: locationData.restrictions,
        metadata: locationData.metadata || {},
        createdAt: now,
        updatedAt: now,
    };
}
/**
 * Function 11: Build location hierarchy tree
 *
 * @param locations - All locations
 * @param rootLocationId - Starting point (null for top level)
 * @returns Hierarchical tree structure
 */
function buildLocationHierarchy(locations, rootLocationId = null) {
    const children = locations.filter(loc => loc.parentLocationId === rootLocationId);
    return children.map(loc => ({
        locationId: loc.id,
        locationCode: loc.locationCode,
        locationType: loc.locationType,
        level: rootLocationId === null ? 0 : getLocationLevel(locations, loc.id),
        parentLocationId: loc.parentLocationId,
        children: buildLocationHierarchy(locations, loc.id),
        metadata: loc.metadata,
    }));
}
/**
 * Helper: Get location level in hierarchy
 */
function getLocationLevel(locations, locationId) {
    const location = locations.find(loc => loc.id === locationId);
    if (!location || !location.parentLocationId) {
        return 0;
    }
    return 1 + getLocationLevel(locations, location.parentLocationId);
}
/**
 * Function 12: Get all child locations recursively
 *
 * @param locations - All locations
 * @param parentLocationId - Parent location ID
 * @returns All descendant locations
 */
function getAllChildLocations(locations, parentLocationId) {
    const directChildren = locations.filter(loc => loc.parentLocationId === parentLocationId);
    const allChildren = [...directChildren];
    for (const child of directChildren) {
        allChildren.push(...getAllChildLocations(locations, child.id));
    }
    return allChildren;
}
/**
 * Function 13: Get location path from root to location
 *
 * @param locations - All locations
 * @param locationId - Target location
 * @returns Path from root to location
 */
function getLocationPath(locations, locationId) {
    const path = [];
    let currentId = locationId;
    while (currentId) {
        const location = locations.find(loc => loc.id === currentId);
        if (!location)
            break;
        path.unshift(location);
        currentId = location.parentLocationId;
    }
    return path;
}
/**
 * Function 14: Generate location code from hierarchy
 *
 * @param address - Location address components
 * @param format - Code format pattern
 * @returns Generated location code
 */
function generateLocationCode(address, format = 'AABBLLPP') {
    const aisle = (address.aisle || '').padStart(2, '0');
    const bay = (address.bay || '').padStart(2, '0');
    const level = (address.level || '').padStart(2, '0');
    const position = (address.position || '').padStart(2, '0');
    switch (format) {
        case 'AABBLLPP':
            return `${aisle}${bay}${level}${position}`;
        case 'A-BB-LL-PP':
            return `${aisle}-${bay}-${level}-${position}`;
        default:
            return `${aisle}${bay}${level}${position}`;
    }
}
/**
 * Function 15: Parse location code into components
 *
 * @param locationCode - Location code to parse
 * @param format - Code format pattern
 * @returns Parsed address components
 */
function parseLocationCode(locationCode, format = 'AABBLLPP') {
    try {
        if (format === 'AABBLLPP' && locationCode.length === 8) {
            return {
                aisle: locationCode.substring(0, 2),
                bay: locationCode.substring(2, 4),
                level: locationCode.substring(4, 6),
                position: locationCode.substring(6, 8),
            };
        }
        else if (format === 'A-BB-LL-PP') {
            const parts = locationCode.split('-');
            if (parts.length === 4) {
                return {
                    aisle: parts[0],
                    bay: parts[1],
                    level: parts[2],
                    position: parts[3],
                };
            }
        }
        return null;
    }
    catch {
        return null;
    }
}
/**
 * Function 16: Find available locations by criteria
 *
 * @param locations - All locations
 * @param criteria - Search criteria
 * @returns Matching available locations
 */
function findAvailableLocations(locations, criteria) {
    return locations.filter(loc => {
        if (loc.status !== LocationStatus.AVAILABLE) {
            return false;
        }
        if (criteria.zoneId && loc.zoneId !== criteria.zoneId) {
            return false;
        }
        if (criteria.locationType && !criteria.locationType.includes(loc.locationType)) {
            return false;
        }
        if (criteria.storageType && !criteria.storageType.includes(loc.storageType)) {
            return false;
        }
        if (criteria.minCapacity) {
            if (criteria.minCapacity.weight && (!loc.capacity.weight || loc.capacity.weight < criteria.minCapacity.weight)) {
                return false;
            }
            if (criteria.minCapacity.volume && (!loc.capacity.volume || loc.capacity.volume < criteria.minCapacity.volume)) {
                return false;
            }
            if (criteria.minCapacity.units && (!loc.capacity.units || loc.capacity.units < criteria.minCapacity.units)) {
                return false;
            }
        }
        if (criteria.allowMixedItems !== undefined && loc.allowMixedItems !== criteria.allowMixedItems) {
            return false;
        }
        if (criteria.velocityRating && loc.velocityRating && !criteria.velocityRating.includes(loc.velocityRating)) {
            return false;
        }
        return true;
    });
}
/**
 * Function 17: Validate location hierarchy integrity
 *
 * @param locations - All locations
 * @returns Validation results with issues
 */
function validateLocationHierarchy(locations) {
    const issues = [];
    for (const location of locations) {
        // Check for circular references
        if (location.parentLocationId) {
            const path = getLocationPath(locations, location.id);
            const ids = path.map(l => l.id);
            const uniqueIds = new Set(ids);
            if (ids.length !== uniqueIds.size) {
                issues.push({
                    locationId: location.id,
                    locationCode: location.locationCode,
                    issue: 'Circular reference detected in hierarchy',
                });
            }
            // Check parent exists
            const parent = locations.find(l => l.id === location.parentLocationId);
            if (!parent) {
                issues.push({
                    locationId: location.id,
                    locationCode: location.locationCode,
                    issue: 'Parent location not found',
                });
            }
        }
        // Check for duplicate location codes
        const duplicates = locations.filter(l => l.locationCode === location.locationCode && l.id !== location.id);
        if (duplicates.length > 0) {
            issues.push({
                locationId: location.id,
                locationCode: location.locationCode,
                issue: 'Duplicate location code',
            });
        }
    }
    return {
        isValid: issues.length === 0,
        issues,
    };
}
// ============================================================================
// SECTION 3: LOCATION ATTRIBUTES (Functions 18-26)
// ============================================================================
/**
 * Function 18: Update location capacity
 *
 * @param location - Location to update
 * @param usageChange - Change in usage
 * @returns Updated location
 */
function updateLocationCapacity(location, usageChange) {
    const newUsed = {
        weight: location.used.weight + (usageChange.weightDelta || 0),
        volume: location.used.volume + (usageChange.volumeDelta || 0),
        units: location.used.units + (usageChange.unitsDelta || 0),
    };
    // Determine new status
    let newStatus = location.status;
    if (newUsed.units > 0 && location.status === LocationStatus.AVAILABLE) {
        newStatus = LocationStatus.OCCUPIED;
    }
    else if (newUsed.units === 0 && location.status === LocationStatus.OCCUPIED) {
        newStatus = LocationStatus.AVAILABLE;
    }
    return {
        ...location,
        used: {
            weight: Math.max(0, newUsed.weight),
            volume: Math.max(0, newUsed.volume),
            units: Math.max(0, newUsed.units),
        },
        status: newStatus,
        updatedAt: new Date(),
    };
}
/**
 * Function 19: Calculate location utilization
 *
 * @param location - Location to analyze
 * @returns Utilization percentages
 */
function calculateLocationUtilization(location) {
    const weightUtilization = location.capacity.weight
        ? (location.used.weight / location.capacity.weight) * 100
        : undefined;
    const volumeUtilization = location.capacity.volume
        ? (location.used.volume / location.capacity.volume) * 100
        : undefined;
    const unitsUtilization = location.capacity.units
        ? (location.used.units / location.capacity.units) * 100
        : undefined;
    // Overall utilization is the maximum of available metrics
    const metrics = [weightUtilization, volumeUtilization, unitsUtilization].filter(m => m !== undefined);
    const overallUtilization = metrics.length > 0 ? Math.max(...metrics) : 0;
    return {
        weightUtilization: weightUtilization ? Math.round(weightUtilization * 100) / 100 : undefined,
        volumeUtilization: volumeUtilization ? Math.round(volumeUtilization * 100) / 100 : undefined,
        unitsUtilization: unitsUtilization ? Math.round(unitsUtilization * 100) / 100 : undefined,
        overallUtilization: Math.round(overallUtilization * 100) / 100,
        isAtCapacity: overallUtilization >= 100,
        isOverCapacity: overallUtilization > 100,
    };
}
/**
 * Function 20: Check if location can accommodate item
 *
 * @param location - Location to check
 * @param itemRequirements - Item requirements
 * @returns Whether location can accommodate item
 */
function canLocationAccommodateItem(location, itemRequirements) {
    const reasons = [];
    // Check status
    if (location.status !== LocationStatus.AVAILABLE && location.status !== LocationStatus.OCCUPIED) {
        reasons.push(`Location status is ${location.status}`);
    }
    // Check capacity
    if (itemRequirements.weight && location.capacity.weight) {
        const availableWeight = location.capacity.weight - location.used.weight;
        if (availableWeight < itemRequirements.weight) {
            reasons.push(`Insufficient weight capacity (need ${itemRequirements.weight}, available ${availableWeight})`);
        }
    }
    if (itemRequirements.volume && location.capacity.volume) {
        const availableVolume = location.capacity.volume - location.used.volume;
        if (availableVolume < itemRequirements.volume) {
            reasons.push(`Insufficient volume capacity (need ${itemRequirements.volume}, available ${availableVolume})`);
        }
    }
    if (itemRequirements.units && location.capacity.units) {
        const availableUnits = location.capacity.units - location.used.units;
        if (availableUnits < itemRequirements.units) {
            reasons.push(`Insufficient unit capacity (need ${itemRequirements.units}, available ${availableUnits})`);
        }
    }
    // Check mixed items restriction
    if (!location.allowMixedItems && location.used.units > 0) {
        reasons.push('Location does not allow mixed items and is already occupied');
    }
    // Check product restrictions
    if (location.restrictions) {
        if (itemRequirements.productId && location.restrictions.blockedProductIds?.includes(itemRequirements.productId)) {
            reasons.push('Product is blocked from this location');
        }
        if (itemRequirements.productId && location.restrictions.allowedProductIds && !location.restrictions.allowedProductIds.includes(itemRequirements.productId)) {
            reasons.push('Product is not in allowed list for this location');
        }
        if (itemRequirements.productCategory && location.restrictions.blockedProductCategories?.includes(itemRequirements.productCategory)) {
            reasons.push('Product category is blocked from this location');
        }
        if (itemRequirements.isHazmat && !location.restrictions.hazmatOnly) {
            // Allow hazmat in hazmat-only locations
            if (location.used.units > 0) {
                reasons.push('Hazmat cannot be mixed with regular products');
            }
        }
    }
    return {
        canAccommodate: reasons.length === 0,
        reasons,
    };
}
/**
 * Function 21: Set location velocity rating
 *
 * @param location - Location to update
 * @param velocityRating - New velocity rating
 * @returns Updated location
 */
function setLocationVelocityRating(location, velocityRating) {
    return {
        ...location,
        velocityRating,
        updatedAt: new Date(),
    };
}
/**
 * Function 22: Update location picking sequence
 *
 * @param location - Location to update
 * @param pickingSequence - New picking sequence number
 * @returns Updated location
 */
function updateLocationPickingSequence(location, pickingSequence) {
    return {
        ...location,
        pickingSequence,
        updatedAt: new Date(),
    };
}
/**
 * Function 23: Add location restriction
 *
 * @param location - Location to update
 * @param restriction - Restriction to add
 * @returns Updated location
 */
function addLocationRestriction(location, restriction) {
    const newRestrictions = { ...location.restrictions };
    switch (restriction.type) {
        case 'ALLOWED_PRODUCT':
            newRestrictions.allowedProductIds = [...(newRestrictions.allowedProductIds || []), restriction.value];
            break;
        case 'BLOCKED_PRODUCT':
            newRestrictions.blockedProductIds = [...(newRestrictions.blockedProductIds || []), restriction.value];
            break;
        case 'ALLOWED_CATEGORY':
            newRestrictions.allowedProductCategories = [...(newRestrictions.allowedProductCategories || []), restriction.value];
            break;
        case 'BLOCKED_CATEGORY':
            newRestrictions.blockedProductCategories = [...(newRestrictions.blockedProductCategories || []), restriction.value];
            break;
        case 'MAX_WEIGHT':
            newRestrictions.maxWeight = restriction.value;
            break;
        case 'MAX_VOLUME':
            newRestrictions.maxVolume = restriction.value;
            break;
        case 'HAZMAT_ONLY':
            newRestrictions.hazmatOnly = restriction.value;
            break;
    }
    return {
        ...location,
        restrictions: newRestrictions,
        updatedAt: new Date(),
    };
}
/**
 * Function 24: Remove location restriction
 *
 * @param location - Location to update
 * @param restriction - Restriction to remove
 * @returns Updated location
 */
function removeLocationRestriction(location, restriction) {
    const newRestrictions = { ...location.restrictions };
    switch (restriction.type) {
        case 'ALLOWED_PRODUCT':
            newRestrictions.allowedProductIds = newRestrictions.allowedProductIds?.filter(id => id !== restriction.value);
            break;
        case 'BLOCKED_PRODUCT':
            newRestrictions.blockedProductIds = newRestrictions.blockedProductIds?.filter(id => id !== restriction.value);
            break;
        case 'ALLOWED_CATEGORY':
            newRestrictions.allowedProductCategories = newRestrictions.allowedProductCategories?.filter(cat => cat !== restriction.value);
            break;
        case 'BLOCKED_CATEGORY':
            newRestrictions.blockedProductCategories = newRestrictions.blockedProductCategories?.filter(cat => cat !== restriction.value);
            break;
        case 'MAX_WEIGHT':
            delete newRestrictions.maxWeight;
            break;
        case 'MAX_VOLUME':
            delete newRestrictions.maxVolume;
            break;
        case 'HAZMAT_ONLY':
            delete newRestrictions.hazmatOnly;
            break;
    }
    return {
        ...location,
        restrictions: newRestrictions,
        updatedAt: new Date(),
    };
}
/**
 * Function 25: Update location status
 *
 * @param location - Location to update
 * @param newStatus - New status
 * @param reason - Reason for status change
 * @returns Updated location
 */
function updateLocationStatus(location, newStatus, reason) {
    const metadata = { ...location.metadata };
    if (reason) {
        metadata.lastStatusChangeReason = reason;
        metadata.lastStatusChangeDate = new Date().toISOString();
    }
    return {
        ...location,
        status: newStatus,
        metadata,
        updatedAt: new Date(),
    };
}
/**
 * Function 26: Calculate location dimensions volume
 *
 * @param dimensions - Location dimensions
 * @returns Volume in cubic units
 */
function calculateLocationVolume(dimensions) {
    const volume = dimensions.length * dimensions.width * dimensions.height;
    // Convert to cubic meters if needed
    switch (dimensions.unit) {
        case 'IN':
            return volume / 61023.7; // cubic inches to cubic meters
        case 'CM':
            return volume / 1000000; // cubic centimeters to cubic meters
        case 'M':
            return volume;
        default:
            return volume;
    }
}
// ============================================================================
// SECTION 4: SLOTTING OPTIMIZATION (Functions 27-35)
// ============================================================================
/**
 * Function 27: Create slotting rule
 *
 * @param ruleData - Rule creation data
 * @returns Created slotting rule
 */
function createSlottingRule(ruleData) {
    const now = new Date();
    return {
        id: crypto.randomUUID(),
        warehouseId: ruleData.warehouseId,
        ruleName: ruleData.ruleName,
        ruleType: ruleData.ruleType,
        priority: ruleData.priority || 100,
        status: 'ACTIVE',
        conditions: ruleData.conditions,
        actions: ruleData.actions,
        validFrom: ruleData.validFrom,
        validTo: ruleData.validTo,
        metadata: ruleData.metadata || {},
        createdAt: now,
        updatedAt: now,
    };
}
/**
 * Function 28: Evaluate slotting rules for product
 *
 * @param rules - Active slotting rules
 * @param productData - Product characteristics
 * @returns Matching rules sorted by priority
 */
function evaluateSlottingRules(rules, productData) {
    const now = new Date();
    const matchingRules = rules.filter(rule => {
        // Check if rule is active and within valid date range
        if (rule.status !== 'ACTIVE') {
            return false;
        }
        if (rule.validFrom && now < rule.validFrom) {
            return false;
        }
        if (rule.validTo && now > rule.validTo) {
            return false;
        }
        // Check velocity class condition
        if (rule.conditions.velocityClass && productData.velocityClass) {
            if (!rule.conditions.velocityClass.includes(productData.velocityClass)) {
                return false;
            }
        }
        // Check product category condition
        if (rule.conditions.productCategories && productData.productCategory) {
            if (!rule.conditions.productCategories.includes(productData.productCategory)) {
                return false;
            }
        }
        // Check turnover rate conditions
        if (rule.conditions.minTurnoverRate !== undefined && productData.turnoverRate !== undefined) {
            if (productData.turnoverRate < rule.conditions.minTurnoverRate) {
                return false;
            }
        }
        if (rule.conditions.maxTurnoverRate !== undefined && productData.turnoverRate !== undefined) {
            if (productData.turnoverRate > rule.conditions.maxTurnoverRate) {
                return false;
            }
        }
        return true;
    });
    // Sort by priority (lower number = higher priority)
    return matchingRules.sort((a, b) => a.priority - b.priority);
}
/**
 * Function 29: Generate ABC classification for products
 *
 * @param productMetrics - Product sales/movement data
 * @returns Products with ABC classification
 */
function generateABCClassification(productMetrics) {
    // Calculate total value (revenue or quantity)
    const productsWithValue = productMetrics.map(p => ({
        ...p,
        value: p.revenue || p.quantity || p.pickCount || 0,
    }));
    // Sort by value descending
    productsWithValue.sort((a, b) => b.value - a.value);
    const totalValue = productsWithValue.reduce((sum, p) => sum + p.value, 0);
    let cumulativeValue = 0;
    return productsWithValue.map(product => {
        cumulativeValue += product.value;
        const percentile = (cumulativeValue / totalValue) * 100;
        let classification;
        if (percentile <= 80) {
            classification = VelocityRating.A; // Top 80% of value
        }
        else if (percentile <= 95) {
            classification = VelocityRating.B; // Next 15% of value
        }
        else if (percentile <= 99) {
            classification = VelocityRating.C; // Next 4% of value
        }
        else {
            classification = VelocityRating.D; // Bottom 1% of value
        }
        return {
            productId: product.productId,
            classification,
            percentile: Math.round(percentile * 100) / 100,
            value: product.value,
        };
    });
}
/**
 * Function 30: Calculate optimal slotting based on velocity
 *
 * @param products - Products with velocity ratings
 * @param locations - Available locations
 * @returns Slotting recommendations
 */
function calculateVelocityBasedSlotting(products, locations) {
    const recommendations = [];
    // Group locations by velocity suitability (lower picking sequence = better for high velocity)
    const fastPickLocations = locations
        .filter(loc => loc.status === LocationStatus.AVAILABLE && loc.pickingSequence !== undefined)
        .sort((a, b) => (a.pickingSequence || 999) - (b.pickingSequence || 999));
    for (const product of products) {
        let targetLocation;
        let reason = '';
        let priority = 100;
        // A-velocity items should be in fast-pick locations
        if (product.velocityRating === VelocityRating.A) {
            targetLocation = fastPickLocations.find(loc => loc.pickingSequence && loc.pickingSequence <= 50);
            reason = 'High-velocity item should be in fast-pick location';
            priority = 10;
        }
        // B-velocity items in medium accessibility
        else if (product.velocityRating === VelocityRating.B) {
            targetLocation = fastPickLocations.find(loc => loc.pickingSequence && loc.pickingSequence > 50 && loc.pickingSequence <= 150);
            reason = 'Medium-velocity item placed in moderate accessibility location';
            priority = 50;
        }
        // C and D velocity items in reserve/overflow
        else {
            targetLocation = fastPickLocations.find(loc => loc.pickingSequence && loc.pickingSequence > 150);
            reason = 'Low-velocity item placed in reserve storage';
            priority = 90;
        }
        if (targetLocation && (!product.currentLocationId || product.currentLocationId !== targetLocation.id)) {
            recommendations.push({
                productId: product.productId,
                currentLocationId: product.currentLocationId,
                recommendedLocationId: targetLocation.id,
                recommendedZoneId: targetLocation.zoneId,
                reason,
                priority,
                estimatedImprovement: {
                    pickTimeReduction: product.velocityRating === VelocityRating.A ? 30 : 15,
                },
            });
        }
    }
    return recommendations.sort((a, b) => a.priority - b.priority);
}
/**
 * Function 31: Calculate affinity-based slotting
 *
 * @param orderData - Historical order line data
 * @param threshold - Minimum affinity score (0-1)
 * @returns Product pairs with high affinity
 */
function calculateProductAffinity(orderData, threshold = 0.3) {
    // Count co-occurrences
    const coOccurrenceMap = new Map();
    const productOrderCount = new Map();
    for (const order of orderData) {
        const uniqueProducts = [...new Set(order.productIds)];
        // Count individual product occurrences
        for (const productId of uniqueProducts) {
            productOrderCount.set(productId, (productOrderCount.get(productId) || 0) + 1);
        }
        // Count co-occurrences
        for (let i = 0; i < uniqueProducts.length; i++) {
            for (let j = i + 1; j < uniqueProducts.length; j++) {
                const pair = [uniqueProducts[i], uniqueProducts[j]].sort().join('|');
                coOccurrenceMap.set(pair, (coOccurrenceMap.get(pair) || 0) + 1);
            }
        }
    }
    // Calculate affinity scores
    const affinities = [];
    for (const [pair, coOccurrences] of coOccurrenceMap.entries()) {
        const [productA, productB] = pair.split('|');
        const countA = productOrderCount.get(productA) || 0;
        const countB = productOrderCount.get(productB) || 0;
        // Affinity score = co-occurrences / min(countA, countB)
        const affinityScore = coOccurrences / Math.min(countA, countB);
        if (affinityScore >= threshold) {
            affinities.push({
                productA,
                productB,
                affinityScore: Math.round(affinityScore * 1000) / 1000,
                coOccurrences,
            });
        }
    }
    return affinities.sort((a, b) => b.affinityScore - a.affinityScore);
}
/**
 * Function 32: Optimize pick path for zone
 *
 * @param locations - Locations to pick from
 * @param strategy - Picking strategy
 * @returns Optimized pick sequence
 */
function optimizePickPath(locations, strategy = 'S_SHAPE') {
    if (locations.length === 0) {
        return {
            warehouseId: '',
            zoneId: '',
            optimizedSequence: [],
            totalDistance: 0,
            totalTime: 0,
            strategy,
        };
    }
    const warehouseId = locations[0].warehouseId;
    const zoneId = locations[0].zoneId;
    // Sort locations by aisle, then bay, then level
    const sortedLocations = [...locations].sort((a, b) => {
        const aisleA = parseInt(a.address?.aisle || '0');
        const aisleB = parseInt(b.address?.aisle || '0');
        if (aisleA !== aisleB)
            return aisleA - aisleB;
        const bayA = parseInt(a.address?.bay || '0');
        const bayB = parseInt(b.address?.bay || '0');
        if (bayA !== bayB)
            return bayA - bayB;
        const levelA = parseInt(a.address?.level || '0');
        const levelB = parseInt(b.address?.level || '0');
        return levelA - levelB;
    });
    let optimizedSequence = [];
    let totalDistance = 0;
    switch (strategy) {
        case 'S_SHAPE':
            // Serpentine pattern through aisles
            let currentAisle = '';
            let ascending = true;
            sortedLocations.forEach((loc, index) => {
                const aisle = loc.address?.aisle || '';
                if (aisle !== currentAisle) {
                    currentAisle = aisle;
                    ascending = !ascending;
                }
                const distance = index > 0 ? 10 : 0; // Simplified distance
                totalDistance += distance;
                optimizedSequence.push({
                    locationId: loc.id,
                    locationCode: loc.locationCode,
                    sequence: index + 1,
                    distance,
                    estimatedTime: 5, // 5 seconds per location
                });
            });
            break;
        case 'RETURN':
            // Return to main aisle between picks
            sortedLocations.forEach((loc, index) => {
                const distance = index > 0 ? 15 : 0; // Longer due to returns
                totalDistance += distance;
                optimizedSequence.push({
                    locationId: loc.id,
                    locationCode: loc.locationCode,
                    sequence: index + 1,
                    distance,
                    estimatedTime: 7,
                });
            });
            break;
        default:
            // Default to simple sequence
            sortedLocations.forEach((loc, index) => {
                const distance = index > 0 ? 10 : 0;
                totalDistance += distance;
                optimizedSequence.push({
                    locationId: loc.id,
                    locationCode: loc.locationCode,
                    sequence: index + 1,
                    distance,
                    estimatedTime: 5,
                });
            });
    }
    const totalTime = optimizedSequence.reduce((sum, item) => sum + item.estimatedTime, 0);
    return {
        warehouseId,
        zoneId,
        optimizedSequence,
        totalDistance,
        totalTime,
        strategy,
    };
}
/**
 * Function 33: Generate seasonal slotting recommendations
 *
 * @param products - Products with seasonal data
 * @param currentMonth - Current month (1-12)
 * @param locations - Available locations
 * @returns Seasonal slotting recommendations
 */
function generateSeasonalSlottingRecommendations(products, currentMonth, locations) {
    const recommendations = [];
    const primeLocations = locations
        .filter(loc => loc.status === LocationStatus.AVAILABLE && loc.pickingSequence && loc.pickingSequence <= 100)
        .sort((a, b) => (a.pickingSequence || 999) - (b.pickingSequence || 999));
    for (const product of products) {
        const isInSeason = product.seasonalPeak.some(peak => currentMonth >= peak.startMonth && currentMonth <= peak.endMonth);
        if (isInSeason) {
            const targetLocation = primeLocations.find(loc => !product.currentLocationId || product.currentLocationId !== loc.id);
            if (targetLocation) {
                recommendations.push({
                    productId: product.productId,
                    currentLocationId: product.currentLocationId,
                    recommendedLocationId: targetLocation.id,
                    recommendedZoneId: targetLocation.zoneId,
                    reason: 'Product in seasonal peak - move to prime picking location',
                    priority: 20,
                    estimatedImprovement: {
                        pickTimeReduction: 25,
                    },
                });
            }
        }
    }
    return recommendations;
}
/**
 * Function 34: Validate slotting rule configuration
 *
 * @param rule - Slotting rule to validate
 * @returns Validation result
 */
function validateSlottingRule(rule) {
    const errors = [];
    const warnings = [];
    // Validate conditions
    if (!rule.conditions || Object.keys(rule.conditions).length === 0) {
        errors.push('Rule must have at least one condition');
    }
    // Validate actions
    if (!rule.actions || Object.keys(rule.actions).length === 0) {
        errors.push('Rule must have at least one action');
    }
    // Validate date range
    if (rule.validFrom && rule.validTo && rule.validFrom > rule.validTo) {
        errors.push('Valid from date must be before valid to date');
    }
    // Check for conflicting conditions
    if (rule.conditions.minTurnoverRate && rule.conditions.maxTurnoverRate &&
        rule.conditions.minTurnoverRate > rule.conditions.maxTurnoverRate) {
        errors.push('Minimum turnover rate cannot be greater than maximum');
    }
    // Warnings for potentially ineffective rules
    if (rule.priority > 500) {
        warnings.push('Very low priority may result in rule rarely being applied');
    }
    if (rule.validTo && rule.validTo < new Date()) {
        warnings.push('Rule expiration date is in the past');
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Function 35: Calculate slotting efficiency metrics
 *
 * @param assignments - Current location assignments
 * @param picks - Recent pick transactions
 * @returns Efficiency metrics
 */
function calculateSlottingEfficiency(assignments, picks) {
    const avgPickTime = picks.length > 0
        ? picks.reduce((sum, p) => sum + p.pickTime, 0) / picks.length
        : 0;
    const avgTravelDistance = picks.length > 0
        ? picks.reduce((sum, p) => sum + p.travelDistance, 0) / picks.length
        : 0;
    // This is a simplified calculation - in reality, would need location and product velocity data
    const velocityAlignment = 75; // Placeholder
    const utilizationRate = assignments.length > 0
        ? (assignments.filter(a => a.quantity > 0).length / assignments.length) * 100
        : 0;
    const recommendations = [];
    if (avgPickTime > 120) {
        recommendations.push('High average pick time - review slotting for fast movers');
    }
    if (avgTravelDistance > 100) {
        recommendations.push('High travel distance - consider clustering frequently picked items');
    }
    if (utilizationRate < 60) {
        recommendations.push('Low utilization - consider consolidating locations');
    }
    return {
        avgPickTime: Math.round(avgPickTime * 100) / 100,
        avgTravelDistance: Math.round(avgTravelDistance * 100) / 100,
        velocityAlignment: Math.round(velocityAlignment * 100) / 100,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        recommendations,
    };
}
// ============================================================================
// SECTION 5: CAPACITY MANAGEMENT (Functions 36-43)
// ============================================================================
/**
 * Function 36: Create location assignment
 *
 * @param assignmentData - Assignment creation data
 * @returns Created location assignment
 */
function createLocationAssignment(assignmentData) {
    const now = new Date();
    return {
        id: crypto.randomUUID(),
        locationId: assignmentData.locationId,
        productId: assignmentData.productId,
        lotNumber: assignmentData.lotNumber,
        licensePlateId: assignmentData.licensePlateId,
        quantity: assignmentData.quantity,
        quantityUom: assignmentData.quantityUom,
        weight: assignmentData.weight,
        volume: assignmentData.volume,
        assignmentType: assignmentData.assignmentType,
        allocatedQuantity: 0,
        receivedDate: assignmentData.receivedDate,
        expiryDate: assignmentData.expiryDate,
        lastPickDate: undefined,
        pickCount: 0,
        metadata: assignmentData.metadata || {},
        createdAt: now,
        updatedAt: now,
    };
}
/**
 * Function 37: Update assignment quantity
 *
 * @param assignment - Assignment to update
 * @param quantityChange - Change in quantity
 * @returns Updated assignment
 */
function updateAssignmentQuantity(assignment, quantityChange) {
    const newQuantity = assignment.quantity + quantityChange.quantityDelta;
    const updated = {
        ...assignment,
        quantity: Math.max(0, newQuantity),
        weight: assignment.weight ? assignment.weight + (quantityChange.weightDelta || 0) : assignment.weight,
        volume: assignment.volume ? assignment.volume + (quantityChange.volumeDelta || 0) : assignment.volume,
        updatedAt: new Date(),
    };
    if (quantityChange.isPick) {
        updated.lastPickDate = new Date();
        updated.pickCount = assignment.pickCount + 1;
    }
    return updated;
}
/**
 * Function 38: Calculate available capacity by zone
 *
 * @param zones - Warehouse zones
 * @param locations - Storage locations
 * @param assignments - Current assignments
 * @returns Available capacity by zone
 */
function calculateAvailableCapacityByZone(zones, locations, assignments) {
    return zones.map(zone => {
        const zoneLocations = locations.filter(loc => loc.zoneId === zone.id);
        const totalCapacity = {
            weight: zoneLocations.reduce((sum, loc) => sum + (loc.capacity.weight || 0), 0),
            volume: zoneLocations.reduce((sum, loc) => sum + (loc.capacity.volume || 0), 0),
            units: zoneLocations.reduce((sum, loc) => sum + (loc.capacity.units || 0), 0),
        };
        const usedCapacity = {
            weight: zoneLocations.reduce((sum, loc) => sum + loc.used.weight, 0),
            volume: zoneLocations.reduce((sum, loc) => sum + loc.used.volume, 0),
            units: zoneLocations.reduce((sum, loc) => sum + loc.used.units, 0),
        };
        const availableCapacity = {
            weight: totalCapacity.weight - usedCapacity.weight,
            volume: totalCapacity.volume - usedCapacity.volume,
            units: totalCapacity.units - usedCapacity.units,
        };
        const utilizationRate = totalCapacity.volume > 0
            ? (usedCapacity.volume / totalCapacity.volume) * 100
            : 0;
        return {
            zoneId: zone.id,
            zoneCode: zone.zoneCode,
            totalCapacity,
            usedCapacity,
            availableCapacity,
            utilizationRate: Math.round(utilizationRate * 100) / 100,
        };
    });
}
/**
 * Function 39: Find optimal location for product putaway
 *
 * @param product - Product to store
 * @param locations - Available locations
 * @param strategy - Putaway strategy
 * @returns Recommended location
 */
function findOptimalPutawayLocation(product, locations, strategy = 'VELOCITY') {
    // Filter available locations
    const availableLocations = locations.filter(loc => {
        const check = canLocationAccommodateItem(loc, product);
        return check.canAccommodate;
    });
    if (availableLocations.length === 0) {
        return null;
    }
    switch (strategy) {
        case 'VELOCITY':
            // Match velocity rating to location
            if (product.velocityRating) {
                const matchingLocations = availableLocations.filter(loc => loc.velocityRating === product.velocityRating);
                if (matchingLocations.length > 0) {
                    return matchingLocations[0];
                }
            }
            return availableLocations[0];
        case 'FILL_RATE':
            // Prefer locations that are partially filled (better space utilization)
            const partiallyFilled = availableLocations
                .filter(loc => loc.used.units > 0)
                .sort((a, b) => b.used.volume - a.used.volume);
            return partiallyFilled[0] || availableLocations[0];
        case 'CLOSEST':
            // Prefer locations with lowest picking sequence (closest to shipping)
            return availableLocations.sort((a, b) => (a.pickingSequence || 999) - (b.pickingSequence || 999))[0];
        case 'RANDOM':
            return availableLocations[Math.floor(Math.random() * availableLocations.length)];
        case 'FIXED':
        default:
            return availableLocations[0];
    }
}
/**
 * Function 40: Generate capacity utilization report
 *
 * @param warehouse - Warehouse data
 * @param zones - Zones in warehouse
 * @param locations - All locations
 * @returns Comprehensive capacity report
 */
function generateCapacityUtilizationReport(warehouse, zones, locations) {
    const totalCapacity = locations.reduce((sum, loc) => sum + (loc.capacity.volume || 0), 0);
    const usedCapacity = locations.reduce((sum, loc) => sum + loc.used.volume, 0);
    const utilizationRate = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
    const byZone = zones.map(zone => {
        const zoneLocations = locations.filter(loc => loc.zoneId === zone.id);
        const zoneTotalCapacity = zoneLocations.reduce((sum, loc) => sum + (loc.capacity.volume || 0), 0);
        const zoneUsedCapacity = zoneLocations.reduce((sum, loc) => sum + loc.used.volume, 0);
        const zoneUtilization = zoneTotalCapacity > 0 ? (zoneUsedCapacity / zoneTotalCapacity) * 100 : 0;
        return {
            zoneId: zone.id,
            zoneCode: zone.zoneCode,
            utilizationRate: Math.round(zoneUtilization * 100) / 100,
        };
    });
    const byVelocity = [
        VelocityRating.A,
        VelocityRating.B,
        VelocityRating.C,
        VelocityRating.D,
    ].map(rating => {
        const ratingLocations = locations.filter(loc => loc.velocityRating === rating);
        const ratingTotalCapacity = ratingLocations.reduce((sum, loc) => sum + (loc.capacity.volume || 0), 0);
        const ratingUsedCapacity = ratingLocations.reduce((sum, loc) => sum + loc.used.volume, 0);
        const ratingUtilization = ratingTotalCapacity > 0 ? (ratingUsedCapacity / ratingTotalCapacity) * 100 : 0;
        return {
            velocityRating: rating,
            utilizationRate: Math.round(ratingUtilization * 100) / 100,
        };
    });
    const recommendations = [];
    if (utilizationRate > 90) {
        recommendations.push('Warehouse near capacity - consider expansion or overflow location');
    }
    else if (utilizationRate < 40) {
        recommendations.push('Low overall utilization - review zone assignments and consolidation opportunities');
    }
    const imbalancedZones = byZone.filter(z => z.utilizationRate > 95 || z.utilizationRate < 30);
    if (imbalancedZones.length > 0) {
        recommendations.push(`${imbalancedZones.length} zones have imbalanced utilization - review zone balancing`);
    }
    return {
        warehouseId: warehouse.id,
        reportDate: new Date(),
        overall: {
            totalCapacity,
            usedCapacity,
            utilizationRate: Math.round(utilizationRate * 100) / 100,
        },
        byZone,
        byVelocity,
        recommendations,
    };
}
/**
 * Function 41: Allocate inventory to location
 *
 * @param assignment - Location assignment
 * @param allocationQuantity - Quantity to allocate
 * @returns Updated assignment
 */
function allocateInventoryToLocation(assignment, allocationQuantity) {
    const newAllocatedQuantity = assignment.allocatedQuantity + allocationQuantity;
    if (newAllocatedQuantity > assignment.quantity) {
        throw new Error(`Cannot allocate ${allocationQuantity} - only ${assignment.quantity - assignment.allocatedQuantity} available`);
    }
    return {
        ...assignment,
        allocatedQuantity: newAllocatedQuantity,
        updatedAt: new Date(),
    };
}
/**
 * Function 42: Release allocated inventory
 *
 * @param assignment - Location assignment
 * @param releaseQuantity - Quantity to release
 * @returns Updated assignment
 */
function releaseAllocatedInventory(assignment, releaseQuantity) {
    const newAllocatedQuantity = Math.max(0, assignment.allocatedQuantity - releaseQuantity);
    return {
        ...assignment,
        allocatedQuantity: newAllocatedQuantity,
        updatedAt: new Date(),
    };
}
/**
 * Function 43: Calculate location turnover rate
 *
 * @param location - Location to analyze
 * @param assignments - Historical assignments
 * @param periodDays - Analysis period in days
 * @returns Turnover metrics
 */
function calculateLocationTurnoverRate(location, assignments, periodDays = 30) {
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - periodDays);
    const locationAssignments = assignments.filter(a => a.locationId === location.id);
    const recentAssignments = locationAssignments.filter(a => a.createdAt >= periodStart || (a.lastPickDate && a.lastPickDate >= periodStart));
    const totalPicks = recentAssignments.reduce((sum, a) => sum + a.pickCount, 0);
    const avgPicksPerDay = totalPicks / periodDays;
    // Calculate dwell time
    const dwellTimes = [];
    for (const assignment of recentAssignments) {
        if (assignment.receivedDate && assignment.lastPickDate) {
            const dwellMs = assignment.lastPickDate.getTime() - assignment.receivedDate.getTime();
            const dwellDays = dwellMs / (1000 * 60 * 60 * 24);
            dwellTimes.push(dwellDays);
        }
    }
    const avgDwellTime = dwellTimes.length > 0
        ? dwellTimes.reduce((sum, d) => sum + d, 0) / dwellTimes.length
        : 0;
    // Simplified turnover calculation
    const turnoverRate = avgDwellTime > 0 ? periodDays / avgDwellTime : 0;
    return {
        locationId: location.id,
        locationCode: location.locationCode,
        turnoverRate: Math.round(turnoverRate * 100) / 100,
        avgPicksPerDay: Math.round(avgPicksPerDay * 100) / 100,
        avgDwellTime: Math.round(avgDwellTime * 100) / 100,
        emptyDays: 0, // Would need historical status data
        utilizationDays: periodDays, // Would need historical status data
    };
}
// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================
exports.default = {
    // Section 1: Zone Management (1-9)
    createWarehouseZone,
    updateZoneCapacity,
    calculateZoneUtilization,
    filterZonesByTypeAndStatus,
    sortZonesByPickPriority,
    identifyZonesRequiringAttention,
    calculateOptimalZoneAllocation,
    generateZoneCapacityAnalysis,
    generateZoneRebalancingPlan,
    // Section 2: Location Hierarchy (10-17)
    createStorageLocation,
    buildLocationHierarchy,
    getAllChildLocations,
    getLocationPath,
    generateLocationCode,
    parseLocationCode,
    findAvailableLocations,
    validateLocationHierarchy,
    // Section 3: Location Attributes (18-26)
    updateLocationCapacity,
    calculateLocationUtilization,
    canLocationAccommodateItem,
    setLocationVelocityRating,
    updateLocationPickingSequence,
    addLocationRestriction,
    removeLocationRestriction,
    updateLocationStatus,
    calculateLocationVolume,
    // Section 4: Slotting Optimization (27-35)
    createSlottingRule,
    evaluateSlottingRules,
    generateABCClassification,
    calculateVelocityBasedSlotting,
    calculateProductAffinity,
    optimizePickPath,
    generateSeasonalSlottingRecommendations,
    validateSlottingRule,
    calculateSlottingEfficiency,
    // Section 5: Capacity Management (36-43)
    createLocationAssignment,
    updateAssignmentQuantity,
    calculateAvailableCapacityByZone,
    findOptimalPutawayLocation,
    generateCapacityUtilizationReport,
    allocateInventoryToLocation,
    releaseAllocatedInventory,
    calculateLocationTurnoverRate,
};
//# sourceMappingURL=warehouse-layout-management-kit.js.map