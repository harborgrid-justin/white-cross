"use strict";
/**
 * LOC: LOG-PKG-SHIP-001
 * File: /reuse/logistics/outbound-packing-shipping-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Warehouse controllers
 *   - Shipping services
 *   - Carrier integration modules
 *   - Label printing services
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
exports.LabelFormat = exports.PackageType = exports.ServiceLevel = exports.Carrier = exports.ShipmentStatus = exports.PackingStationStatus = void 0;
exports.createPackingStation = createPackingStation;
exports.assignUserToStation = assignUserToStation;
exports.releaseStation = releaseStation;
exports.startPackingOrder = startPackingOrder;
exports.completePackingOrder = completePackingOrder;
exports.addStationEquipment = addStationEquipment;
exports.calculateStationUtilization = calculateStationUtilization;
exports.generateStationReport = generateStationReport;
exports.cartonizeItems = cartonizeItems;
exports.findBestContainer = findBestContainer;
exports.calculateDimensionalWeight = calculateDimensionalWeight;
exports.validatePackageForCarrier = validatePackageForCarrier;
exports.optimizeBoxSelection = optimizeBoxSelection;
exports.calculatePackingEfficiency = calculatePackingEfficiency;
exports.groupItemsByCompatibility = groupItemsByCompatibility;
exports.estimateVoidFill = estimateVoidFill;
exports.generatePackingInstructions = generatePackingInstructions;
exports.generateShippingLabel = generateShippingLabel;
exports.generateReturnLabel = generateReturnLabel;
exports.generateBatchLabels = generateBatchLabels;
exports.generateInternationalLabel = generateInternationalLabel;
exports.formatLabelForThermalPrinter = formatLabelForThermalPrinter;
exports.validateLabel = validateLabel;
exports.generatePackingSlip = generatePackingSlip;
exports.generateHazmatLabels = generateHazmatLabels;
exports.getShippingRates = getShippingRates;
exports.selectBestCarrier = selectBestCarrier;
exports.validateCarrierCredentials = validateCarrierCredentials;
exports.createCarrierShipment = createCarrierShipment;
exports.voidCarrierShipment = voidCarrierShipment;
exports.scheduleCarrierPickup = scheduleCarrierPickup;
exports.validateShippingAddress = validateShippingAddress;
exports.getTransitTimeEstimate = getTransitTimeEstimate;
exports.generateCarrierManifest = generateCarrierManifest;
exports.trackShipment = trackShipment;
exports.trackMultipleShipments = trackMultipleShipments;
exports.getLatestTrackingEvent = getLatestTrackingEvent;
exports.checkShipmentDelay = checkShipmentDelay;
exports.generateTrackingURL = generateTrackingURL;
exports.subscribeToTrackingUpdates = subscribeToTrackingUpdates;
exports.generateProofOfDelivery = generateProofOfDelivery;
exports.analyzeShipmentPerformance = analyzeShipmentPerformance;
/**
 * File: /reuse/logistics/outbound-packing-shipping-kit.ts
 * Locator: WC-LOGISTICS-PKG-SHIP-001
 * Purpose: Comprehensive Packing and Shipping Operations - Complete outbound logistics lifecycle
 *
 * Upstream: Independent utility module for logistics packing and shipping operations
 * Downstream: ../backend/logistics/*, Warehouse modules, Carrier integrations, Label services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 42 utility functions for packing stations, cartonization, labels, carriers, tracking
 *
 * LLM Context: Enterprise-grade packing and shipping utilities for warehouse operations to compete with JD Edwards.
 * Provides comprehensive packing station management, intelligent cartonization algorithms, multi-carrier label
 * generation, carrier API integration, real-time shipment tracking, rate shopping, manifest generation,
 * dimensional weight calculations, hazmat compliance, and international shipping documentation.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Packing station status enumeration
 */
var PackingStationStatus;
(function (PackingStationStatus) {
    PackingStationStatus["AVAILABLE"] = "AVAILABLE";
    PackingStationStatus["OCCUPIED"] = "OCCUPIED";
    PackingStationStatus["MAINTENANCE"] = "MAINTENANCE";
    PackingStationStatus["OFFLINE"] = "OFFLINE";
})(PackingStationStatus || (exports.PackingStationStatus = PackingStationStatus = {}));
/**
 * Shipment status enumeration
 */
var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus["PENDING"] = "PENDING";
    ShipmentStatus["PICKING"] = "PICKING";
    ShipmentStatus["PICKED"] = "PICKED";
    ShipmentStatus["PACKING"] = "PACKING";
    ShipmentStatus["PACKED"] = "PACKED";
    ShipmentStatus["LABELED"] = "LABELED";
    ShipmentStatus["MANIFESTED"] = "MANIFESTED";
    ShipmentStatus["SHIPPED"] = "SHIPPED";
    ShipmentStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ShipmentStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    ShipmentStatus["DELIVERED"] = "DELIVERED";
    ShipmentStatus["EXCEPTION"] = "EXCEPTION";
    ShipmentStatus["RETURNED"] = "RETURNED";
    ShipmentStatus["CANCELLED"] = "CANCELLED";
})(ShipmentStatus || (exports.ShipmentStatus = ShipmentStatus = {}));
/**
 * Carrier enumeration
 */
var Carrier;
(function (Carrier) {
    Carrier["UPS"] = "UPS";
    Carrier["FEDEX"] = "FEDEX";
    Carrier["USPS"] = "USPS";
    Carrier["DHL"] = "DHL";
    Carrier["ONTRAC"] = "ONTRAC";
    Carrier["LASERSHIP"] = "LASERSHIP";
    Carrier["CUSTOM"] = "CUSTOM";
})(Carrier || (exports.Carrier = Carrier = {}));
/**
 * Service level enumeration
 */
var ServiceLevel;
(function (ServiceLevel) {
    ServiceLevel["GROUND"] = "GROUND";
    ServiceLevel["TWO_DAY"] = "TWO_DAY";
    ServiceLevel["OVERNIGHT"] = "OVERNIGHT";
    ServiceLevel["SAME_DAY"] = "SAME_DAY";
    ServiceLevel["INTERNATIONAL_STANDARD"] = "INTERNATIONAL_STANDARD";
    ServiceLevel["INTERNATIONAL_EXPRESS"] = "INTERNATIONAL_EXPRESS";
    ServiceLevel["FREIGHT"] = "FREIGHT";
})(ServiceLevel || (exports.ServiceLevel = ServiceLevel = {}));
/**
 * Package type enumeration
 */
var PackageType;
(function (PackageType) {
    PackageType["ENVELOPE"] = "ENVELOPE";
    PackageType["PAK"] = "PAK";
    PackageType["BOX"] = "BOX";
    PackageType["TUBE"] = "TUBE";
    PackageType["PALLET"] = "PALLET";
    PackageType["CUSTOM"] = "CUSTOM";
})(PackageType || (exports.PackageType = PackageType = {}));
/**
 * Label format enumeration
 */
