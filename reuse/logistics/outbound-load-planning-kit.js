"use strict";
/**
 * LOC: LOG-LOAD-001
 * File: /reuse/logistics/outbound-load-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Logistics controllers
 *   - Warehouse management services
 *   - Transportation management systems
 *   - Route optimization engines
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
exports.DockDoorStatus = exports.LoadMode = exports.EquipmentType = exports.LoadStatus = void 0;
exports.createLoadPlan = createLoadPlan;
exports.addShipmentToLoad = addShipmentToLoad;
exports.removeShipmentFromLoad = removeShipmentFromLoad;
exports.addStopToLoad = addStopToLoad;
exports.recalculateLoadMetrics = recalculateLoadMetrics;
exports.validateLoadPlan = validateLoadPlan;
exports.cloneLoadPlan = cloneLoadPlan;
exports.updateLoadStatus = updateLoadStatus;
exports.getVehicleCapacity = getVehicleCapacity;
exports.validateLoadCapacity = validateLoadCapacity;
exports.calculateDimensionalWeight = calculateDimensionalWeight;
exports.calculateOptimalEquipment = calculateOptimalEquipment;
exports.calculateLoadDensity = calculateLoadDensity;
exports.determineFreightClass = determineFreightClass;
exports.getAvailableCapacity = getAvailableCapacity;
exports.calculateLoadStability = calculateLoadStability;
exports.optimizeLoadBuilding = optimizeLoadBuilding;
exports.consolidateLoads = consolidateLoads;
exports.optimizeStopSequence = optimizeStopSequence;
exports.balanceLoadsAcrossVehicles = balanceLoadsAcrossVehicles;
exports.generateLoadAlternatives = generateLoadAlternatives;
exports.scoreLoadPlan = scoreLoadPlan;
exports.mergeCompatibleLoads = mergeCompatibleLoads;
exports.optimizeLoadForPriority = optimizeLoadForPriority;
exports.createDockReservation = createDockReservation;
exports.findAvailableDockDoors = findAvailableDockDoors;
exports.optimizeDockAssignments = optimizeDockAssignments;
exports.estimateLoadingTime = estimateLoadingTime;
exports.validateDockAvailability = validateDockAvailability;
exports.checkInLoadAtDock = checkInLoadAtDock;
exports.checkOutLoadFromDock = checkOutLoadFromDock;
exports.generateDockUtilizationReport = generateDockUtilizationReport;
exports.generateLoadManifest = generateLoadManifest;
exports.generateBillOfLading = generateBillOfLading;
exports.generatePackingList = generatePackingList;
exports.generateRouteSheet = generateRouteSheet;
exports.validateManifest = validateManifest;
exports.exportManifestToPDF = exportManifestToPDF;
exports.generateCarrierTender = generateCarrierTender;
/**
 * File: /reuse/logistics/outbound-load-planning-kit.ts
 * Locator: WC-LOGISTICS-LOAD-PLAN-001
 * Purpose: Comprehensive Outbound Load Planning & Optimization - Complete load building and route optimization for logistics operations
 *
 * Upstream: Independent utility module for load planning operations
 * Downstream: ../backend/logistics/*, TMS modules, WMS services, Route optimization
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, crypto
 * Exports: 39 utility functions for load planning, capacity optimization, route planning, dock scheduling, manifest generation
 *
 * LLM Context: Enterprise-grade load planning utilities for logistics operations to compete with Oracle JD Edwards TMS.
 * Provides comprehensive load building, vehicle capacity planning, weight/cube calculations, route optimization,
 * multi-stop planning, dock scheduling, yard management, manifest generation, freight consolidation,
 * carrier selection, and load tendering operations with NestJS security patterns.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Load status enumeration
 */
var LoadStatus;
(function (LoadStatus) {
    LoadStatus["DRAFT"] = "DRAFT";
    LoadStatus["PLANNED"] = "PLANNED";
    LoadStatus["OPTIMIZED"] = "OPTIMIZED";
    LoadStatus["ASSIGNED"] = "ASSIGNED";
    LoadStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LoadStatus["LOADED"] = "LOADED";
    LoadStatus["DISPATCHED"] = "DISPATCHED";
    LoadStatus["IN_TRANSIT"] = "IN_TRANSIT";
    LoadStatus["DELIVERED"] = "DELIVERED";
    LoadStatus["COMPLETED"] = "COMPLETED";
    LoadStatus["CANCELLED"] = "CANCELLED";
})(LoadStatus || (exports.LoadStatus = LoadStatus = {}));
/**
 * Equipment type enumeration
 */
var EquipmentType;
(function (EquipmentType) {
    EquipmentType["DRY_VAN_53"] = "DRY_VAN_53";
    EquipmentType["DRY_VAN_48"] = "DRY_VAN_48";
    EquipmentType["REEFER_53"] = "REEFER_53";
    EquipmentType["FLATBED_48"] = "FLATBED_48";
    EquipmentType["FLATBED_53"] = "FLATBED_53";
    EquipmentType["BOX_TRUCK_24"] = "BOX_TRUCK_24";
    EquipmentType["BOX_TRUCK_26"] = "BOX_TRUCK_26";
    EquipmentType["SPRINTER_VAN"] = "SPRINTER_VAN";
    EquipmentType["STRAIGHT_TRUCK"] = "STRAIGHT_TRUCK";
    EquipmentType["CONTAINER_20"] = "CONTAINER_20";
    EquipmentType["CONTAINER_40"] = "CONTAINER_40";
    EquipmentType["CONTAINER_40_HC"] = "CONTAINER_40_HC";
})(EquipmentType || (exports.EquipmentType = EquipmentType = {}));
/**
 * Load mode enumeration
 */
var LoadMode;
(function (LoadMode) {
    LoadMode["LTL"] = "LTL";
    LoadMode["FTL"] = "FTL";
    LoadMode["PARCEL"] = "PARCEL";
    LoadMode["INTERMODAL"] = "INTERMODAL";
    LoadMode["DEDICATED"] = "DEDICATED";
    LoadMode["POOL"] = "POOL";
})(LoadMode || (exports.LoadMode = LoadMode = {}));
/**
 * Dock door status
 */
var DockDoorStatus;
(function (DockDoorStatus) {
    DockDoorStatus["AVAILABLE"] = "AVAILABLE";
    DockDoorStatus["RESERVED"] = "RESERVED";
    DockDoorStatus["OCCUPIED"] = "OCCUPIED";
    DockDoorStatus["MAINTENANCE"] = "MAINTENANCE";
    DockDoorStatus["CLOSED"] = "CLOSED";
})(DockDoorStatus || (exports.DockDoorStatus = DockDoorStatus = {}));
// ============================================================================
// SECTION 1: LOAD PLAN CREATION (Functions 1-8)
// ============================================================================
/**
 * 1. Creates a new load plan instance.
 *
 * @param {Object} config - Load plan configuration
 * @returns {LoadPlan} New load plan
 *
 * @example
 * ```typescript
 * const loadPlan = createLoadPlan({
 *   mode: LoadMode.FTL,
 *   equipmentType: EquipmentType.DRY_VAN_53,
 *   createdBy: 'PLANNER-001'
 * });
 * ```
 */
function createLoadPlan(config) {
    const loadId = generateLoadId();
    const loadNumber = generateLoadNumber();
    const capacity = getVehicleCapacity(config.equipmentType);
    return {
        loadId,
        loadNumber,
        status: LoadStatus.DRAFT,
        mode: config.mode,
        equipmentType: config.equipmentType,
        capacity,
        shipmentUnits: [],
        stops: [],
        totalWeight: 0,
        totalVolume: 0,
        totalPallets: 0,
        totalPieces: 0,
        totalValue: 0,
        utilizationWeight: 0,
        utilizationVolume: 0,
        utilizationPallets: 0,
        totalDistance: 0,
        estimatedDuration: 0,
        plannedDepartureTime: config.plannedDepartureTime,
        createdAt: new Date(),
        createdBy: config.createdBy,
    };
}
/**
 * 2. Adds shipment unit to load plan.
 *
 * @param {LoadPlan} loadPlan - Load plan to update
 * @param {ShipmentUnit} unit - Shipment unit to add
 * @returns {LoadPlan} Updated load plan
 *
 * @example
 * ```typescript
 * const updated = addShipmentToLoad(loadPlan, shipmentUnit);
 * ```
 */
