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
/**
 * Load status enumeration
 */
export declare enum LoadStatus {
    DRAFT = "DRAFT",
    PLANNED = "PLANNED",
    OPTIMIZED = "OPTIMIZED",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    LOADED = "LOADED",
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
/**
 * Equipment type enumeration
 */
export declare enum EquipmentType {
    DRY_VAN_53 = "DRY_VAN_53",
    DRY_VAN_48 = "DRY_VAN_48",
    REEFER_53 = "REEFER_53",
    FLATBED_48 = "FLATBED_48",
    FLATBED_53 = "FLATBED_53",
    BOX_TRUCK_24 = "BOX_TRUCK_24",
    BOX_TRUCK_26 = "BOX_TRUCK_26",
    SPRINTER_VAN = "SPRINTER_VAN",
    STRAIGHT_TRUCK = "STRAIGHT_TRUCK",
    CONTAINER_20 = "CONTAINER_20",
    CONTAINER_40 = "CONTAINER_40",
    CONTAINER_40_HC = "CONTAINER_40_HC"
}
/**
 * Load mode enumeration
 */
export declare enum LoadMode {
    LTL = "LTL",// Less Than Truckload
    FTL = "FTL",// Full Truckload
    PARCEL = "PARCEL",
    INTERMODAL = "INTERMODAL",
    DEDICATED = "DEDICATED",
    POOL = "POOL"
}
/**
 * Dock door status
 */
export declare enum DockDoorStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    OCCUPIED = "OCCUPIED",
    MAINTENANCE = "MAINTENANCE",
    CLOSED = "CLOSED"
}
/**
 * Vehicle capacity specifications
 */
export interface VehicleCapacity {
    equipmentType: EquipmentType;
    maxWeight: number;
    maxVolume: number;
    maxLength: number;
    maxWidth: number;
    maxHeight: number;
    maxPallets: number;
    temperatureControlled: boolean;
    hazmatCapable: boolean;
    liftgateRequired: boolean;
}
/**
 * Shipment unit (order, pallet, carton)
 */
export interface ShipmentUnit {
    unitId: string;
    orderId: string;
    customerId: string;
    shipToAddress: Address;
    weight: number;
    volume: number;
    palletCount: number;
    pieceCount: number;
    dimensions: Dimensions;
    stackable: boolean;
    hazmat: boolean;
    temperatureControlled: boolean;
    specialHandling: string[];
    deliveryDate: Date;
    deliveryTimeWindow?: TimeWindow;
    priority: number;
    value: number;
    commodityClass?: string;
    metadata?: Record<string, any>;
}
/**
 * Address information
 */
export interface Address {
    addressId: string;
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    dockHours?: TimeWindow[];
    specialInstructions?: string;
}
/**
 * Dimensions
 */
export interface Dimensions {
    length: number;
    width: number;
    height: number;
}
/**
 * Time window
 */
export interface TimeWindow {
    start: Date;
    end: Date;
}
/**
 * Load plan
 */
export interface LoadPlan {
    loadId: string;
    loadNumber: string;
    status: LoadStatus;
    mode: LoadMode;
    equipmentType: EquipmentType;
    capacity: VehicleCapacity;
    shipmentUnits: ShipmentUnit[];
    stops: LoadStop[];
    totalWeight: number;
    totalVolume: number;
    totalPallets: number;
    totalPieces: number;
    totalValue: number;
    utilizationWeight: number;
    utilizationVolume: number;
    utilizationPallets: number;
    totalDistance: number;
    estimatedDuration: number;
    plannedDepartureTime?: Date;
    estimatedArrivalTime?: Date;
    assignedCarrier?: string;
    assignedDriver?: string;
    assignedVehicle?: string;
    cost?: number;
    revenue?: number;
    margin?: number;
    createdAt: Date;
    createdBy: string;
    metadata?: Record<string, any>;
}
/**
 * Load stop (pickup or delivery)
 */
export interface LoadStop {
    stopId: string;
    stopNumber: number;
    type: 'PICKUP' | 'DELIVERY';
    address: Address;
    shipmentUnits: string[];
    plannedArrival?: Date;
    plannedDeparture?: Date;
    actualArrival?: Date;
    actualDeparture?: Date;
    appointmentRequired: boolean;
    appointmentTime?: Date;
    distanceFromPrevious: number;
    durationFromPrevious: number;
    serviceTime: number;
    specialInstructions?: string;
    contactName?: string;
    contactPhone?: string;
}
/**
 * Dock door
 */