var LabelFormat;
(function (LabelFormat) {
    LabelFormat["PNG"] = "PNG";
    LabelFormat["PDF"] = "PDF";
    LabelFormat["ZPL"] = "ZPL";
    LabelFormat["EPL"] = "EPL";
    LabelFormat["THERMAL"] = "THERMAL";
})(LabelFormat || (exports.LabelFormat = LabelFormat = {}));
// ============================================================================
// SECTION 1: PACKING STATION MANAGEMENT (Functions 1-8)
// ============================================================================
/**
 * 1. Creates a new packing station.
 *
 * @param {Partial<PackingStation>} config - Station configuration
 * @returns {PackingStation} New packing station
 *
 * @example
 * ```typescript
 * const station = createPackingStation({
 *   warehouseId: 'WH-001',
 *   name: 'Station A1',
 *   zone: 'Zone A',
 *   capabilities: ['STANDARD', 'FRAGILE', 'HAZMAT']
 * });
 * ```
 */
function createPackingStation(config) {
    const stationId = `STATION-${crypto.randomUUID()}`;
    return {
        stationId,
        warehouseId: config.warehouseId || '',
        name: config.name || '',
        status: PackingStationStatus.AVAILABLE,
        zone: config.zone,
        capabilities: config.capabilities || ['STANDARD'],
        equipment: config.equipment || [],
        metrics: {
            packagesProcessed: 0,
            averagePackTime: 0,
            errorRate: 0,
            utilizationRate: 0,
        },
    };
}
/**
 * 2. Assigns user to packing station.
 *
 * @param {PackingStation} station - Packing station
 * @param {string} userId - User ID to assign
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const updated = assignUserToStation(station, 'USER-123');
 * ```
 */
function assignUserToStation(station, userId) {
    return {
        ...station,
        status: PackingStationStatus.OCCUPIED,
        assignedUser: userId,
        lastActivity: new Date(),
    };
}
/**
 * 3. Releases user from packing station.
 *
 * @param {PackingStation} station - Packing station
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const released = releaseStation(station);
 * ```
 */
function releaseStation(station) {
    return {
        ...station,
        status: PackingStationStatus.AVAILABLE,
        assignedUser: undefined,
        currentOrder: undefined,
        lastActivity: new Date(),
    };
}
/**
 * 4. Starts packing operation for order.
 *
 * @param {PackingStation} station - Packing station
 * @param {string} orderId - Order ID to pack
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const started = startPackingOrder(station, 'ORDER-12345');
 * ```
 */
function startPackingOrder(station, orderId) {
    if (station.status !== PackingStationStatus.OCCUPIED) {
        throw new Error('Station must be occupied before starting order');
    }
    return {
        ...station,
        currentOrder: orderId,
        lastActivity: new Date(),
    };
}
/**
 * 5. Completes packing operation.
 *
 * @param {PackingStation} station - Packing station
 * @param {number} packTime - Time taken in seconds
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const completed = completePackingOrder(station, 180);
 * ```
 */
function completePackingOrder(station, packTime) {
    const packagesProcessed = station.metrics.packagesProcessed + 1;
    const totalTime = station.metrics.averagePackTime * station.metrics.packagesProcessed + packTime;
    const averagePackTime = totalTime / packagesProcessed;
    return {
        ...station,
        currentOrder: undefined,
        lastActivity: new Date(),
        metrics: {
            ...station.metrics,
            packagesProcessed,
            averagePackTime,
        },
    };
}
/**
 * 6. Adds equipment to packing station.
 *
 * @param {PackingStation} station - Packing station
 * @param {StationEquipment} equipment - Equipment to add
 * @returns {PackingStation} Updated station
 *
 * @example
 * ```typescript
 * const updated = addStationEquipment(station, {
 *   equipmentId: 'SCALE-001',
 *   type: 'SCALE',
 *   model: 'Mettler Toledo XS',
 *   status: 'ACTIVE'
 * });
 * ```
 */
function addStationEquipment(station, equipment) {
    return {
        ...station,
        equipment: [...station.equipment, equipment],
    };
}
/**
 * 7. Calculates station utilization rate.
 *
 * @param {PackingStation} station - Packing station
 * @param {number} shiftDuration - Shift duration in hours
 * @returns {number} Utilization rate (0-1)
 *
 * @example
 * ```typescript
 * const utilization = calculateStationUtilization(station, 8);
 * // Returns: 0.85 (85% utilized)
 * ```
 */
function calculateStationUtilization(station, shiftDuration) {
    const shiftSeconds = shiftDuration * 3600;
    const activeTime = station.metrics.packagesProcessed * station.metrics.averagePackTime;
    const utilization = Math.min(1, activeTime / shiftSeconds);
    return Number(utilization.toFixed(3));
}
/**
 * 8. Generates station performance report.
 *
 * @param {PackingStation} station - Packing station
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {object} Performance report
 *
 * @example
 * ```typescript
 * const report = generateStationReport(station, startDate, endDate);
 * ```
 */
function generateStationReport(station, startDate, endDate) {
    const recommendations = [];
    if (station.metrics.errorRate > 0.05) {
        recommendations.push('Error rate exceeds 5% - consider additional training');
    }
    if (station.metrics.averagePackTime > 300) {
        recommendations.push('Average pack time over 5 minutes - review process efficiency');
    }
    if (station.metrics.utilizationRate < 0.7) {
        recommendations.push('Utilization below 70% - consider workload rebalancing');
    }
    return {
        stationId: station.stationId,
        period: { start: startDate, end: endDate },
        metrics: station.metrics,
        recommendations,
    };
}
// ============================================================================
// SECTION 2: CARTONIZATION (Functions 9-17)
// ============================================================================
/**
 * 9. Performs intelligent cartonization for items.
 *
 * @param {PackableItem[]} items - Items to pack
 * @param {Container[]} availableContainers - Available container types
 * @returns {CartonizationResult} Cartonization result
 *
 * @example
 * ```typescript
 * const result = cartonizeItems(orderItems, containers);
 * console.log(`Created ${result.totalContainers} packages`);
 * ```
 */
function cartonizeItems(items, availableContainers) {
    const packages = [];
    const warnings = [];
    let remainingItems = [...items];
    let packageSequence = 1;
    // Separate hazmat and fragile items
    const hazmatItems = remainingItems.filter(item => item.hazmat);
    const fragileItems = remainingItems.filter(item => item.fragile && !item.hazmat);
    const regularItems = remainingItems.filter(item => !item.fragile && !item.hazmat);
    // Pack hazmat separately
    for (const item of hazmatItems) {
        const container = findBestContainer(item, availableContainers);
        if (container) {
            packages.push(createPackage(container, [item], packageSequence++));
        }
        else {
            warnings.push(`No suitable container for hazmat item ${item.sku}`);
        }
    }
    // Pack fragile items
    packages.push(...packItemsIntoContainers(fragileItems, availableContainers, packageSequence));
    packageSequence += fragileItems.length;
    // Pack regular items efficiently
    packages.push(...packItemsIntoContainers(regularItems, availableContainers, packageSequence));
    const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight.value, 0);
    const totalVolume = packages.reduce((sum, pkg) => sum + pkg.container.volume, 0);
    const estimatedCost = packages.reduce((sum, pkg) => sum + pkg.container.cost, 0);
    return {
        packages,
        totalContainers: packages.length,
        totalWeight: { value: totalWeight, unit: 'lb' },
        totalVolume,
        efficiency: calculatePackingEfficiency(packages),
        estimatedCost,
        warnings,
    };
}
/**
 * 10. Finds optimal container for item.
 *
 * @param {PackableItem} item - Item to pack
 * @param {Container[]} containers - Available containers
 * @returns {Container | null} Best container or null
 *
 * @example
 * ```typescript
 * const container = findBestContainer(item, availableContainers);
 * ```
 */