function addShipmentToLoad(loadPlan, unit) {
    // Validate capacity
    const validation = validateLoadCapacity(loadPlan, [unit]);
    if (!validation.canFit) {
        throw new Error(`Cannot add shipment: ${validation.reason}`);
    }
    const updatedPlan = {
        ...loadPlan,
        shipmentUnits: [...loadPlan.shipmentUnits, unit],
    };
    return recalculateLoadMetrics(updatedPlan);
}
/**
 * 3. Removes shipment unit from load plan.
 *
 * @param {LoadPlan} loadPlan - Load plan to update
 * @param {string} unitId - Unit ID to remove
 * @returns {LoadPlan} Updated load plan
 *
 * @example
 * ```typescript
 * const updated = removeShipmentFromLoad(loadPlan, 'UNIT-123');
 * ```
 */
function removeShipmentFromLoad(loadPlan, unitId) {
    const updatedPlan = {
        ...loadPlan,
        shipmentUnits: loadPlan.shipmentUnits.filter(u => u.unitId !== unitId),
        stops: loadPlan.stops.map(stop => ({
            ...stop,
            shipmentUnits: stop.shipmentUnits.filter(id => id !== unitId),
        })).filter(stop => stop.shipmentUnits.length > 0),
    };
    return recalculateLoadMetrics(updatedPlan);
}
/**
 * 4. Adds stop to load plan.
 *
 * @param {LoadPlan} loadPlan - Load plan to update
 * @param {Partial<LoadStop>} stop - Stop details
 * @returns {LoadPlan} Updated load plan
 *
 * @example
 * ```typescript
 * const updated = addStopToLoad(loadPlan, {
 *   type: 'DELIVERY',
 *   address: deliveryAddress,
 *   shipmentUnits: ['UNIT-123', 'UNIT-456']
 * });
 * ```
 */
function addStopToLoad(loadPlan, stop) {
    const stopId = crypto.randomUUID();
    const stopNumber = loadPlan.stops.length + 1;
    const newStop = {
        stopId,
        stopNumber,
        type: stop.type || 'DELIVERY',
        address: stop.address,
        shipmentUnits: stop.shipmentUnits || [],
        appointmentRequired: stop.appointmentRequired || false,
        appointmentTime: stop.appointmentTime,
        distanceFromPrevious: 0,
        durationFromPrevious: 0,
        serviceTime: stop.serviceTime || 30, // Default 30 minutes
        specialInstructions: stop.specialInstructions,
        contactName: stop.contactName,
        contactPhone: stop.contactPhone,
    };
    return {
        ...loadPlan,
        stops: [...loadPlan.stops, newStop],
    };
}
/**
 * 5. Recalculates all load metrics (weight, volume, utilization).
 *
 * @param {LoadPlan} loadPlan - Load plan to recalculate
 * @returns {LoadPlan} Updated load plan
 *
 * @example
 * ```typescript
 * const updated = recalculateLoadMetrics(loadPlan);
 * ```
 */
function recalculateLoadMetrics(loadPlan) {
    const totalWeight = loadPlan.shipmentUnits.reduce((sum, u) => sum + u.weight, 0);
    const totalVolume = loadPlan.shipmentUnits.reduce((sum, u) => sum + u.volume, 0);
    const totalPallets = loadPlan.shipmentUnits.reduce((sum, u) => sum + u.palletCount, 0);
    const totalPieces = loadPlan.shipmentUnits.reduce((sum, u) => sum + u.pieceCount, 0);
    const totalValue = loadPlan.shipmentUnits.reduce((sum, u) => sum + u.value, 0);
    const utilizationWeight = (totalWeight / loadPlan.capacity.maxWeight) * 100;
    const utilizationVolume = (totalVolume / loadPlan.capacity.maxVolume) * 100;
    const utilizationPallets = (totalPallets / loadPlan.capacity.maxPallets) * 100;
    return {
        ...loadPlan,
        totalWeight,
        totalVolume,
        totalPallets,
        totalPieces,
        totalValue,
        utilizationWeight: Math.min(utilizationWeight, 100),
        utilizationVolume: Math.min(utilizationVolume, 100),
        utilizationPallets: Math.min(utilizationPallets, 100),
    };
}
/**
 * 6. Validates load plan completeness and compliance.
 *
 * @param {LoadPlan} loadPlan - Load plan to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateLoadPlan(loadPlan);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
function validateLoadPlan(loadPlan) {
    const errors = [];
    const warnings = [];
    // Check shipments
    if (loadPlan.shipmentUnits.length === 0) {
        errors.push('Load plan must have at least one shipment');
    }
    // Check stops
    if (loadPlan.stops.length === 0) {
        errors.push('Load plan must have at least one stop');
    }
    // Check capacity
    if (loadPlan.totalWeight > loadPlan.capacity.maxWeight) {
        errors.push(`Weight exceeds capacity: ${loadPlan.totalWeight} > ${loadPlan.capacity.maxWeight}`);
    }
    if (loadPlan.totalVolume > loadPlan.capacity.maxVolume) {
        errors.push(`Volume exceeds capacity: ${loadPlan.totalVolume} > ${loadPlan.capacity.maxVolume}`);
    }
    if (loadPlan.totalPallets > loadPlan.capacity.maxPallets) {
        errors.push(`Pallets exceed capacity: ${loadPlan.totalPallets} > ${loadPlan.capacity.maxPallets}`);
    }
    // Check hazmat
    const hasHazmat = loadPlan.shipmentUnits.some(u => u.hazmat);
    if (hasHazmat && !loadPlan.capacity.hazmatCapable) {
        errors.push('Equipment not rated for hazmat shipments');
    }
    // Check temperature control
    const needsTemperatureControl = loadPlan.shipmentUnits.some(u => u.temperatureControlled);
    if (needsTemperatureControl && !loadPlan.capacity.temperatureControlled) {
        errors.push('Equipment not temperature controlled');
    }
    // Warnings for low utilization
    if (loadPlan.utilizationWeight < 70 && loadPlan.mode === LoadMode.FTL) {
        warnings.push(`Low weight utilization: ${loadPlan.utilizationWeight.toFixed(1)}%`);
    }
    if (loadPlan.utilizationVolume < 70 && loadPlan.mode === LoadMode.FTL) {
        warnings.push(`Low volume utilization: ${loadPlan.utilizationVolume.toFixed(1)}%`);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * 7. Clones load plan for modification.
 *
 * @param {LoadPlan} loadPlan - Load plan to clone
 * @returns {LoadPlan} Cloned load plan
 *
 * @example
 * ```typescript
 * const clone = cloneLoadPlan(originalLoadPlan);
 * ```
 */
function cloneLoadPlan(loadPlan) {
    const clone = JSON.parse(JSON.stringify(loadPlan));
    clone.loadId = generateLoadId();
    clone.loadNumber = generateLoadNumber();
    clone.status = LoadStatus.DRAFT;
    clone.createdAt = new Date();
    return clone;
}
/**
 * 8. Updates load status with audit trail.
 *
 * @param {LoadPlan} loadPlan - Load plan to update
 * @param {LoadStatus} newStatus - New status
 * @param {string} updatedBy - User ID
 * @returns {LoadPlan} Updated load plan
 *
 * @example
 * ```typescript
 * const updated = updateLoadStatus(loadPlan, LoadStatus.OPTIMIZED, 'PLANNER-001');
 * ```
 */
function updateLoadStatus(loadPlan, newStatus, updatedBy) {
    return {
        ...loadPlan,
        status: newStatus,
        metadata: {
            ...loadPlan.metadata,
            statusHistory: [
                ...(loadPlan.metadata?.statusHistory || []),
                {
                    status: newStatus,
                    timestamp: new Date(),
                    updatedBy,
                },
            ],
        },
    };
}
// ============================================================================
// SECTION 2: CAPACITY PLANNING (Functions 9-16)
// ============================================================================
/**
 * 9. Gets vehicle capacity specifications for equipment type.
 *
 * @param {EquipmentType} equipmentType - Equipment type
 * @returns {VehicleCapacity} Capacity specifications
 *
 * @example
 * ```typescript
 * const capacity = getVehicleCapacity(EquipmentType.DRY_VAN_53);
 * ```
 */