export interface DockDoor {
    doorId: string;
    doorNumber: string;
    status: DockDoorStatus;
    type: 'OUTBOUND' | 'INBOUND' | 'CROSS_DOCK';
    equipmentTypes: EquipmentType[];
    capabilities: string[];
    currentReservation?: DockReservation;
    schedule: DockReservation[];
}
/**
 * Dock reservation
 */
export interface DockReservation {
    reservationId: string;
    doorId: string;
    loadId: string;
    startTime: Date;
    endTime: Date;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    checkInTime?: Date;
    checkOutTime?: Date;
    loadedBy?: string;
}
/**
 * Load manifest
 */
export interface LoadManifest {
    manifestId: string;
    manifestNumber: string;
    loadId: string;
    loadNumber: string;
    generatedAt: Date;
    generatedBy: string;
    carrier: CarrierInfo;
    driver?: DriverInfo;
    vehicle?: VehicleInfo;
    origin: Address;
    stops: ManifestStop[];
    totalWeight: number;
    totalVolume: number;
    totalPieces: number;
    totalValue: number;
    hazmatPresent: boolean;
    temperatureControlled: boolean;
    specialInstructions: string[];
    documents: ManifestDocument[];
}
/**
 * Carrier information
 */
export interface CarrierInfo {
    carrierId: string;
    scac: string;
    name: string;
    mcNumber?: string;
    dotNumber?: string;
    contact: string;
    phone: string;
    email: string;
}
/**
 * Driver information
 */
export interface DriverInfo {
    driverId: string;
    name: string;
    licenseNumber: string;
    phone: string;
    email?: string;
}
/**
 * Vehicle information
 */
export interface VehicleInfo {
    vehicleId: string;
    unitNumber: string;
    equipmentType: EquipmentType;
    licensePlate: string;
    vin?: string;
    trailerNumber?: string;
}
/**
 * Manifest stop
 */
export interface ManifestStop {
    stopNumber: number;
    type: 'PICKUP' | 'DELIVERY';
    address: Address;
    appointmentTime?: Date;
    timeWindow?: TimeWindow;
    shipments: ManifestShipment[];
    specialInstructions?: string;
}
/**
 * Manifest shipment
 */
export interface ManifestShipment {
    shipmentId: string;
    orderId: string;
    customerName: string;
    referenceNumbers: string[];
    weight: number;
    pieces: number;
    pallets: number;
    description: string;
    value: number;
    hazmat: boolean;
    commodityClass?: string;
}
/**
 * Manifest document
 */
export interface ManifestDocument {
    documentId: string;
    type: 'BOL' | 'PACKING_LIST' | 'COMMERCIAL_INVOICE' | 'HAZMAT' | 'OTHER';
    name: string;
    url?: string;
    required: boolean;
}
/**
 * Route optimization parameters
 */
export interface RouteOptimizationParams {
    origin: Address;
    destinations: Address[];
    departureTime: Date;
    vehicleCapacity: VehicleCapacity;
    optimizeFor: 'DISTANCE' | 'TIME' | 'COST' | 'FUEL';
    avoidTolls: boolean;
    avoidHighways: boolean;
    trafficEnabled: boolean;
    returnToOrigin: boolean;
}
/**
 * Load consolidation result
 */
export interface LoadConsolidationResult {
    totalLoads: number;
    loads: LoadPlan[];
    unassignedUnits: ShipmentUnit[];
    totalSavings: number;
    utilizationImprovement: number;
    consolidationRate: number;
}
/**
 * Freight rate quote
 */
export interface FreightRateQuote {
    quoteId: string;
    carrierId: string;
    carrierName: string;
    mode: LoadMode;
    equipmentType: EquipmentType;
    baseRate: number;
    fuelSurcharge: number;
    accessorialCharges: AccessorialCharge[];
    totalCost: number;
    transitDays: number;
    validUntil: Date;
}
/**
 * Accessorial charge
 */