function findBestContainer(item, containers) {
    const suitableContainers = containers.filter(container => {
        return (item.dimensions.length <= container.dimensions.length &&
            item.dimensions.width <= container.dimensions.width &&
            item.dimensions.height <= container.dimensions.height &&
            item.weight.value <= container.maxWeight.value);
    });
    if (suitableContainers.length === 0)
        return null;
    // Return smallest suitable container (lowest cost)
    return suitableContainers.sort((a, b) => a.cost - b.cost)[0];
}
/**
 * 11. Calculates dimensional weight.
 *
 * @param {Dimensions} dimensions - Package dimensions
 * @param {number} divisor - Dimensional divisor (default: 139 for UPS/FedEx)
 * @returns {Weight} Dimensional weight
 *
 * @example
 * ```typescript
 * const dimWeight = calculateDimensionalWeight(
 *   { length: 12, width: 10, height: 8, unit: 'in' },
 *   139
 * );
 * // Returns: { value: 7, unit: 'lb' }
 * ```
 */
function calculateDimensionalWeight(dimensions, divisor = 139) {
    const volume = dimensions.length * dimensions.width * dimensions.height;
    const dimWeight = Math.ceil(volume / divisor);
    return {
        value: dimWeight,
        unit: 'lb',
    };
}
/**
 * 12. Validates package against carrier restrictions.
 *
 * @param {Package} pkg - Package to validate
 * @param {Carrier} carrier - Carrier to validate against
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePackageForCarrier(package, Carrier.UPS);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
function validatePackageForCarrier(pkg, carrier) {
    const errors = [];
    const warnings = [];
    // UPS restrictions
    if (carrier === Carrier.UPS) {
        const maxLength = 108;
        const maxGirth = 165; // Length + 2*(Width + Height)
        const maxWeight = 150;
        if (pkg.dimensions.length > maxLength) {
            errors.push(`Length ${pkg.dimensions.length}" exceeds UPS maximum of ${maxLength}"`);
        }
        const girth = pkg.dimensions.length + 2 * (pkg.dimensions.width + pkg.dimensions.height);
        if (girth > maxGirth) {
            errors.push(`Girth ${girth}" exceeds UPS maximum of ${maxGirth}"`);
        }
        if (pkg.weight.value > maxWeight) {
            errors.push(`Weight ${pkg.weight.value}lb exceeds UPS maximum of ${maxWeight}lb`);
        }
    }
    // FedEx restrictions
    if (carrier === Carrier.FEDEX) {
        const maxLength = 119;
        const maxGirth = 165;
        const maxWeight = 150;
        if (pkg.dimensions.length > maxLength) {
            errors.push(`Length ${pkg.dimensions.length}" exceeds FedEx maximum of ${maxLength}"`);
        }
        const girth = pkg.dimensions.length + 2 * (pkg.dimensions.width + pkg.dimensions.height);
        if (girth > maxGirth) {
            errors.push(`Girth ${girth}" exceeds FedEx maximum of ${maxGirth}"`);
        }
        if (pkg.weight.value > maxWeight) {
            errors.push(`Weight ${pkg.weight.value}lb exceeds FedEx maximum of ${maxWeight}lb`);
        }
    }
    // USPS restrictions
    if (carrier === Carrier.USPS) {
        const maxLength = 108;
        const maxGirth = 130;
        const maxWeight = 70;
        if (pkg.dimensions.length > maxLength) {
            errors.push(`Length ${pkg.dimensions.length}" exceeds USPS maximum of ${maxLength}"`);
        }
        const girth = pkg.dimensions.length + 2 * (pkg.dimensions.width + pkg.dimensions.height);
        if (girth > maxGirth) {
            errors.push(`Girth ${girth}" exceeds USPS maximum of ${maxGirth}"`);
        }
        if (pkg.weight.value > maxWeight) {
            errors.push(`Weight ${pkg.weight.value}lb exceeds USPS maximum of ${maxWeight}lb`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * 13. Optimizes box selection for cost efficiency.
 *
 * @param {PackableItem[]} items - Items to pack
 * @param {Container[]} containers - Available containers
 * @returns {Container} Optimal container
 *
 * @example
 * ```typescript
 * const optimal = optimizeBoxSelection(items, containers);
 * ```
 */
function optimizeBoxSelection(items, containers) {
    const totalVolume = items.reduce((sum, item) => {
        return sum + item.dimensions.length * item.dimensions.width * item.dimensions.height;
    }, 0);
    const totalWeight = items.reduce((sum, item) => sum + item.weight.value, 0);
    const suitableContainers = containers.filter(container => {
        return container.volume >= totalVolume && container.maxWeight.value >= totalWeight;
    });
    if (suitableContainers.length === 0)
        return null;
    // Sort by efficiency: volume utilization / cost
    return suitableContainers.sort((a, b) => {
        const aEfficiency = totalVolume / a.volume / a.cost;
        const bEfficiency = totalVolume / b.volume / b.cost;
        return bEfficiency - aEfficiency;
    })[0];
}
/**
 * 14. Calculates packing efficiency.
 *
 * @param {Package[]} packages - Packed packages
 * @returns {number} Efficiency percentage (0-100)
 *
 * @example
 * ```typescript
 * const efficiency = calculatePackingEfficiency(packages);
 * // Returns: 87.5 (87.5% space utilization)
 * ```
 */
function calculatePackingEfficiency(packages) {
    let totalItemVolume = 0;
    let totalContainerVolume = 0;
    for (const pkg of packages) {
        for (const item of pkg.items) {
            totalItemVolume += item.dimensions.length * item.dimensions.width * item.dimensions.height;
        }
        totalContainerVolume += pkg.container.volume;
    }
    if (totalContainerVolume === 0)
        return 0;
    const efficiency = (totalItemVolume / totalContainerVolume) * 100;
    return Number(efficiency.toFixed(2));
}
/**
 * 15. Groups items by compatible packing requirements.
 *
 * @param {PackableItem[]} items - Items to group
 * @returns {Record<string, PackableItem[]>} Grouped items
 *
 * @example
 * ```typescript
 * const groups = groupItemsByCompatibility(items);
 * // Returns: { HAZMAT: [...], FRAGILE: [...], STANDARD: [...] }
 * ```
 */
function groupItemsByCompatibility(items) {
    const groups = {
        HAZMAT: [],
        FRAGILE: [],
        COLD_CHAIN: [],
        STANDARD: [],
    };
    for (const item of items) {
        if (item.hazmat) {
            groups.HAZMAT.push(item);
        }
        else if (item.requiresColdChain) {
            groups.COLD_CHAIN.push(item);
        }
        else if (item.fragile) {
            groups.FRAGILE.push(item);
        }
        else {
            groups.STANDARD.push(item);
        }
    }
    return groups;
}
/**
 * 16. Estimates void fill material needed.
 *
 * @param {Package} pkg - Package
 * @returns {object} Void fill estimate
 *
 * @example
 * ```typescript
 * const voidFill = estimateVoidFill(package);
 * // Returns: { type: 'AIR_PILLOWS', volume: 120, cost: 0.45 }
 * ```
 */