function getVehicleCapacity(equipmentType) {
    const capacities = {
        [EquipmentType.DRY_VAN_53]: {
            equipmentType,
            maxWeight: 45000,
            maxVolume: 3800,
            maxLength: 53,
            maxWidth: 8.5,
            maxHeight: 9,
            maxPallets: 26,
            temperatureControlled: false,
            hazmatCapable: true,
            liftgateRequired: false,
        },
        [EquipmentType.DRY_VAN_48]: {
            equipmentType,
            maxWeight: 44000,
            maxVolume: 3400,
            maxLength: 48,
            maxWidth: 8.5,
            maxHeight: 9,
            maxPallets: 24,
            temperatureControlled: false,
            hazmatCapable: true,
            liftgateRequired: false,
        },
        [EquipmentType.REEFER_53]: {
            equipmentType,
            maxWeight: 43000,
            maxVolume: 3600,
            maxLength: 53,
            maxWidth: 8.5,
            maxHeight: 9,
            maxPallets: 26,
            temperatureControlled: true,
            hazmatCapable: true,
            liftgateRequired: false,
        },
        [EquipmentType.FLATBED_48]: {
            equipmentType,
            maxWeight: 48000,
            maxVolume: 0, // Open deck
            maxLength: 48,
            maxWidth: 8.5,
            maxHeight: 8.5,
            maxPallets: 24,
            temperatureControlled: false,
            hazmatCapable: true,
            liftgateRequired: false,
        },
        [EquipmentType.FLATBED_53]: {
            equipmentType,
            maxWeight: 48000,
            maxVolume: 0, // Open deck
            maxLength: 53,
            maxWidth: 8.5,
            maxHeight: 8.5,
            maxPallets: 26,
            temperatureControlled: false,
            hazmatCapable: true,
            liftgateRequired: false,
        },
        [EquipmentType.BOX_TRUCK_24]: {
            equipmentType,
            maxWeight: 10000,
            maxVolume: 1400,
            maxLength: 24,
            maxWidth: 8,
            maxHeight: 7,
            maxPallets: 12,
            temperatureControlled: false,
            hazmatCapable: false,
            liftgateRequired: true,
        },
        [EquipmentType.BOX_TRUCK_26]: {
            equipmentType,
            maxWeight: 12000,
            maxVolume: 1700,
            maxLength: 26,
            maxWidth: 8,
            maxHeight: 8,
            maxPallets: 14,
            temperatureControlled: false,
            hazmatCapable: false,
            liftgateRequired: true,
        },
        [EquipmentType.SPRINTER_VAN]: {
            equipmentType,
            maxWeight: 5000,
            maxVolume: 500,
            maxLength: 14,
            maxWidth: 6,
            maxHeight: 6,
            maxPallets: 4,
            temperatureControlled: false,
            hazmatCapable: false,
            liftgateRequired: false,
        },
        [EquipmentType.STRAIGHT_TRUCK]: {
            equipmentType,
            maxWeight: 15000,
            maxVolume: 1200,
            maxLength: 20,
            maxWidth: 8,
            maxHeight: 7,
            maxPallets: 10,
            temperatureControlled: false,
            hazmatCapable: false,
            liftgateRequired: true,
        },
        [EquipmentType.CONTAINER_20]: {
            equipmentType,
            maxWeight: 48000,
            maxVolume: 1172,
            maxLength: 20,
            maxWidth: 8,
            maxHeight: 8.5,
            maxPallets: 10,
            temperatureControlled: false,
            hazmatCapable: true,
            liftgateRequired: false,
        },
        [EquipmentType.CONTAINER_40]: {
            equipmentType,
            maxWeight: 58000,
            maxVolume: 2385,
            maxLength: 40,
            maxWidth: 8,
            maxHeight: 8.5,
            maxPallets: 20,
            temperatureControlled: false,
            hazmatCapable: true,
            liftgateRequired: false,
        },
        [EquipmentType.CONTAINER_40_HC]: {
            equipmentType,
            maxWeight: 58000,
            maxVolume: 2694,
            maxLength: 40,
            maxWidth: 8,
            maxHeight: 9.5,
            maxPallets: 20,
            temperatureControlled: false,
            hazmatCapable: true,
            liftgateRequired: false,
        },
    };
    return capacities[equipmentType];
}
/**
 * 10. Validates if shipments can fit in load capacity.
 *
 * @param {LoadPlan} loadPlan - Current load plan
 * @param {ShipmentUnit[]} newUnits - Units to add
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateLoadCapacity(loadPlan, [unit1, unit2]);
 * if (!result.canFit) {
 *   console.error(result.reason);
 * }
 * ```
 */
function validateLoadCapacity(loadPlan, newUnits) {
    const additionalWeight = newUnits.reduce((sum, u) => sum + u.weight, 0);
    const additionalVolume = newUnits.reduce((sum, u) => sum + u.volume, 0);
    const additionalPallets = newUnits.reduce((sum, u) => sum + u.palletCount, 0);
    const totalWeight = loadPlan.totalWeight + additionalWeight;
    const totalVolume = loadPlan.totalVolume + additionalVolume;
    const totalPallets = loadPlan.totalPallets + additionalPallets;
    const weightRemaining = loadPlan.capacity.maxWeight - totalWeight;
    const volumeRemaining = loadPlan.capacity.maxVolume - totalVolume;
    const palletsRemaining = loadPlan.capacity.maxPallets - totalPallets;
    if (totalWeight > loadPlan.capacity.maxWeight) {
        return {
            canFit: false,
            reason: `Weight exceeds capacity by ${totalWeight - loadPlan.capacity.maxWeight} lbs`,
            weightRemaining,
            volumeRemaining,
            palletsRemaining,
        };
    }
    if (totalVolume > loadPlan.capacity.maxVolume) {
        return {
            canFit: false,
            reason: `Volume exceeds capacity by ${totalVolume - loadPlan.capacity.maxVolume} cu ft`,
            weightRemaining,
            volumeRemaining,
            palletsRemaining,
        };
    }
    if (totalPallets > loadPlan.capacity.maxPallets) {
        return {
            canFit: false,
            reason: `Pallets exceed capacity by ${totalPallets - loadPlan.capacity.maxPallets}`,
            weightRemaining,
            volumeRemaining,
            palletsRemaining,
        };
    }
    return {
        canFit: true,
        weightRemaining,
        volumeRemaining,
        palletsRemaining,
    };
}
/**
 * 11. Calculates dimensional weight (cube-out weight).
 *
 * @param {Dimensions} dimensions - Package dimensions
 * @param {number} quantity - Quantity of packages
 * @returns {number} Dimensional weight in pounds
 *
 * @example
 * ```typescript
 * const dimWeight = calculateDimensionalWeight({ length: 4, width: 3, height: 2 }, 5);
 * ```
 */
function calculateDimensionalWeight(dimensions, quantity = 1) {
    // Standard dimensional weight factor: 1 lb per 166 cubic inches
    const cubicInches = (dimensions.length * 12) * (dimensions.width * 12) * (dimensions.height * 12);
    const dimWeight = cubicInches / 166;
    return Math.ceil(dimWeight * quantity);
}
/**
 * 12. Calculates optimal equipment type for shipments.
 *
 * @param {ShipmentUnit[]} units - Shipment units
 * @returns {EquipmentType} Recommended equipment type
 *
 * @example
 * ```typescript
 * const equipment = calculateOptimalEquipment(shipmentUnits);
 * ```
 */