export interface AccessorialCharge {
    code: string;
    description: string;
    amount: number;
}
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
export declare function createLoadPlan(config: {
    mode: LoadMode;
    equipmentType: EquipmentType;
    createdBy: string;
    plannedDepartureTime?: Date;
}): LoadPlan;
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
export declare function addShipmentToLoad(loadPlan: LoadPlan, unit: ShipmentUnit): LoadPlan;
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
export declare function removeShipmentFromLoad(loadPlan: LoadPlan, unitId: string): LoadPlan;
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
export declare function addStopToLoad(loadPlan: LoadPlan, stop: Partial<LoadStop>): LoadPlan;
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
export declare function recalculateLoadMetrics(loadPlan: LoadPlan): LoadPlan;
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
export declare function validateLoadPlan(loadPlan: LoadPlan): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
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
export declare function cloneLoadPlan(loadPlan: LoadPlan): LoadPlan;
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
export declare function updateLoadStatus(loadPlan: LoadPlan, newStatus: LoadStatus, updatedBy: string): LoadPlan;
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
export declare function getVehicleCapacity(equipmentType: EquipmentType): VehicleCapacity;
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
export declare function validateLoadCapacity(loadPlan: LoadPlan, newUnits: ShipmentUnit[]): {
    canFit: boolean;
    reason?: string;
    weightRemaining: number;
    volumeRemaining: number;
    palletsRemaining: number;
};
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
export declare function calculateDimensionalWeight(dimensions: Dimensions, quantity?: number): number;
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
export declare function calculateOptimalEquipment(units: ShipmentUnit[]): EquipmentType;
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
export declare function calculateLoadDensity(weight: number, volume: number): number;
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
export declare function determineFreightClass(density: number, commodity?: string): string;
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
export declare function getAvailableCapacity(loadPlan: LoadPlan): {
    weightAvailable: number;
    volumeAvailable: number;
    palletsAvailable: number;
    percentageAvailable: number;
};
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
export declare function calculateLoadStability(loadPlan: LoadPlan): {
    score: number;
    issues: string[];
    recommendations: string[];
};
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
export declare function optimizeLoadBuilding(units: ShipmentUnit[], equipmentType: EquipmentType): LoadPlan[];
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
export declare function consolidateLoads(loads: LoadPlan[], minUtilization?: number): LoadConsolidationResult;
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
export declare function optimizeStopSequence(loadPlan: LoadPlan, origin: Address): LoadPlan;
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
export declare function balanceLoadsAcrossVehicles(units: ShipmentUnit[], vehicleCount: number, equipmentType: EquipmentType): LoadPlan[];
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
export declare function generateLoadAlternatives(units: ShipmentUnit[], equipmentTypes: EquipmentType[]): LoadPlan[][];
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
export declare function scoreLoadPlan(loadPlan: LoadPlan, weights?: {
    utilization?: number;
    distance?: number;
    stops?: number;
    stability?: number;
}): number;
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
export declare function mergeCompatibleLoads(loads: LoadPlan[]): LoadPlan[];
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
export declare function optimizeLoadForPriority(loadPlan: LoadPlan, priority: 'COST' | 'SPEED'): LoadPlan;
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
export declare function createDockReservation(door: DockDoor, loadPlan: LoadPlan, timeWindow: TimeWindow): DockReservation;
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
export declare function findAvailableDockDoors(doors: DockDoor[], timeWindow: TimeWindow, equipmentType: EquipmentType): DockDoor[];
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
export declare function optimizeDockAssignments(loads: LoadPlan[], doors: DockDoor[]): Map<string, DockReservation>;
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
export declare function estimateLoadingTime(loadPlan: LoadPlan): number;
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
export declare function validateDockAvailability(door: DockDoor, timeWindow: TimeWindow): {
    available: boolean;
    conflicts: DockReservation[];
    nextAvailable?: Date;
};
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
export declare function checkInLoadAtDock(reservation: DockReservation, loadedBy: string): DockReservation;
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
export declare function checkOutLoadFromDock(reservation: DockReservation): DockReservation;
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
export declare function generateDockUtilizationReport(doors: DockDoor[], period: TimeWindow): {
    totalDoors: number;
    totalReservations: number;
    averageUtilization: number;
    peakUtilization: number;
    doorUtilization: Array<{
        doorId: string;
        doorNumber: string;
        reservations: number;
        utilization: number;
    }>;
};
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
export declare function generateLoadManifest(loadPlan: LoadPlan, carrier: CarrierInfo, origin: Address): LoadManifest;
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
export declare function generateBillOfLading(manifest: LoadManifest, bolNumber: string): {
    bolNumber: string;
    shipper: Address;
    consignee: Address;
    carrier: CarrierInfo;
    shipmentDetails: {
        weight: number;
        pieces: number;
        pallets: number;
        commodityDescription: string;
        hazmat: boolean;
    };
    charges: {
        freight: number;
        fuelSurcharge: number;
        accessorials: number;
        total: number;
    };
    specialInstructions: string[];
    generatedAt: Date;
};
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
export declare function generatePackingList(manifest: LoadManifest): {
    manifestNumber: string;
    generatedAt: Date;
    items: Array<{
        stopNumber: number;
        orderId: string;
        customerName: string;
        pieces: number;
        pallets: number;
        weight: number;
        description: string;
    }>;
    totals: {
        totalPieces: number;
        totalPallets: number;
        totalWeight: number;
    };
};
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
export declare function generateRouteSheet(manifest: LoadManifest): {
    loadNumber: string;
    driver?: DriverInfo;
    vehicle?: VehicleInfo;
    origin: Address;
    stops: Array<{
        stopNumber: number;
        type: string;
        address: Address;
        appointmentTime?: Date;
        deliveryCount: number;
        specialInstructions?: string;
        distanceFromPrevious: number;
    }>;
    totalDistance: number;
    estimatedDuration: number;
    specialInstructions: string[];
};
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
export declare function validateManifest(manifest: LoadManifest): {
    valid: boolean;
    missingFields: string[];
    warnings: string[];
};
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
export declare function exportManifestToPDF(manifest: LoadManifest): {
    title: string;
    metadata: Record<string, any>;
    content: string[];
};
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
export declare function generateCarrierTender(loadPlan: LoadPlan, carrier: CarrierInfo, rateQuote: FreightRateQuote): {
    tenderId: string;
    loadId: string;
    loadNumber: string;
    carrier: CarrierInfo;
    rateQuote: FreightRateQuote;
    pickupDate: Date;
    deliveryDate: Date;
    equipmentType: EquipmentType;
    origin: Address;
    destination: Address;
    totalWeight: number;
    totalPallets: number;
    specialRequirements: string[];
    responseDeadline: Date;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    createdAt: Date;
};
declare const _default: {
    createLoadPlan: typeof createLoadPlan;
    addShipmentToLoad: typeof addShipmentToLoad;
    removeShipmentFromLoad: typeof removeShipmentFromLoad;
    addStopToLoad: typeof addStopToLoad;
    recalculateLoadMetrics: typeof recalculateLoadMetrics;
    validateLoadPlan: typeof validateLoadPlan;
    cloneLoadPlan: typeof cloneLoadPlan;
    updateLoadStatus: typeof updateLoadStatus;
    getVehicleCapacity: typeof getVehicleCapacity;
    validateLoadCapacity: typeof validateLoadCapacity;
    calculateDimensionalWeight: typeof calculateDimensionalWeight;
    calculateOptimalEquipment: typeof calculateOptimalEquipment;
    calculateLoadDensity: typeof calculateLoadDensity;
    determineFreightClass: typeof determineFreightClass;
    getAvailableCapacity: typeof getAvailableCapacity;
    calculateLoadStability: typeof calculateLoadStability;
    optimizeLoadBuilding: typeof optimizeLoadBuilding;
    consolidateLoads: typeof consolidateLoads;
    optimizeStopSequence: typeof optimizeStopSequence;
    balanceLoadsAcrossVehicles: typeof balanceLoadsAcrossVehicles;
    generateLoadAlternatives: typeof generateLoadAlternatives;
    scoreLoadPlan: typeof scoreLoadPlan;
    mergeCompatibleLoads: typeof mergeCompatibleLoads;
    optimizeLoadForPriority: typeof optimizeLoadForPriority;
    createDockReservation: typeof createDockReservation;
    findAvailableDockDoors: typeof findAvailableDockDoors;
    optimizeDockAssignments: typeof optimizeDockAssignments;
    estimateLoadingTime: typeof estimateLoadingTime;
    validateDockAvailability: typeof validateDockAvailability;
    checkInLoadAtDock: typeof checkInLoadAtDock;
    checkOutLoadFromDock: typeof checkOutLoadFromDock;
    generateDockUtilizationReport: typeof generateDockUtilizationReport;
    generateLoadManifest: typeof generateLoadManifest;
    generateBillOfLading: typeof generateBillOfLading;
    generatePackingList: typeof generatePackingList;
    generateRouteSheet: typeof generateRouteSheet;
    validateManifest: typeof validateManifest;
    exportManifestToPDF: typeof exportManifestToPDF;
    generateCarrierTender: typeof generateCarrierTender;
};
export default _default;
//# sourceMappingURL=outbound-load-planning-kit.d.ts.map