function estimateVoidFill(pkg) {
    let itemVolume = 0;
    for (const item of pkg.items) {
        itemVolume += item.dimensions.length * item.dimensions.width * item.dimensions.height;
    }
    const containerVolume = pkg.container.volume;
    const voidVolume = containerVolume - itemVolume;
    const hasFragile = pkg.items.some(item => item.fragile);
    const type = hasFragile ? 'BUBBLE_WRAP' : 'AIR_PILLOWS';
    const costPerCubicInch = hasFragile ? 0.005 : 0.0025;
    return {
        type,
        volume: Math.max(0, voidVolume),
        cost: Number((voidVolume * costPerCubicInch).toFixed(2)),
    };
}
/**
 * 17. Generates packing instructions.
 *
 * @param {Package} pkg - Package to pack
 * @returns {string[]} Step-by-step instructions
 *
 * @example
 * ```typescript
 * const instructions = generatePackingInstructions(package);
 * instructions.forEach((step, i) => console.log(`${i + 1}. ${step}`));
 * ```
 */
function generatePackingInstructions(pkg) {
    const instructions = [];
    instructions.push(`Select ${pkg.container.name} container`);
    const hasFragile = pkg.items.some(item => item.fragile);
    const hasHazmat = pkg.items.some(item => item.hazmat);
    if (hasFragile || hasHazmat) {
        instructions.push('Apply cushioning material to bottom of box');
    }
    for (const item of pkg.items) {
        instructions.push(`Place ${item.quantity}x ${item.name} (SKU: ${item.sku})`);
        if (item.fragile) {
            instructions.push('  → Wrap item in bubble wrap');
        }
        if (item.hazmat) {
            instructions.push('  → Ensure hazmat labeling is visible');
        }
    }
    const voidFill = estimateVoidFill(pkg);
    if (voidFill.volume > 50) {
        instructions.push(`Add ${voidFill.type} void fill`);
    }
    instructions.push('Seal box with packing tape');
    if (hasFragile) {
        instructions.push('Apply FRAGILE stickers to all sides');
    }
    if (hasHazmat) {
        instructions.push('Apply HAZMAT labels as required');
    }
    instructions.push('Affix shipping label to top of package');
    instructions.push('Scan package barcode to confirm packing complete');
    return instructions;
}
// ============================================================================
// SECTION 3: LABEL GENERATION (Functions 18-25)
// ============================================================================
/**
 * 18. Generates shipping label.
 *
 * @param {Shipment} shipment - Shipment details
 * @param {LabelFormat} format - Label format
 * @returns {ShippingLabel} Generated label
 *
 * @example
 * ```typescript
 * const label = generateShippingLabel(shipment, LabelFormat.PDF);
 * ```
 */
function generateShippingLabel(shipment, format = LabelFormat.PDF) {
    const labelId = `LABEL-${crypto.randomUUID()}`;
    const trackingNumber = generateTrackingNumber(shipment.carrier);
    // In production, this would call carrier API
    const labelData = encodeLabelData(shipment, trackingNumber, format);
    return {
        labelId,
        trackingNumber,
        carrier: shipment.carrier,
        serviceLevel: shipment.serviceLevel,
        labelFormat: format,
        labelData,
        labelUrl: `https://labels.example.com/${labelId}.${format.toLowerCase()}`,
        cost: shipment.shippingCost,
        createdAt: new Date(),
        expiresAt: addDays(new Date(), 30),
    };
}
/**
 * 19. Generates return label.
 *
 * @param {Shipment} originalShipment - Original shipment
 * @param {LabelFormat} format - Label format
 * @returns {ShippingLabel} Return label
 *
 * @example
 * ```typescript
 * const returnLabel = generateReturnLabel(shipment, LabelFormat.PDF);
 * ```
 */
function generateReturnLabel(originalShipment, format = LabelFormat.PDF) {
    // Swap from/to addresses
    const returnShipment = {
        ...originalShipment,
        shipmentId: `RETURN-${crypto.randomUUID()}`,
        shipFrom: originalShipment.shipTo,
        shipTo: originalShipment.shipFrom,
        status: ShipmentStatus.PENDING,
    };
    const label = generateShippingLabel(returnShipment, format);
    return {
        ...label,
        labelId: `RETURN-${label.labelId}`,
    };
}
/**
 * 20. Generates batch labels for multiple shipments.
 *
 * @param {Shipment[]} shipments - Shipments to label
 * @param {LabelFormat} format - Label format
 * @returns {ShippingLabel[]} Generated labels
 *
 * @example
 * ```typescript
 * const labels = generateBatchLabels(shipments, LabelFormat.ZPL);
 * ```
 */
function generateBatchLabels(shipments, format = LabelFormat.PDF) {
    return shipments.map(shipment => generateShippingLabel(shipment, format));
}
/**
 * 21. Generates international shipping label with customs.
 *
 * @param {Shipment} shipment - International shipment
 * @param {CustomsDeclaration} customs - Customs declaration
 * @param {LabelFormat} format - Label format
 * @returns {object} Label and customs documents
 *
 * @example
 * ```typescript
 * const intlDocs = generateInternationalLabel(shipment, customs, LabelFormat.PDF);
 * ```
 */
function generateInternationalLabel(shipment, customs, format = LabelFormat.PDF) {
    const label = generateShippingLabel(shipment, format);
    const customsForm = generateCustomsForm(shipment, customs);
    const commercialInvoice = generateCommercialInvoice(shipment, customs);
    return {
        label,
        customsForm,
        commercialInvoice,
    };
}
/**
 * 22. Formats label for thermal printer.
 *
 * @param {ShippingLabel} label - Shipping label
 * @param {number} dpi - Printer DPI (203 or 300)
 * @returns {string} ZPL formatted label
 *
 * @example
 * ```typescript
 * const zpl = formatLabelForThermalPrinter(label, 300);
 * ```
 */
function formatLabelForThermalPrinter(label, dpi = 300) {
    // Simplified ZPL generation
    return `
^XA
^FO50,50^A0N,40,40^FD${label.carrier}^FS
^FO50,100^A0N,30,30^FDTracking: ${label.trackingNumber}^FS
^FO50,150^A0N,25,25^FDService: ${label.serviceLevel}^FS
^FO50,200^BY3^BCN,100,Y,N,N^FD${label.trackingNumber}^FS
^XZ
  `.trim();
}
/**
 * 23. Validates label data.
 *
 * @param {ShippingLabel} label - Label to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateLabel(label);
 * ```
 */