function calculateOptimalEquipment(units) {
    const totalWeight = units.reduce((sum, u) => sum + u.weight, 0);
    const totalVolume = units.reduce((sum, u) => sum + u.volume, 0);
    const totalPallets = units.reduce((sum, u) => sum + u.palletCount, 0);
    const needsTemperatureControl = units.some(u => u.temperatureControlled);
    // Temperature controlled
    if (needsTemperatureControl) {
        return EquipmentType.REEFER_53;
    }
    // Small shipments
    if (totalWeight <= 5000 && totalVolume <= 500 && totalPallets <= 4) {
        return EquipmentType.SPRINTER_VAN;
    }
    // Medium shipments
    if (totalWeight <= 10000 && totalVolume <= 1400 && totalPallets <= 12) {
        return EquipmentType.BOX_TRUCK_24;
    }
    if (totalWeight <= 12000 && totalVolume <= 1700 && totalPallets <= 14) {
        return EquipmentType.BOX_TRUCK_26;
    }
    // Large shipments
    if (totalWeight <= 44000 && totalVolume <= 3400 && totalPallets <= 24) {
        return EquipmentType.DRY_VAN_48;
    }
    // Full truckload
    return EquipmentType.DRY_VAN_53;
}
/**
 * 13. Calculates load density (lbs per cubic foot).
 *
 * @param {number} weight - Weight in pounds
 * @param {number} volume - Volume in cubic feet
 * @returns {number} Density in lbs/cu ft
 *
 * @example
 * ```typescript
 * const density = calculateLoadDensity(10000, 500);
 * // Returns: 20 lbs/cu ft
 * ```
 */
function calculateLoadDensity(weight, volume) {
    if (volume === 0)
        return 0;
    return weight / volume;
}
/**
 * 14. Determines freight class based on density and commodity.
 *
 * @param {number} density - Load density (lbs/cu ft)
 * @param {string} commodity - Commodity type
 * @returns {string} NMFC freight class
 *
 * @example
 * ```typescript
 * const freightClass = determineFreightClass(8, 'FURNITURE');
 * // Returns: '125'
 * ```
 */
function determineFreightClass(density, commodity) {
    // NMFC (National Motor Freight Classification) classes
    if (density >= 50)
        return '50';
    if (density >= 35)
        return '55';
    if (density >= 30)
        return '60';
    if (density >= 22.5)
        return '65';
    if (density >= 15)
        return '70';
    if (density >= 13.5)
        return '77.5';
    if (density >= 12)
        return '85';
    if (density >= 10.5)
        return '92.5';
    if (density >= 9)
        return '100';
    if (density >= 8)
        return '110';
    if (density >= 7)
        return '125';
    if (density >= 6)
        return '150';
    if (density >= 5)
        return '175';
    if (density >= 4)
        return '200';
    if (density >= 3)
        return '250';
    if (density >= 2)
        return '300';
    if (density >= 1)
        return '400';
    return '500';
}
/**
 * 15. Calculates available capacity for additional shipments.
 *
 * @param {LoadPlan} loadPlan - Current load plan
 * @returns {object} Available capacity metrics
 *
 * @example
 * ```typescript
 * const available = getAvailableCapacity(loadPlan);
 * ```
 */
function getAvailableCapacity(loadPlan) {
    const weightAvailable = Math.max(0, loadPlan.capacity.maxWeight - loadPlan.totalWeight);
    const volumeAvailable = Math.max(0, loadPlan.capacity.maxVolume - loadPlan.totalVolume);
    const palletsAvailable = Math.max(0, loadPlan.capacity.maxPallets - loadPlan.totalPallets);
    const weightUtilization = (loadPlan.totalWeight / loadPlan.capacity.maxWeight) * 100;
    const volumeUtilization = (loadPlan.totalVolume / loadPlan.capacity.maxVolume) * 100;
    const palletUtilization = (loadPlan.totalPallets / loadPlan.capacity.maxPallets) * 100;
    const maxUtilization = Math.max(weightUtilization, volumeUtilization, palletUtilization);
    const percentageAvailable = 100 - maxUtilization;
    return {
        weightAvailable,
        volumeAvailable,
        palletsAvailable,
        percentageAvailable: Math.max(0, percentageAvailable),
    };
}
/**
 * 16. Calculates load stability score based on weight distribution.
 *
 * @param {LoadPlan} loadPlan - Load plan to analyze
 * @returns {object} Stability analysis
 *
 * @example
 * ```typescript
 * const stability = calculateLoadStability(loadPlan);
 * if (stability.score < 70) {
 *   console.warn('Load may be unstable:', stability.issues);
 * }
 * ```
 */
function calculateLoadStability(loadPlan) {
    const issues = [];
    const recommendations = [];
    let score = 100;
    // Check for non-stackable items
    const hasNonStackable = loadPlan.shipmentUnits.some(u => !u.stackable);
    if (hasNonStackable) {
        score -= 10;
        issues.push('Contains non-stackable items');
        recommendations.push('Load non-stackable items last or on top');
    }
    // Check weight distribution
    const averageWeight = loadPlan.totalWeight / (loadPlan.shipmentUnits.length || 1);
    const hasHeavyItems = loadPlan.shipmentUnits.some(u => u.weight > averageWeight * 2);
    if (hasHeavyItems) {
        score -= 15;
        issues.push('Contains items significantly heavier than average');
        recommendations.push('Load heaviest items on bottom and toward front');
    }
    // Check utilization
    if (loadPlan.utilizationWeight > 95) {
        score -= 10;
        issues.push('Load very close to weight capacity');
        recommendations.push('Consider reducing weight for safety margin');
    }
    // Check dimensions vs capacity
    const hasOversizedItems = loadPlan.shipmentUnits.some(u => u.dimensions.length > loadPlan.capacity.maxLength * 0.9 ||
        u.dimensions.width > loadPlan.capacity.maxWidth * 0.9 ||
        u.dimensions.height > loadPlan.capacity.maxHeight * 0.9);
    if (hasOversizedItems) {
        score -= 15;
        issues.push('Contains oversized items');
        recommendations.push('Ensure proper securing of oversized items');
    }
    return {
        score: Math.max(0, score),
        issues,
        recommendations,
    };
}
// ============================================================================
// SECTION 3: LOAD OPTIMIZATION (Functions 17-24)
// ============================================================================
/**
 * 17. Optimizes load building using bin packing algorithm.
 *
 * @param {ShipmentUnit[]} units - Units to pack
 * @param {EquipmentType} equipmentType - Equipment type
 * @returns {LoadPlan[]} Optimized load plans
 *
 * @example
 * ```typescript
 * const loads = optimizeLoadBuilding(shipmentUnits, EquipmentType.DRY_VAN_53);
 * ```
 */
function optimizeLoadBuilding(units, equipmentType) {
    const loads = [];
    const sortedUnits = [...units].sort((a, b) => {
        // Sort by delivery date, then by weight (heaviest first)
        if (a.deliveryDate.getTime() !== b.deliveryDate.getTime()) {
            return a.deliveryDate.getTime() - b.deliveryDate.getTime();
        }
        return b.weight - a.weight;
    });
    let currentLoad = createLoadPlan({
        mode: LoadMode.FTL,
        equipmentType,
        createdBy: 'SYSTEM',
    });
    for (const unit of sortedUnits) {
        const validation = validateLoadCapacity(currentLoad, [unit]);
        if (validation.canFit) {
            currentLoad = addShipmentToLoad(currentLoad, unit);
        }
        else {
            // Start new load
            if (currentLoad.shipmentUnits.length > 0) {
                loads.push(currentLoad);
            }
            currentLoad = createLoadPlan({
                mode: LoadMode.FTL,
                equipmentType,
                createdBy: 'SYSTEM',
            });
            currentLoad = addShipmentToLoad(currentLoad, unit);
        }
    }
    // Add final load
    if (currentLoad.shipmentUnits.length > 0) {
        loads.push(currentLoad);
    }
    return loads;
}
/**
 * 18. Consolidates multiple loads to improve utilization.
 *
 * @param {LoadPlan[]} loads - Load plans to consolidate
 * @param {number} minUtilization - Minimum utilization target (percentage)
 * @returns {LoadConsolidationResult} Consolidation result
 *
 * @example
 * ```typescript
 * const result = consolidateLoads(loadPlans, 85);
 * console.log(`Consolidated to ${result.totalLoads} loads`);
 * ```
 */
function consolidateLoads(loads, minUtilization = 80) {
    const consolidated = [];
    const unassignedUnits = [];
    // Identify underutilized loads
    const underutilized = loads.filter(l => l.utilizationWeight < minUtilization || l.utilizationVolume < minUtilization);
    const fullLoads = loads.filter(l => l.utilizationWeight >= minUtilization && l.utilizationVolume >= minUtilization);
    // Keep full loads as is
    consolidated.push(...fullLoads);
    // Try to consolidate underutilized loads
    const allUnits = underutilized.flatMap(l => l.shipmentUnits);
    if (allUnits.length > 0) {
        const equipmentType = underutilized[0].equipmentType;
        const reconsolidated = optimizeLoadBuilding(allUnits, equipmentType);
        consolidated.push(...reconsolidated);
    }
    const originalCount = loads.length;
    const newCount = consolidated.length;
    const loadsSaved = originalCount - newCount;
    return {
        totalLoads: newCount,
        loads: consolidated,
        unassignedUnits,
        totalSavings: loadsSaved * 1000, // Estimated $1000 per load saved
        utilizationImprovement: calculateAverageUtilization(consolidated) - calculateAverageUtilization(loads),
        consolidationRate: (loadsSaved / originalCount) * 100,
    };
}
/**
 * 19. Optimizes stop sequence for multi-stop loads.
 *
 * @param {LoadPlan} loadPlan - Load plan with multiple stops
 * @param {Address} origin - Origin address
 * @returns {LoadPlan} Optimized load plan
 *
 * @example
 * ```typescript
 * const optimized = optimizeStopSequence(loadPlan, warehouseAddress);
 * ```
 */
function optimizeStopSequence(loadPlan, origin) {
    if (loadPlan.stops.length <= 1) {
        return loadPlan;
    }
    // Sort stops by delivery date/time, then optimize for distance
    const sortedStops = [...loadPlan.stops].sort((a, b) => {
        const aUnits = loadPlan.shipmentUnits.filter(u => a.shipmentUnits.includes(u.unitId));
        const bUnits = loadPlan.shipmentUnits.filter(u => b.shipmentUnits.includes(u.unitId));
        const aDate = aUnits[0]?.deliveryDate || new Date();
        const bDate = bUnits[0]?.deliveryDate || new Date();
        return aDate.getTime() - bDate.getTime();
    });
    // Recalculate distances
    let previousAddress = origin;
    const optimizedStops = sortedStops.map((stop, index) => {
        const distance = calculateDistance(previousAddress, stop.address);
        const duration = calculateDuration(distance);
        previousAddress = stop.address;
        return {
            ...stop,
            stopNumber: index + 1,
            distanceFromPrevious: distance,
            durationFromPrevious: duration,
        };
    });
    const totalDistance = optimizedStops.reduce((sum, stop) => sum + stop.distanceFromPrevious, 0);
    const totalDuration = optimizedStops.reduce((sum, stop) => sum + stop.durationFromPrevious + stop.serviceTime, 0);
    return {
        ...loadPlan,
        stops: optimizedStops,
        totalDistance,
        estimatedDuration: totalDuration,
    };
}
/**
 * 20. Balances loads across multiple vehicles.
 *
 * @param {ShipmentUnit[]} units - Units to distribute
 * @param {number} vehicleCount - Number of vehicles available
 * @param {EquipmentType} equipmentType - Equipment type
 * @returns {LoadPlan[]} Balanced load plans
 *
 * @example
 * ```typescript
 * const balanced = balanceLoadsAcrossVehicles(units, 3, EquipmentType.DRY_VAN_53);
 * ```
 */
function balanceLoadsAcrossVehicles(units, vehicleCount, equipmentType) {
    const totalWeight = units.reduce((sum, u) => sum + u.weight, 0);
    const targetWeight = totalWeight / vehicleCount;
    const loads = [];
    const sortedUnits = [...units].sort((a, b) => b.weight - a.weight);
    for (let i = 0; i < vehicleCount; i++) {
        loads.push(createLoadPlan({
            mode: LoadMode.FTL,
            equipmentType,
            createdBy: 'SYSTEM',
        }));
    }
    // First fit decreasing algorithm
    for (const unit of sortedUnits) {
        // Find load with lowest current weight
        const targetLoad = loads.reduce((min, load) => load.totalWeight < min.totalWeight ? load : min);
        const validation = validateLoadCapacity(targetLoad, [unit]);
        if (validation.canFit) {
            const index = loads.indexOf(targetLoad);
            loads[index] = addShipmentToLoad(targetLoad, unit);
        }
    }
    return loads;
}
/**
 * 21. Generates alternative load configurations.
 *
 * @param {ShipmentUnit[]} units - Shipment units
 * @param {EquipmentType[]} equipmentTypes - Equipment options
 * @returns {LoadPlan[][]} Alternative configurations
 *
 * @example
 * ```typescript
 * const alternatives = generateLoadAlternatives(units, [
 *   EquipmentType.DRY_VAN_53,
 *   EquipmentType.DRY_VAN_48
 * ]);
 * ```
 */
function generateLoadAlternatives(units, equipmentTypes) {
    const alternatives = [];
    for (const equipmentType of equipmentTypes) {
        const loads = optimizeLoadBuilding(units, equipmentType);
        alternatives.push(loads);
    }
    return alternatives;
}
/**
 * 22. Scores load plan based on multiple optimization criteria.
 *
 * @param {LoadPlan} loadPlan - Load plan to score
 * @param {object} weights - Criteria weights
 * @returns {number} Overall score (0-100)
 *
 * @example
 * ```typescript
 * const score = scoreLoadPlan(loadPlan, {
 *   utilization: 0.4,
 *   distance: 0.3,
 *   stops: 0.2,
 *   stability: 0.1
 * });
 * ```
 */
function scoreLoadPlan(loadPlan, weights = {}) {
    const defaultWeights = {
        utilization: 0.4,
        distance: 0.3,
        stops: 0.2,
        stability: 0.1,
    };
    const w = { ...defaultWeights, ...weights };
    // Utilization score (higher is better)
    const avgUtilization = (loadPlan.utilizationWeight + loadPlan.utilizationVolume) / 2;
    const utilizationScore = avgUtilization;
    // Distance score (lower is better, normalize)
    const distanceScore = Math.max(0, 100 - (loadPlan.totalDistance / 10));
    // Stops score (fewer stops is better)
    const stopsScore = Math.max(0, 100 - (loadPlan.stops.length * 10));
    // Stability score
    const stability = calculateLoadStability(loadPlan);
    const stabilityScore = stability.score;
    const totalScore = (utilizationScore * w.utilization) +
        (distanceScore * w.distance) +
        (stopsScore * w.stops) +
        (stabilityScore * w.stability);
    return Math.min(100, Math.max(0, totalScore));
}
/**
 * 23. Merges compatible loads to reduce vehicle count.
 *
 * @param {LoadPlan[]} loads - Load plans to merge
 * @returns {LoadPlan[]} Merged load plans
 *
 * @example
 * ```typescript
 * const merged = mergeCompatibleLoads(loadPlans);
 * ```
 */
function mergeCompatibleLoads(loads) {
    const merged = [];
    const processed = new Set();
    for (let i = 0; i < loads.length; i++) {
        if (processed.has(loads[i].loadId))
            continue;
        let currentLoad = loads[i];
        processed.add(currentLoad.loadId);
        // Try to merge with other loads
        for (let j = i + 1; j < loads.length; j++) {
            if (processed.has(loads[j].loadId))
                continue;
            const otherLoad = loads[j];
            // Check compatibility
            if (currentLoad.equipmentType !== otherLoad.equipmentType)
                continue;
            if (currentLoad.mode !== otherLoad.mode)
                continue;
            // Check capacity
            const validation = validateLoadCapacity(currentLoad, otherLoad.shipmentUnits);
            if (validation.canFit) {
                // Merge loads
                for (const unit of otherLoad.shipmentUnits) {
                    currentLoad = addShipmentToLoad(currentLoad, unit);
                }
                processed.add(otherLoad.loadId);
            }
        }
        merged.push(currentLoad);
    }
    return merged;
}
/**
 * 24. Optimizes load for cost vs speed trade-off.
 *
 * @param {LoadPlan} loadPlan - Load plan to optimize
 * @param {string} priority - 'COST' or 'SPEED'
 * @returns {LoadPlan} Optimized load plan
 *
 * @example
 * ```typescript
 * const optimized = optimizeLoadForPriority(loadPlan, 'COST');
 * ```
 */