function validateLabel(label) {
    const errors = [];
    if (!label.trackingNumber || label.trackingNumber.length < 10) {
        errors.push('Invalid tracking number');
    }
    if (!label.labelData || label.labelData.length === 0) {
        errors.push('Label data is empty');
    }
    if (label.expiresAt && label.expiresAt < new Date()) {
        errors.push('Label has expired');
    }
    if (label.cost <= 0) {
        errors.push('Invalid label cost');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * 24. Generates packing slip.
 *
 * @param {Shipment} shipment - Shipment
 * @returns {string} HTML packing slip
 *
 * @example
 * ```typescript
 * const packingSlip = generatePackingSlip(shipment);
 * ```
 */
function generatePackingSlip(shipment) {
    const items = shipment.packages.flatMap(pkg => pkg.items);
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Packing Slip - ${shipment.orderId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { border-bottom: 2px solid #000; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Packing Slip</h1>
  <p><strong>Order ID:</strong> ${shipment.orderId}</p>
  <p><strong>Shipment ID:</strong> ${shipment.shipmentId}</p>
  <p><strong>Ship Date:</strong> ${shipment.shipDate?.toLocaleDateString() || 'Pending'}</p>

  <h2>Ship To:</h2>
  <p>
    ${shipment.shipTo.name}<br>
    ${shipment.shipTo.company || ''}<br>
    ${shipment.shipTo.addressLine1}<br>
    ${shipment.shipTo.addressLine2 || ''}<br>
    ${shipment.shipTo.city}, ${shipment.shipTo.state} ${shipment.shipTo.postalCode}<br>
    ${shipment.shipTo.country}
  </p>

  <h2>Items</h2>
  <table>
    <thead>
      <tr>
        <th>SKU</th>
        <th>Item</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>${item.sku}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p><strong>Total Packages:</strong> ${shipment.packages.length}</p>
  <p><strong>Carrier:</strong> ${shipment.carrier}</p>
  <p><strong>Service:</strong> ${shipment.serviceLevel}</p>
</body>
</html>
  `.trim();
}
/**
 * 25. Generates hazmat labels and documentation.
 *
 * @param {HazmatInfo} hazmat - Hazmat information
 * @returns {object} Hazmat labels and docs
 *
 * @example
 * ```typescript
 * const hazmatDocs = generateHazmatLabels({
 *   unNumber: 'UN1263',
 *   properShippingName: 'Paint',
 *   hazardClass: '3',
 *   packingGroup: 'II',
 *   quantity: 5,
 *   unit: 'L'
 * });
 * ```
 */
function generateHazmatLabels(hazmat) {
    const label = `
HAZARDOUS MATERIAL
${hazmat.unNumber}
${hazmat.properShippingName}
Class ${hazmat.hazardClass}
Packing Group ${hazmat.packingGroup}
Quantity: ${hazmat.quantity} ${hazmat.unit}
  `.trim();
    const declaration = `
SHIPPER'S DECLARATION FOR DANGEROUS GOODS

UN Number: ${hazmat.unNumber}
Proper Shipping Name: ${hazmat.properShippingName}
Hazard Class: ${hazmat.hazardClass}
Packing Group: ${hazmat.packingGroup}
Quantity: ${hazmat.quantity} ${hazmat.unit}

This shipment is within the limitations prescribed for passenger and cargo aircraft.
  `.trim();
    return {
        label,
        declaration,
        msds: `MSDS required for ${hazmat.properShippingName}`,
    };
}
// ============================================================================
// SECTION 4: CARRIER INTEGRATION (Functions 26-34)
// ============================================================================
/**
 * 26. Gets shipping rates from multiple carriers.
 *
 * @param {Shipment} shipment - Shipment details
 * @param {Carrier[]} carriers - Carriers to check
 * @returns {RateQuote[]} Rate quotes
 *
 * @example
 * ```typescript
 * const rates = getShippingRates(shipment, [Carrier.UPS, Carrier.FEDEX, Carrier.USPS]);
 * const cheapest = rates.sort((a, b) => a.cost - b.cost)[0];
 * ```
 */
function getShippingRates(shipment, carriers) {
    const quotes = [];
    for (const carrier of carriers) {
        // In production, this would call actual carrier APIs
        const quote = mockCarrierRateQuote(shipment, carrier);
        quotes.push(quote);
    }
    return quotes.sort((a, b) => a.cost - b.cost);
}
/**
 * 27. Selects best carrier based on criteria.
 *
 * @param {RateQuote[]} quotes - Rate quotes
 * @param {object} criteria - Selection criteria
 * @returns {RateQuote} Best quote
 *
 * @example
 * ```typescript
 * const best = selectBestCarrier(quotes, {
 *   prioritize: 'COST',
 *   maxDeliveryDays: 3
 * });
 * ```
 */
function selectBestCarrier(quotes, criteria) {
    let filtered = [...quotes];
    if (criteria.maxDeliveryDays) {
        filtered = filtered.filter(q => q.deliveryDays <= criteria.maxDeliveryDays);
    }
    if (criteria.maxCost) {
        filtered = filtered.filter(q => q.cost <= criteria.maxCost);
    }
    if (filtered.length === 0) {
        throw new Error('No carriers meet the specified criteria');
    }
    if (criteria.prioritize === 'COST') {
        return filtered.sort((a, b) => a.cost - b.cost)[0];
    }
    else if (criteria.prioritize === 'SPEED') {
        return filtered.sort((a, b) => a.deliveryDays - b.deliveryDays)[0];
    }
    else {
        // RELIABILITY - prefer carriers with guaranteed delivery
        const guaranteed = filtered.filter(q => q.guaranteedDelivery);
        if (guaranteed.length > 0) {
            return guaranteed.sort((a, b) => a.cost - b.cost)[0];
        }
        return filtered.sort((a, b) => a.cost - b.cost)[0];
    }
}
/**
 * 28. Validates carrier credentials.
 *
 * @param {CarrierCredentials} credentials - Carrier credentials
 * @returns {Promise<boolean>} Validation result
 *
 * @example
 * ```typescript
 * const valid = await validateCarrierCredentials(credentials);
 * ```
 */
async function validateCarrierCredentials(credentials) {
    // In production, this would call carrier API
    if (!credentials.apiKey || credentials.apiKey.length < 10) {
        return false;
    }
    if (!credentials.accountNumber) {
        return false;
    }
    // Mock API validation
    return true;
}
/**
 * 29. Creates shipment with carrier.
 *
 * @param {Shipment} shipment - Shipment to create
 * @param {CarrierCredentials} credentials - Carrier credentials
 * @returns {Promise<Shipment>} Created shipment with tracking
 *
 * @example
 * ```typescript
 * const created = await createCarrierShipment(shipment, credentials);
 * console.log('Tracking:', created.trackingNumbers);
 * ```
 */
async function createCarrierShipment(shipment, credentials) {
    // Validate package against carrier
    for (const pkg of shipment.packages) {
        const validation = validatePackageForCarrier(pkg, shipment.carrier);
        if (!validation.valid) {
            throw new Error(`Package validation failed: ${validation.errors.join(', ')}`);
        }
    }
    // In production, call carrier API
    const trackingNumbers = shipment.packages.map(() => generateTrackingNumber(shipment.carrier));
    const labels = shipment.packages.map((pkg, i) => ({
        labelId: `LABEL-${crypto.randomUUID()}`,
        trackingNumber: trackingNumbers[i],
        carrier: shipment.carrier,
        serviceLevel: shipment.serviceLevel,
        labelFormat: LabelFormat.PDF,
        labelData: 'mock-label-data',
        cost: shipment.shippingCost / shipment.packages.length,
        createdAt: new Date(),
    }));
    return {
        ...shipment,
        status: ShipmentStatus.LABELED,
        trackingNumbers,
        labels,
    };
}
/**
 * 30. Voids/cancels shipment with carrier.
 *
 * @param {string} trackingNumber - Tracking number
 * @param {Carrier} carrier - Carrier
 * @param {CarrierCredentials} credentials - Carrier credentials
 * @returns {Promise<boolean>} Void success
 *
 * @example
 * ```typescript
 * const voided = await voidCarrierShipment('1Z999AA10123456784', Carrier.UPS, credentials);
 * ```
 */
async function voidCarrierShipment(trackingNumber, carrier, credentials) {
    // In production, call carrier void API
    // Most carriers allow voiding within 24 hours
    return true;
}
/**
 * 31. Schedules carrier pickup.
 *
 * @param {object} pickupRequest - Pickup request details
 * @param {CarrierCredentials} credentials - Carrier credentials
 * @returns {Promise<object>} Pickup confirmation
 *
 * @example
 * ```typescript
 * const pickup = await scheduleCarrierPickup({
 *   carrier: Carrier.UPS,
 *   date: new Date('2024-01-20'),
 *   location: warehouse,
 *   packageCount: 15,
 *   totalWeight: { value: 250, unit: 'lb' }
 * }, credentials);
 * ```
 */
async function scheduleCarrierPickup(pickupRequest, credentials) {
    // In production, call carrier pickup API
    return {
        pickupId: `PICKUP-${crypto.randomUUID()}`,
        carrier: pickupRequest.carrier,
        confirmationNumber: generateConfirmationNumber(),
        scheduledDate: pickupRequest.date,
        timeWindow: `${pickupRequest.readyTime || '09:00'} - ${pickupRequest.closeTime || '17:00'}`,
    };
}
/**
 * 32. Validates shipping address.
 *
 * @param {Address} address - Address to validate
 * @param {Carrier} carrier - Carrier for validation
 * @returns {Promise<object>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateShippingAddress(address, Carrier.USPS);
 * if (validation.valid && validation.suggested) {
 *   console.log('Suggested:', validation.suggested);
 * }
 * ```
 */
async function validateShippingAddress(address, carrier) {
    const errors = [];
    if (!address.postalCode || address.postalCode.length < 5) {
        errors.push('Invalid postal code');
    }
    if (!address.city || !address.state) {
        errors.push('City and state are required');
    }
    if (!address.addressLine1) {
        errors.push('Address line 1 is required');
    }
    // In production, call carrier address validation API
    return {
        valid: errors.length === 0,
        confidence: errors.length === 0 ? 'HIGH' : 'LOW',
        errors: errors.length > 0 ? errors : undefined,
    };
}
/**
 * 33. Gets transit time estimate.
 *
 * @param {Address} origin - Origin address
 * @param {Address} destination - Destination address
 * @param {Carrier} carrier - Carrier
 * @param {ServiceLevel} service - Service level
 * @returns {Promise<object>} Transit estimate
 *
 * @example
 * ```typescript
 * const estimate = await getTransitTimeEstimate(origin, destination, Carrier.FEDEX, ServiceLevel.GROUND);
 * ```
 */
async function getTransitTimeEstimate(origin, destination, carrier, service) {
    // In production, call carrier transit time API
    let transitDays = 5;
    switch (service) {
        case ServiceLevel.OVERNIGHT:
            transitDays = 1;
            break;
        case ServiceLevel.TWO_DAY:
            transitDays = 2;
            break;
        case ServiceLevel.GROUND:
            transitDays = 5;
            break;
        case ServiceLevel.INTERNATIONAL_EXPRESS:
            transitDays = 3;
            break;
        case ServiceLevel.INTERNATIONAL_STANDARD:
            transitDays = 10;
            break;
    }
    const estimatedDelivery = addBusinessDays(new Date(), transitDays);
    return {
        transitDays,
        estimatedDelivery,
        guaranteed: service === ServiceLevel.OVERNIGHT || service === ServiceLevel.TWO_DAY,
    };
}
/**
 * 34. Generates end-of-day manifest.
 *
 * @param {string[]} shipmentIds - Shipment IDs to manifest
 * @param {Carrier} carrier - Carrier
 * @param {string} warehouseId - Warehouse ID
 * @returns {Manifest} Generated manifest
 *
 * @example
 * ```typescript
 * const manifest = generateCarrierManifest(shipmentIds, Carrier.UPS, 'WH-001');
 * ```
 */
function generateCarrierManifest(shipmentIds, carrier, warehouseId) {
    const manifestId = `MANIFEST-${crypto.randomUUID()}`;
    return {
        manifestId,
        carrier,
        warehouseId,
        shipDate: new Date(),
        shipments: shipmentIds,
        packageCount: shipmentIds.length,
        totalWeight: { value: 0, unit: 'lb' }, // Would be calculated from actual shipments
        manifestDocument: `Manifest document content for ${manifestId}`,
        manifestUrl: `https://manifests.example.com/${manifestId}.pdf`,
        closedAt: new Date(),
    };
}
// ============================================================================
// SECTION 5: SHIPMENT TRACKING (Functions 35-42)
// ============================================================================
/**
 * 35. Tracks shipment by tracking number.
 *
 * @param {string} trackingNumber - Tracking number
 * @param {Carrier} carrier - Carrier
 * @returns {Promise<TrackingInfo>} Tracking information
 *
 * @example
 * ```typescript
 * const tracking = await trackShipment('1Z999AA10123456784', Carrier.UPS);
 * console.log('Status:', tracking.status);
 * console.log('Location:', tracking.currentLocation);
 * ```
 */
async function trackShipment(trackingNumber, carrier) {
    // In production, call carrier tracking API
    const mockEvents = [
        {
            eventId: crypto.randomUUID(),
            timestamp: new Date(Date.now() - 86400000 * 2),
            status: 'PICKED_UP',
            statusCode: 'PU',
            location: 'Origin Facility',
            city: 'Los Angeles',
            state: 'CA',
            country: 'US',
            description: 'Package picked up from shipper',
        },
        {
            eventId: crypto.randomUUID(),
            timestamp: new Date(Date.now() - 86400000),
            status: 'IN_TRANSIT',
            statusCode: 'IT',
            location: 'Sort Facility',
            city: 'Memphis',
            state: 'TN',
            country: 'US',
            description: 'Package in transit',
        },
        {
            eventId: crypto.randomUUID(),
            timestamp: new Date(),
            status: 'OUT_FOR_DELIVERY',
            statusCode: 'OFD',
            location: 'Destination Facility',
            city: 'New York',
            state: 'NY',
            country: 'US',
            description: 'Out for delivery',
        },
    ];
    return {
        trackingNumber,
        carrier,
        status: ShipmentStatus.OUT_FOR_DELIVERY,
        events: mockEvents,
        currentLocation: 'New York, NY',
        estimatedDelivery: new Date(Date.now() + 3600000 * 8),
        lastUpdated: new Date(),
    };
}
/**
 * 36. Tracks multiple shipments in batch.
 *
 * @param {Array<{trackingNumber: string, carrier: Carrier}>} shipments - Shipments to track
 * @returns {Promise<TrackingInfo[]>} Tracking information
 *
 * @example
 * ```typescript
 * const tracking = await trackMultipleShipments([
 *   { trackingNumber: '1Z999AA10123456784', carrier: Carrier.UPS },
 *   { trackingNumber: '794612345678', carrier: Carrier.FEDEX }
 * ]);
 * ```
 */
async function trackMultipleShipments(shipments) {
    const trackingPromises = shipments.map(s => trackShipment(s.trackingNumber, s.carrier));
    return Promise.all(trackingPromises);
}
/**
 * 37. Gets latest tracking event.
 *
 * @param {TrackingInfo} tracking - Tracking information
 * @returns {TrackingEvent} Latest event
 *
 * @example
 * ```typescript
 * const latest = getLatestTrackingEvent(tracking);
 * console.log(latest.description);
 * ```
 */
function getLatestTrackingEvent(tracking) {
    if (tracking.events.length === 0) {
        throw new Error('No tracking events available');
    }
    return tracking.events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
}
/**
 * 38. Checks if shipment is delayed.
 *
 * @param {TrackingInfo} tracking - Tracking information
 * @param {Date} expectedDelivery - Expected delivery date
 * @returns {object} Delay information
 *
 * @example
 * ```typescript
 * const delay = checkShipmentDelay(tracking, expectedDeliveryDate);
 * if (delay.isDelayed) {
 *   console.log(`Delayed by ${delay.delayDays} days`);
 * }
 * ```
 */
function checkShipmentDelay(tracking, expectedDelivery) {
    const now = new Date();
    const isDelayed = now > expectedDelivery && tracking.status !== ShipmentStatus.DELIVERED;
    if (!isDelayed) {
        return { isDelayed: false, delayDays: 0 };
    }
    const delayDays = Math.ceil((now.getTime() - expectedDelivery.getTime()) / (1000 * 60 * 60 * 24));
    // Check for exception events
    const exceptionEvent = tracking.events.find(e => e.exceptionCode);
    return {
        isDelayed: true,
        delayDays,
        reason: exceptionEvent?.description,
    };
}
/**
 * 39. Generates tracking URL for customer.
 *
 * @param {string} trackingNumber - Tracking number
 * @param {Carrier} carrier - Carrier
 * @returns {string} Tracking URL
 *
 * @example
 * ```typescript
 * const url = generateTrackingURL('1Z999AA10123456784', Carrier.UPS);
 * // Returns: 'https://www.ups.com/track?tracknum=1Z999AA10123456784'
 * ```
 */
function generateTrackingURL(trackingNumber, carrier) {
    const urls = {
        [Carrier.UPS]: `https://www.ups.com/track?tracknum=${trackingNumber}`,
        [Carrier.FEDEX]: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
        [Carrier.USPS]: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
        [Carrier.DHL]: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
        [Carrier.ONTRAC]: `https://www.ontrac.com/tracking/?number=${trackingNumber}`,
        [Carrier.LASERSHIP]: `https://www.lasership.com/track/${trackingNumber}`,
        [Carrier.CUSTOM]: `https://tracking.example.com/${trackingNumber}`,
    };
    return urls[carrier];
}
/**
 * 40. Subscribes to tracking updates.
 *
 * @param {string} trackingNumber - Tracking number
 * @param {Carrier} carrier - Carrier
 * @param {object} notification - Notification preferences
 * @returns {Promise<object>} Subscription details
 *
 * @example
 * ```typescript
 * const subscription = await subscribeToTrackingUpdates(
 *   '1Z999AA10123456784',
 *   Carrier.UPS,
 *   { email: 'customer@example.com', sms: '+15555551234' }
 * );
 * ```
 */
async function subscribeToTrackingUpdates(trackingNumber, carrier, notification) {
    // In production, set up webhooks with carrier API
    return {
        subscriptionId: `SUB-${crypto.randomUUID()}`,
        trackingNumber,
        active: true,
    };
}
/**
 * 41. Generates delivery proof document.
 *
 * @param {TrackingInfo} tracking - Tracking information
 * @returns {object} Proof of delivery
 *
 * @example
 * ```typescript
 * const pod = generateProofOfDelivery(tracking);
 * ```
 */
function generateProofOfDelivery(tracking) {
    const deliveryEvent = tracking.events.find(e => e.status === 'DELIVERED');
    if (!deliveryEvent) {
        throw new Error('Package not yet delivered');
    }
    return {
        trackingNumber: tracking.trackingNumber,
        deliveryDate: deliveryEvent.timestamp,
        signedBy: deliveryEvent.signedBy || 'Not available',
        location: deliveryEvent.location || 'Unknown',
        certificateUrl: `https://pod.example.com/${tracking.trackingNumber}.pdf`,
    };
}
/**
 * 42. Analyzes shipment performance metrics.
 *
 * @param {TrackingInfo[]} trackingData - Historical tracking data
 * @returns {object} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = analyzeShipmentPerformance(allTrackingData);
 * console.log(`On-time delivery: ${metrics.onTimeRate}%`);
 * console.log(`Average transit: ${metrics.averageTransitDays} days`);
 * ```
 */
function analyzeShipmentPerformance(trackingData) {
    const delivered = trackingData.filter(t => t.status === ShipmentStatus.DELIVERED);
    const inTransit = trackingData.filter(t => t.status === ShipmentStatus.IN_TRANSIT || t.status === ShipmentStatus.OUT_FOR_DELIVERY);
    const exceptions = trackingData.filter(t => t.status === ShipmentStatus.EXCEPTION);
    const onTimeDeliveries = delivered.filter(t => {
        if (!t.estimatedDelivery || !t.actualDelivery)
            return false;
        return t.actualDelivery <= t.estimatedDelivery;
    });
    const onTimeRate = delivered.length > 0 ? (onTimeDeliveries.length / delivered.length) * 100 : 0;
    const transitDays = delivered
        .map(t => {
        if (!t.actualDelivery)
            return 0;
        const pickupEvent = t.events.find(e => e.statusCode === 'PU');
        if (!pickupEvent)
            return 0;
        return Math.ceil((t.actualDelivery.getTime() - pickupEvent.timestamp.getTime()) / (1000 * 60 * 60 * 24));
    })
        .filter(d => d > 0);
    const averageTransitDays = transitDays.length > 0
        ? transitDays.reduce((sum, d) => sum + d, 0) / transitDays.length
        : 0;
    const carrierPerformance = {};
    for (const carrier of Object.values(Carrier)) {
        const carrierShipments = trackingData.filter(t => t.carrier === carrier);
        const carrierDelivered = carrierShipments.filter(t => t.status === ShipmentStatus.DELIVERED);
        const carrierOnTime = carrierDelivered.filter(t => {
            if (!t.estimatedDelivery || !t.actualDelivery)
                return false;
            return t.actualDelivery <= t.estimatedDelivery;
        });
        const carrierExceptions = carrierShipments.filter(t => t.status === ShipmentStatus.EXCEPTION);
        carrierPerformance[carrier] = {
            delivered: carrierDelivered.length,
            onTime: carrierOnTime.length,
            exceptions: carrierExceptions.length,
        };
    }
    return {
        totalShipments: trackingData.length,
        delivered: delivered.length,
        inTransit: inTransit.length,
        exceptions: exceptions.length,
        onTimeRate: Number(onTimeRate.toFixed(2)),
        averageTransitDays: Number(averageTransitDays.toFixed(1)),
        carrierPerformance,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates tracking number for carrier.
 */
function generateTrackingNumber(carrier) {
    const prefixes = {
        [Carrier.UPS]: '1Z',
        [Carrier.FEDEX]: '794',
        [Carrier.USPS]: '9400',
        [Carrier.DHL]: 'JD',
        [Carrier.ONTRAC]: 'D',
        [Carrier.LASERSHIP]: 'LS',
        [Carrier.CUSTOM]: 'CT',
    };
    const prefix = prefixes[carrier];
    const randomDigits = crypto.randomBytes(8).toString('hex').toUpperCase();
    return `${prefix}${randomDigits}`;
}
/**
 * Helper: Encodes label data based on format.
 */
function encodeLabelData(shipment, trackingNumber, format) {
    if (format === LabelFormat.ZPL) {
        return `^XA^FO50,50^A0N,40,40^FD${trackingNumber}^FS^XZ`;
    }
    // Base64 encoded mock label data
    return Buffer.from(`Label for ${trackingNumber}`).toString('base64');
}
/**
 * Helper: Adds days to date.
 */
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
/**
 * Helper: Adds business days to date.
 */
function addBusinessDays(date, days) {
    let result = new Date(date);
    let addedDays = 0;
    while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        // Skip weekends
        if (result.getDay() !== 0 && result.getDay() !== 6) {
            addedDays++;
        }
    }
    return result;
}
/**
 * Helper: Generates confirmation number.
 */
function generateConfirmationNumber() {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
}
/**
 * Helper: Creates a package object.
 */
function createPackage(container, items, sequence) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight.value * item.quantity, 0);
    return {
        packageId: `PKG-${crypto.randomUUID()}`,
        container,
        items,
        weight: { value: totalWeight + container.tareWeight.value, unit: 'lb' },
        dimensions: container.dimensions,
        sequence,
    };
}
/**
 * Helper: Packs items into containers.
 */
function packItemsIntoContainers(items, containers, startSequence) {
    const packages = [];
    const remaining = [...items];
    while (remaining.length > 0) {
        const item = remaining.shift();
        const container = findBestContainer(item, containers);
        if (container) {
            packages.push(createPackage(container, [item], startSequence + packages.length));
        }
    }
    return packages;
}
/**
 * Helper: Mock carrier rate quote.
 */
function mockCarrierRateQuote(shipment, carrier) {
    const baseRate = 10;
    const weightRate = shipment.packages.reduce((sum, pkg) => sum + pkg.weight.value * 0.5, 0);
    const carrierMultipliers = {
        [Carrier.UPS]: 1.0,
        [Carrier.FEDEX]: 1.05,
        [Carrier.USPS]: 0.85,
        [Carrier.DHL]: 1.15,
        [Carrier.ONTRAC]: 0.9,
        [Carrier.LASERSHIP]: 0.88,
        [Carrier.CUSTOM]: 1.0,
    };
    const cost = (baseRate + weightRate) * carrierMultipliers[carrier];
    return {
        quoteId: `QUOTE-${crypto.randomUUID()}`,
        carrier,
        serviceLevel: shipment.serviceLevel,
        cost: Number(cost.toFixed(2)),
        deliveryDays: shipment.serviceLevel === ServiceLevel.OVERNIGHT ? 1 : 5,
        estimatedDeliveryDate: addBusinessDays(new Date(), 5),
        currency: 'USD',
        guaranteedDelivery: shipment.serviceLevel === ServiceLevel.OVERNIGHT,
        includesInsurance: false,
    };
}
/**
 * Helper: Generates customs form.
 */
function generateCustomsForm(shipment, customs) {
    return `
CUSTOMS DECLARATION
Declaration ID: ${customs.declarationId}
Total Value: ${customs.totalValue} ${customs.currency}
Reason for Export: ${customs.reason}
Terms of Sale: ${customs.termsOfSale}

Items:
${customs.items.map((item, i) => `
${i + 1}. ${item.description}
   Quantity: ${item.quantity}
   Value: ${item.value} ${customs.currency}
   Weight: ${item.weight.value} ${item.weight.unit}
   Country of Origin: ${item.countryOfOrigin}
   HS Code: ${item.hsCode || 'N/A'}
`).join('\n')}
  `.trim();
}
/**
 * Helper: Generates commercial invoice.
 */
function generateCommercialInvoice(shipment, customs) {
    return `
COMMERCIAL INVOICE

Ship From:
${shipment.shipFrom.name}
${shipment.shipFrom.addressLine1}
${shipment.shipFrom.city}, ${shipment.shipFrom.state} ${shipment.shipFrom.postalCode}
${shipment.shipFrom.country}

Ship To:
${shipment.shipTo.name}
${shipment.shipTo.addressLine1}
${shipment.shipTo.city}, ${shipment.shipTo.state} ${shipment.shipTo.postalCode}
${shipment.shipTo.country}

Invoice Details:
Total Value: ${customs.totalValue} ${customs.currency}
Terms: ${customs.termsOfSale}
Reason: ${customs.reason}

${customs.items.map((item, i) => `
Item ${i + 1}: ${item.description}
Quantity: ${item.quantity} | Unit Value: ${item.value} | Total: ${item.quantity * item.value}
Origin: ${item.countryOfOrigin} | HS Code: ${item.hsCode || 'N/A'}
`).join('\n')}

Grand Total: ${customs.totalValue} ${customs.currency}
  `.trim();
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Packing Station Management
    createPackingStation,
    assignUserToStation,
    releaseStation,
    startPackingOrder,
    completePackingOrder,
    addStationEquipment,
    calculateStationUtilization,
    generateStationReport,
    // Cartonization
    cartonizeItems,
    findBestContainer,
    calculateDimensionalWeight,
    validatePackageForCarrier,
    optimizeBoxSelection,
    calculatePackingEfficiency,
    groupItemsByCompatibility,
    estimateVoidFill,
    generatePackingInstructions,
    // Label Generation
    generateShippingLabel,
    generateReturnLabel,
    generateBatchLabels,
    generateInternationalLabel,
    formatLabelForThermalPrinter,
    validateLabel,
    generatePackingSlip,
    generateHazmatLabels,
    // Carrier Integration
    getShippingRates,
    selectBestCarrier,
    validateCarrierCredentials,
    createCarrierShipment,
    voidCarrierShipment,
    scheduleCarrierPickup,
    validateShippingAddress,
    getTransitTimeEstimate,
    generateCarrierManifest,
    // Shipment Tracking
    trackShipment,
    trackMultipleShipments,
    getLatestTrackingEvent,
    checkShipmentDelay,
    generateTrackingURL,
    subscribeToTrackingUpdates,
    generateProofOfDelivery,
    analyzeShipmentPerformance,
};
//# sourceMappingURL=outbound-packing-shipping-kit.js.map