function optimizeLoadForPriority(loadPlan, priority) {
    if (priority === 'COST') {
        // Optimize for maximum utilization
        return {
            ...loadPlan,
            mode: LoadMode.LTL, // Use LTL for better cost efficiency
            metadata: {
                ...loadPlan.metadata,
                optimizationPriority: 'COST',
                targetUtilization: 95,
            },
        };
    }
    else {
        // Optimize for speed
        return {
            ...loadPlan,
            mode: LoadMode.FTL, // Use FTL for faster delivery
            metadata: {
                ...loadPlan.metadata,
                optimizationPriority: 'SPEED',
                targetUtilization: 70, // Accept lower utilization for speed
            },
        };
    }
}
// ============================================================================
// SECTION 4: DOCK SCHEDULING (Functions 25-32)
// ============================================================================
/**
 * 25. Creates dock door reservation.
 *
 * @param {DockDoor} door - Dock door
 * @param {LoadPlan} loadPlan - Load plan
 * @param {TimeWindow} timeWindow - Reservation time window
 * @returns {DockReservation} Dock reservation
 *
 * @example
 * ```typescript
 * const reservation = createDockReservation(dockDoor, loadPlan, {
 *   start: new Date('2024-01-15T08:00:00'),
 *   end: new Date('2024-01-15T10:00:00')
 * });
 * ```
 */
function createDockReservation(door, loadPlan, timeWindow) {
    return {
        reservationId: crypto.randomUUID(),
        doorId: door.doorId,
        loadId: loadPlan.loadId,
        startTime: timeWindow.start,
        endTime: timeWindow.end,
        status: 'SCHEDULED',
    };
}
/**
 * 26. Finds available dock doors for time window.
 *
 * @param {DockDoor[]} doors - All dock doors
 * @param {TimeWindow} timeWindow - Desired time window
 * @param {EquipmentType} equipmentType - Equipment type
 * @returns {DockDoor[]} Available doors
 *
 * @example
 * ```typescript
 * const available = findAvailableDockDoors(allDoors, timeWindow, EquipmentType.DRY_VAN_53);
 * ```
 */
function findAvailableDockDoors(doors, timeWindow, equipmentType) {
    return doors.filter(door => {
        // Check status
        if (door.status === DockDoorStatus.MAINTENANCE || door.status === DockDoorStatus.CLOSED) {
            return false;
        }
        // Check equipment compatibility
        if (!door.equipmentTypes.includes(equipmentType)) {
            return false;
        }
        // Check for conflicts
        const hasConflict = door.schedule.some(reservation => {
            return ((timeWindow.start >= reservation.startTime && timeWindow.start < reservation.endTime) ||
                (timeWindow.end > reservation.startTime && timeWindow.end <= reservation.endTime) ||
                (timeWindow.start <= reservation.startTime && timeWindow.end >= reservation.endTime));
        });
        return !hasConflict;
    });
}
/**
 * 27. Optimizes dock door assignments for multiple loads.
 *
 * @param {LoadPlan[]} loads - Load plans to schedule
 * @param {DockDoor[]} doors - Available dock doors
 * @returns {Map<string, DockReservation>} Load ID to reservation mapping
 *
 * @example
 * ```typescript
 * const assignments = optimizeDockAssignments(loadPlans, dockDoors);
 * ```
 */
function optimizeDockAssignments(loads, doors) {
    const assignments = new Map();
    // Sort loads by planned departure time
    const sortedLoads = [...loads].sort((a, b) => {
        const aTime = a.plannedDepartureTime?.getTime() || 0;
        const bTime = b.plannedDepartureTime?.getTime() || 0;
        return aTime - bTime;
    });
    for (const load of sortedLoads) {
        if (!load.plannedDepartureTime)
            continue;
        const loadTime = estimateLoadingTime(load);
        const timeWindow = {
            start: new Date(load.plannedDepartureTime.getTime() - loadTime * 60 * 1000),
            end: load.plannedDepartureTime,
        };
        const availableDoors = findAvailableDockDoors(doors, timeWindow, load.equipmentType);
        if (availableDoors.length > 0) {
            const reservation = createDockReservation(availableDoors[0], load, timeWindow);
            assignments.set(load.loadId, reservation);
            // Update door schedule
            availableDoors[0].schedule.push(reservation);
        }
    }
    return assignments;
}
/**
 * 28. Estimates loading time based on load characteristics.
 *
 * @param {LoadPlan} loadPlan - Load plan
 * @returns {number} Estimated loading time in minutes
 *
 * @example
 * ```typescript
 * const minutes = estimateLoadingTime(loadPlan);
 * ```
 */
function estimateLoadingTime(loadPlan) {
    // Base time: 5 minutes per pallet
    const palletTime = loadPlan.totalPallets * 5;
    // Additional time for special handling
    const hasHazmat = loadPlan.shipmentUnits.some(u => u.hazmat);
    const hasTemperatureControl = loadPlan.shipmentUnits.some(u => u.temperatureControlled);
    const hasSpecialHandling = loadPlan.shipmentUnits.some(u => u.specialHandling.length > 0);
    let additionalTime = 0;
    if (hasHazmat)
        additionalTime += 15;
    if (hasTemperatureControl)
        additionalTime += 10;
    if (hasSpecialHandling)
        additionalTime += 20;
    // Setup and inspection time
    const setupTime = 15;
    return palletTime + additionalTime + setupTime;
}
/**
 * 29. Validates dock reservation availability.
 *
 * @param {DockDoor} door - Dock door
 * @param {TimeWindow} timeWindow - Requested time window
 * @returns {object} Availability result
 *
 * @example
 * ```typescript
 * const result = validateDockAvailability(dockDoor, timeWindow);
 * if (!result.available) {
 *   console.log('Next available:', result.nextAvailable);
 * }
 * ```
 */
function validateDockAvailability(door, timeWindow) {
    const conflicts = door.schedule.filter(reservation => {
        return ((timeWindow.start >= reservation.startTime && timeWindow.start < reservation.endTime) ||
            (timeWindow.end > reservation.startTime && timeWindow.end <= reservation.endTime) ||
            (timeWindow.start <= reservation.startTime && timeWindow.end >= reservation.endTime));
    });
    if (conflicts.length === 0) {
        return { available: true, conflicts: [] };
    }
    // Find next available time
    const sortedReservations = [...door.schedule].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    for (let i = 0; i < sortedReservations.length - 1; i++) {
        const current = sortedReservations[i];
        const next = sortedReservations[i + 1];
        const gapDuration = next.startTime.getTime() - current.endTime.getTime();
        const requiredDuration = timeWindow.end.getTime() - timeWindow.start.getTime();
        if (gapDuration >= requiredDuration) {
            return {
                available: false,
                conflicts,
                nextAvailable: current.endTime,
            };
        }
    }
    // Next available is after last reservation
    const lastReservation = sortedReservations[sortedReservations.length - 1];
    return {
        available: false,
        conflicts,
        nextAvailable: lastReservation.endTime,
    };
}
/**
 * 30. Checks in load at dock door.
 *
 * @param {DockReservation} reservation - Dock reservation
 * @param {string} loadedBy - User ID performing check-in
 * @returns {DockReservation} Updated reservation
 *
 * @example
 * ```typescript
 * const updated = checkInLoadAtDock(reservation, 'LOADER-001');
 * ```
 */
function checkInLoadAtDock(reservation, loadedBy) {
    return {
        ...reservation,
        status: 'IN_PROGRESS',
        checkInTime: new Date(),
        loadedBy,
    };
}
/**
 * 31. Checks out load from dock door.
 *
 * @param {DockReservation} reservation - Dock reservation
 * @returns {DockReservation} Updated reservation
 *
 * @example
 * ```typescript
 * const updated = checkOutLoadFromDock(reservation);
 * ```
 */
function checkOutLoadFromDock(reservation) {
    return {
        ...reservation,
        status: 'COMPLETED',
        checkOutTime: new Date(),
    };
}
/**
 * 32. Generates dock utilization report.
 *
 * @param {DockDoor[]} doors - Dock doors
 * @param {TimeWindow} period - Reporting period
 * @returns {object} Utilization report
 *
 * @example
 * ```typescript
 * const report = generateDockUtilizationReport(dockDoors, {
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-01-31')
 * });
 * ```
 */
function generateDockUtilizationReport(doors, period) {
    const periodDuration = period.end.getTime() - period.start.getTime();
    const doorUtilization = doors.map(door => {
        const relevantReservations = door.schedule.filter(r => r.startTime >= period.start && r.endTime <= period.end);
        const totalReservedTime = relevantReservations.reduce((sum, r) => sum + (r.endTime.getTime() - r.startTime.getTime()), 0);
        const utilization = (totalReservedTime / periodDuration) * 100;
        return {
            doorId: door.doorId,
            doorNumber: door.doorNumber,
            reservations: relevantReservations.length,
            utilization,
        };
    });
    const totalReservations = doorUtilization.reduce((sum, d) => sum + d.reservations, 0);
    const averageUtilization = doorUtilization.reduce((sum, d) => sum + d.utilization, 0) / doors.length;
    const peakUtilization = Math.max(...doorUtilization.map(d => d.utilization));
    return {
        totalDoors: doors.length,
        totalReservations,
        averageUtilization,
        peakUtilization,
        doorUtilization,
    };
}
// ============================================================================
// SECTION 5: MANIFEST GENERATION (Functions 33-39)
// ============================================================================
/**
 * 33. Generates load manifest document.
 *
 * @param {LoadPlan} loadPlan - Load plan
 * @param {CarrierInfo} carrier - Carrier information
 * @param {Address} origin - Origin address
 * @returns {LoadManifest} Load manifest
 *
 * @example
 * ```typescript
 * const manifest = generateLoadManifest(loadPlan, carrierInfo, warehouseAddress);
 * ```
 */
function generateLoadManifest(loadPlan, carrier, origin) {
    const manifestStops = loadPlan.stops.map(stop => ({
        stopNumber: stop.stopNumber,
        type: stop.type,
        address: stop.address,
        appointmentTime: stop.appointmentTime,
        timeWindow: stop.plannedArrival && stop.plannedDeparture ? {
            start: stop.plannedArrival,
            end: stop.plannedDeparture,
        } : undefined,
        shipments: stop.shipmentUnits.map(unitId => {
            const unit = loadPlan.shipmentUnits.find(u => u.unitId === unitId);
            return {
                shipmentId: unit.unitId,
                orderId: unit.orderId,
                customerName: unit.customerId,
                referenceNumbers: [unit.orderId],
                weight: unit.weight,
                pieces: unit.pieceCount,
                pallets: unit.palletCount,
                description: unit.metadata?.description || 'General Freight',
                value: unit.value,
                hazmat: unit.hazmat,
                commodityClass: unit.commodityClass,
            };
        }),
        specialInstructions: stop.specialInstructions,
    }));
    const hasHazmat = loadPlan.shipmentUnits.some(u => u.hazmat);
    const hasTemperatureControl = loadPlan.shipmentUnits.some(u => u.temperatureControlled);
    const documents = [
        {
            documentId: crypto.randomUUID(),
            type: 'BOL',
            name: 'Bill of Lading',
            required: true,
        },
        {
            documentId: crypto.randomUUID(),
            type: 'PACKING_LIST',
            name: 'Packing List',
            required: true,
        },
    ];
    if (hasHazmat) {
        documents.push({
            documentId: crypto.randomUUID(),
            type: 'HAZMAT',
            name: 'Hazardous Materials Documentation',
            required: true,
        });
    }
    const specialInstructions = [];
    if (hasTemperatureControl) {
        specialInstructions.push('TEMPERATURE CONTROLLED - Maintain required temperature throughout transit');
    }
    if (hasHazmat) {
        specialInstructions.push('HAZMAT - Follow all DOT regulations for hazardous materials');
    }
    return {
        manifestId: crypto.randomUUID(),
        manifestNumber: `MAN-${loadPlan.loadNumber}`,
        loadId: loadPlan.loadId,
        loadNumber: loadPlan.loadNumber,
        generatedAt: new Date(),
        generatedBy: loadPlan.createdBy,
        carrier,
        origin,
        stops: manifestStops,
        totalWeight: loadPlan.totalWeight,
        totalVolume: loadPlan.totalVolume,
        totalPieces: loadPlan.totalPieces,
        totalValue: loadPlan.totalValue,
        hazmatPresent: hasHazmat,
        temperatureControlled: hasTemperatureControl,
        specialInstructions,
        documents,
    };
}
/**
 * 34. Generates Bill of Lading (BOL) document.
 *
 * @param {LoadManifest} manifest - Load manifest
 * @param {string} bolNumber - BOL number
 * @returns {object} BOL document
 *
 * @example
 * ```typescript
 * const bol = generateBillOfLading(manifest, 'BOL-2024-001');
 * ```
 */
function generateBillOfLading(manifest, bolNumber) {
    const firstStop = manifest.stops.find(s => s.type === 'DELIVERY');
    const palletCount = manifest.stops.reduce((sum, stop) => sum + stop.shipments.reduce((s, ship) => s + ship.pallets, 0), 0);
    return {
        bolNumber,
        shipper: manifest.origin,
        consignee: firstStop?.address || manifest.origin,
        carrier: manifest.carrier,
        shipmentDetails: {
            weight: manifest.totalWeight,
            pieces: manifest.totalPieces,
            pallets: palletCount,
            commodityDescription: 'General Freight',
            hazmat: manifest.hazmatPresent,
        },
        charges: {
            freight: 0, // To be filled in
            fuelSurcharge: 0,
            accessorials: 0,
            total: 0,
        },
        specialInstructions: manifest.specialInstructions,
        generatedAt: new Date(),
    };
}
/**
 * 35. Generates packing list for manifest.
 *
 * @param {LoadManifest} manifest - Load manifest
 * @returns {object} Packing list
 *
 * @example
 * ```typescript
 * const packingList = generatePackingList(manifest);
 * ```
 */
function generatePackingList(manifest) {
    const items = manifest.stops.flatMap(stop => stop.shipments.map(shipment => ({
        stopNumber: stop.stopNumber,
        orderId: shipment.orderId,
        customerName: shipment.customerName,
        pieces: shipment.pieces,
        pallets: shipment.pallets,
        weight: shipment.weight,
        description: shipment.description,
    })));
    const totalPallets = items.reduce((sum, item) => sum + item.pallets, 0);
    return {
        manifestNumber: manifest.manifestNumber,
        generatedAt: new Date(),
        items,
        totals: {
            totalPieces: manifest.totalPieces,
            totalPallets,
            totalWeight: manifest.totalWeight,
        },
    };
}
/**
 * 36. Generates route sheet for driver.
 *
 * @param {LoadManifest} manifest - Load manifest
 * @returns {object} Route sheet
 *
 * @example
 * ```typescript
 * const routeSheet = generateRouteSheet(manifest);
 * ```
 */
function generateRouteSheet(manifest) {
    return {
        loadNumber: manifest.loadNumber,
        driver: manifest.driver,
        vehicle: manifest.vehicle,
        origin: manifest.origin,
        stops: manifest.stops.map(stop => ({
            stopNumber: stop.stopNumber,
            type: stop.type,
            address: stop.address,
            appointmentTime: stop.appointmentTime,
            deliveryCount: stop.shipments.length,
            specialInstructions: stop.specialInstructions,
            distanceFromPrevious: 0, // Would be calculated with actual routing
        })),
        totalDistance: 0, // Would be calculated with actual routing
        estimatedDuration: 0, // Would be calculated with actual routing
        specialInstructions: manifest.specialInstructions,
    };
}
/**
 * 37. Validates manifest completeness before dispatch.
 *
 * @param {LoadManifest} manifest - Load manifest
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateManifest(manifest);
 * if (!result.valid) {
 *   console.error('Missing:', result.missingFields);
 * }
 * ```
 */
function validateManifest(manifest) {
    const missingFields = [];
    const warnings = [];
    // Required fields
    if (!manifest.carrier)
        missingFields.push('carrier');
    if (!manifest.origin)
        missingFields.push('origin');
    if (manifest.stops.length === 0)
        missingFields.push('stops');
    // Check stops
    for (const stop of manifest.stops) {
        if (!stop.address) {
            missingFields.push(`stop ${stop.stopNumber} address`);
        }
        if (stop.shipments.length === 0) {
            warnings.push(`Stop ${stop.stopNumber} has no shipments`);
        }
    }
    // Check required documents
    const requiredDocs = manifest.documents.filter(d => d.required);
    for (const doc of requiredDocs) {
        if (!doc.url) {
            warnings.push(`Document not attached: ${doc.name}`);
        }
    }
    // Hazmat checks
    if (manifest.hazmatPresent) {
        const hasHazmatDoc = manifest.documents.some(d => d.type === 'HAZMAT');
        if (!hasHazmatDoc) {
            missingFields.push('hazmat documentation');
        }
    }
    return {
        valid: missingFields.length === 0,
        missingFields,
        warnings,
    };
}
/**
 * 38. Exports manifest to PDF format (returns PDF data structure).
 *
 * @param {LoadManifest} manifest - Load manifest
 * @returns {object} PDF document structure
 *
 * @example
 * ```typescript
 * const pdf = exportManifestToPDF(manifest);
 * ```
 */
function exportManifestToPDF(manifest) {
    const content = [
        `LOAD MANIFEST`,
        `Manifest Number: ${manifest.manifestNumber}`,
        `Load Number: ${manifest.loadNumber}`,
        `Generated: ${manifest.generatedAt.toLocaleString()}`,
        ``,
        `CARRIER INFORMATION`,
        `Name: ${manifest.carrier.name}`,
        `SCAC: ${manifest.carrier.scac}`,
        `Contact: ${manifest.carrier.contact}`,
        `Phone: ${manifest.carrier.phone}`,
        ``,
        `ORIGIN`,
        `${manifest.origin.name}`,
        `${manifest.origin.street}`,
        `${manifest.origin.city}, ${manifest.origin.state} ${manifest.origin.postalCode}`,
        ``,
        `STOPS`,
    ];
    for (const stop of manifest.stops) {
        content.push(`Stop #${stop.stopNumber} - ${stop.type}`);
        content.push(`${stop.address.name}`);
        content.push(`${stop.address.street}`);
        content.push(`${stop.address.city}, ${stop.address.state} ${stop.address.postalCode}`);
        if (stop.appointmentTime) {
            content.push(`Appointment: ${stop.appointmentTime.toLocaleString()}`);
        }
        content.push(`Shipments: ${stop.shipments.length}`);
        content.push(``);
    }
    content.push(`TOTALS`);
    content.push(`Weight: ${manifest.totalWeight} lbs`);
    content.push(`Volume: ${manifest.totalVolume} cu ft`);
    content.push(`Pieces: ${manifest.totalPieces}`);
    content.push(`Value: $${manifest.totalValue.toFixed(2)}`);
    if (manifest.specialInstructions.length > 0) {
        content.push(``);
        content.push(`SPECIAL INSTRUCTIONS`);
        manifest.specialInstructions.forEach(inst => content.push(`- ${inst}`));
    }
    return {
        title: `Load Manifest - ${manifest.manifestNumber}`,
        metadata: {
            loadNumber: manifest.loadNumber,
            carrier: manifest.carrier.name,
            generatedAt: manifest.generatedAt,
        },
        content,
    };
}
/**
 * 39. Generates carrier tender offer document.
 *
 * @param {LoadPlan} loadPlan - Load plan
 * @param {CarrierInfo} carrier - Carrier to tender to
 * @param {FreightRateQuote} rateQuote - Rate quote
 * @returns {object} Tender offer
 *
 * @example
 * ```typescript
 * const tender = generateCarrierTender(loadPlan, carrierInfo, rateQuote);
 * ```
 */
function generateCarrierTender(loadPlan, carrier, rateQuote) {
    const firstStop = loadPlan.stops[0];
    const lastStop = loadPlan.stops[loadPlan.stops.length - 1];
    const specialRequirements = [];
    if (loadPlan.shipmentUnits.some(u => u.hazmat)) {
        specialRequirements.push('Hazmat certified equipment required');
    }
    if (loadPlan.shipmentUnits.some(u => u.temperatureControlled)) {
        specialRequirements.push('Temperature controlled equipment required');
    }
    const responseDeadline = new Date();
    responseDeadline.setHours(responseDeadline.getHours() + 2); // 2 hour response window
    return {
        tenderId: `TENDER-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
        loadId: loadPlan.loadId,
        loadNumber: loadPlan.loadNumber,
        carrier,
        rateQuote,
        pickupDate: loadPlan.plannedDepartureTime || new Date(),
        deliveryDate: loadPlan.estimatedArrivalTime || new Date(),
        equipmentType: loadPlan.equipmentType,
        origin: firstStop?.address || {},
        destination: lastStop?.address || {},
        totalWeight: loadPlan.totalWeight,
        totalPallets: loadPlan.totalPallets,
        specialRequirements,
        responseDeadline,
        status: 'PENDING',
        createdAt: new Date(),
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique load ID.
 */
function generateLoadId() {
    return `LOAD-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates human-readable load number.
 */
function generateLoadNumber() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-6);
    return `LD-${dateStr}-${timeStr}`;
}
/**
 * Helper: Calculates distance between two addresses.
 * In production, this would use a real geocoding/routing API.
 */
function calculateDistance(from, to) {
    // Simplified calculation - in production use Google Maps, HERE, or Mapbox API
    if (from.latitude && from.longitude && to.latitude && to.longitude) {
        const lat1 = from.latitude * Math.PI / 180;
        const lat2 = to.latitude * Math.PI / 180;
        const deltaLat = (to.latitude - from.latitude) * Math.PI / 180;
        const deltaLon = (to.longitude - from.longitude) * Math.PI / 180;
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const earthRadius = 3959; // miles
        return earthRadius * c;
    }
    // Fallback estimation
    return 50;
}
/**
 * Helper: Calculates duration from distance.
 */
function calculateDuration(distance) {
    // Average 50 mph
    return Math.ceil((distance / 50) * 60);
}
/**
 * Helper: Calculates average utilization across loads.
 */
function calculateAverageUtilization(loads) {
    if (loads.length === 0)
        return 0;
    const totalUtilization = loads.reduce((sum, load) => sum + ((load.utilizationWeight + load.utilizationVolume) / 2), 0);
    return totalUtilization / loads.length;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Load Plan Creation
    createLoadPlan,
    addShipmentToLoad,
    removeShipmentFromLoad,
    addStopToLoad,
    recalculateLoadMetrics,
    validateLoadPlan,
    cloneLoadPlan,
    updateLoadStatus,
    // Capacity Planning
    getVehicleCapacity,
    validateLoadCapacity,
    calculateDimensionalWeight,
    calculateOptimalEquipment,
    calculateLoadDensity,
    determineFreightClass,
    getAvailableCapacity,
    calculateLoadStability,
    // Load Optimization
    optimizeLoadBuilding,
    consolidateLoads,
    optimizeStopSequence,
    balanceLoadsAcrossVehicles,
    generateLoadAlternatives,
    scoreLoadPlan,
    mergeCompatibleLoads,
    optimizeLoadForPriority,
    // Dock Scheduling
    createDockReservation,
    findAvailableDockDoors,
    optimizeDockAssignments,
    estimateLoadingTime,
    validateDockAvailability,
    checkInLoadAtDock,
    checkOutLoadFromDock,
    generateDockUtilizationReport,
    // Manifest Generation
    generateLoadManifest,
    generateBillOfLading,
    generatePackingList,
    generateRouteSheet,
    validateManifest,
    exportManifestToPDF,
    generateCarrierTender,
};
//# sourceMappingURL=outbound-load-planning-kit.js.map