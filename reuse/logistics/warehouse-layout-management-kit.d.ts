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
/**
 * Warehouse type enumeration
 */
export declare enum WarehouseType {
    DC = "DC",// Distribution Center
    FC = "FC",// Fulfillment Center
    CROSS_DOCK = "CROSS_DOCK",
    COLD_STORAGE = "COLD_STORAGE",
    HAZMAT = "HAZMAT"
}
/**
 * Warehouse status
 */
export declare enum WarehouseStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    MAINTENANCE = "MAINTENANCE"
}
/**
 * Zone type enumeration
 */
export declare enum ZoneType {
    RECEIVING = "RECEIVING",
    STORAGE = "STORAGE",
    PICKING = "PICKING",
    PACKING = "PACKING",
    SHIPPING = "SHIPPING",
    STAGING = "STAGING",
    RETURNS = "RETURNS",
    QUARANTINE = "QUARANTINE"
}
/**
 * Temperature control requirements
 */
export declare enum TemperatureZone {
    AMBIENT = "AMBIENT",
    REFRIGERATED = "REFRIGERATED",
    FROZEN = "FROZEN",
    CONTROLLED = "CONTROLLED"
}
/**
 * Zone status
 */
export declare enum ZoneStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    FULL = "FULL",
    MAINTENANCE = "MAINTENANCE"
}
/**
 * Location type in hierarchy
 */
export declare enum LocationType {
    AISLE = "AISLE",
    BAY = "BAY",
    LEVEL = "LEVEL",
    BIN = "BIN",
    PALLET = "PALLET",
    SHELF = "SHELF",
    FLOOR = "FLOOR"
}
/**
 * Storage type/configuration
 */
export declare enum StorageType {
    PALLET_RACK = "PALLET_RACK",
    DRIVE_IN = "DRIVE_IN",
    PUSH_BACK = "PUSH_BACK",
    CANTILEVER = "CANTILEVER",
    FLOW_RACK = "FLOW_RACK",
    SHELF = "SHELF",
    FLOOR_STACK = "FLOOR_STACK",
    MEZZANINE = "MEZZANINE"
}
/**
 * Location status
 */
export declare enum LocationStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    RESERVED = "RESERVED",
    DAMAGED = "DAMAGED",
    BLOCKED = "BLOCKED",
    MAINTENANCE = "MAINTENANCE"
}
/**
 * Velocity rating for ABC analysis
 */
export declare enum VelocityRating {
    A = "A",// Fast moving
    B = "B",// Medium moving
    C = "C",// Slow moving
    D = "D"
}
/**
 * Assignment type
 */
export declare enum AssignmentType {
    PRIMARY = "PRIMARY",
    OVERFLOW = "OVERFLOW",
    TEMPORARY = "TEMPORARY",
    PICK_FACE = "PICK_FACE",
    RESERVE = "RESERVE"
}
/**
 * Slotting rule type
 */
export declare enum SlottingRuleType {
    VELOCITY_BASED = "VELOCITY_BASED",
    ABC_ANALYSIS = "ABC_ANALYSIS",
    SIZE_BASED = "SIZE_BASED",
    WEIGHT_BASED = "WEIGHT_BASED",
    AFFINITY = "AFFINITY",
    SEASONAL = "SEASONAL",
    CUSTOM = "CUSTOM"
}
/**
 * Warehouse master data
 */
export interface Warehouse {
    id: string;
    warehouseCode: string;
    name: string;
    type: WarehouseType;
    status: WarehouseStatus;
    totalArea?: number;
    usableArea?: number;
    address?: WarehouseAddress;
    operatingHours?: OperatingHours;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Warehouse address
 */
export interface WarehouseAddress {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}
/**
 * Operating hours
 */
export interface OperatingHours {
    timezone: string;
    schedule: {
        [key: string]: {
            open: string;
            close: string;
            closed?: boolean;
        };
    };
}
/**
 * Warehouse zone
 */
export interface WarehouseZone {
    id: string;
    warehouseId: string;
    zoneCode: string;
    name: string;
    zoneType: ZoneType;
    temperature: TemperatureZone;
    status: ZoneStatus;
    totalLocations: number;
    occupiedLocations: number;
    totalCapacity?: number;
    usedCapacity: number;
    pickPriority: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Storage location
 */
export interface StorageLocation {
    id: string;
    warehouseId: string;
    zoneId: string;
    locationCode: string;
    parentLocationId?: string;
    locationType: LocationType;
    storageType: StorageType;
    status: LocationStatus;
    coordinates?: {
        x?: number;
        y?: number;
        z?: number;
    };
    address?: {
        aisle?: string;
        bay?: string;
        level?: string;
        position?: string;
    };
    capacity: {
        weight?: number;
        volume?: number;
        units?: number;
    };
    used: {
        weight: number;
        volume: number;
        units: number;
    };
    pickingSequence?: number;
    velocityRating?: VelocityRating;
    allowMixedItems: boolean;
    allowMixedLots: boolean;
    requiresLicensePlate: boolean;
    dimensions?: LocationDimensions;
    restrictions?: LocationRestrictions;
    metadata?: Record<string, any>;
    lastInventoryDate?: Date;
    lastPickDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Location dimensions
 */
export interface LocationDimensions {
    length: number;
    width: number;
    height: number;
    unit: 'IN' | 'CM' | 'M';
}
/**
 * Location restrictions
 */
export interface LocationRestrictions {
    allowedProductCategories?: string[];
    blockedProductCategories?: string[];
    allowedProductIds?: string[];
    blockedProductIds?: string[];
    maxWeight?: number;
    maxVolume?: number;
    hazmatOnly?: boolean;
    temperatureRange?: {
        min: number;
        max: number;
    };
}
/**
 * Location assignment
 */
export interface LocationAssignment {
    id: string;
    locationId: string;
    productId: string;
    lotNumber?: string;
    licensePlateId?: string;
    quantity: number;
    quantityUom: string;
    weight?: number;
    volume?: number;
    assignmentType: AssignmentType;
    allocatedQuantity: number;
    receivedDate?: Date;
    expiryDate?: Date;
    lastPickDate?: Date;
    pickCount: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Slotting rule
 */
export interface SlottingRule {
    id: string;
    warehouseId: string;
    ruleName: string;
    ruleType: SlottingRuleType;
    priority: number;
    status: 'ACTIVE' | 'INACTIVE';
    conditions: SlottingConditions;
    actions: SlottingActions;
    validFrom?: Date;
    validTo?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Slotting rule conditions
 */
export interface SlottingConditions {
    velocityClass?: VelocityRating[];
    productCategories?: string[];
    productAttributes?: Record<string, any>;
    minTurnoverRate?: number;
    maxTurnoverRate?: number;
    seasonalPeriod?: {
        startMonth: number;
        endMonth: number;
    };
    customConditions?: Record<string, any>;
}
/**
 * Slotting rule actions
 */
export interface SlottingActions {
    targetZones?: string[];
    targetLocationType?: LocationType[];
    targetStorageType?: StorageType[];
    pickingSequenceRange?: {
        min: number;
        max: number;
    };
    replenishmentStrategy?: 'MIN_MAX' | 'FIFO' | 'LIFO' | 'FEFO';
    customActions?: Record<string, any>;
}
/**
 * Location metrics
 */
export interface LocationMetrics {
    id: string;
    locationId: string;
    metricDate: Date;
    pickCount: number;
    replenishmentCount: number;
    avgUtilization?: number;
    emptyTime: number;
    turnoverRate?: number;
    accessTime?: number;
    accuracy?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Slotting recommendation
 */
export interface SlottingRecommendation {
    productId: string;
    currentLocationId?: string;
    recommendedLocationId: string;
    recommendedZoneId: string;
    reason: string;
    priority: number;
    estimatedImprovement: {
        pickTimeReduction?: number;
        travelDistanceReduction?: number;
        utilizationImprovement?: number;
    };
    metadata?: Record<string, any>;
}
/**
 * Zone capacity analysis
 */
export interface ZoneCapacityAnalysis {
    zoneId: string;
    zoneCode: string;
    zoneName: string;
    totalLocations: number;
    availableLocations: number;
    occupiedLocations: number;
    utilizationRate: number;
    capacityRemaining: {
        weight?: number;
        volume?: number;
        units?: number;
    };
    projectedFullDate?: Date;
    recommendations: string[];
}
/**
 * Pick path optimization result
 */
export interface PickPathOptimization {
    warehouseId: string;
    zoneId: string;
    optimizedSequence: {
        locationId: string;
        locationCode: string;
        sequence: number;
        distance: number;
        estimatedTime: number;
    }[];
    totalDistance: number;
    totalTime: number;
    strategy: 'S_SHAPE' | 'RETURN' | 'MIDPOINT' | 'LARGEST_GAP' | 'COMPOSITE';
}
/**
 * Location hierarchy view
 */
export interface LocationHierarchy {
    locationId: string;
    locationCode: string;
    locationType: LocationType;
    level: number;
    parentLocationId?: string;
    children: LocationHierarchy[];
    metadata?: Record<string, any>;
}
/**
 * Capacity utilization report
 */
export interface CapacityUtilizationReport {
    warehouseId: string;
    reportDate: Date;
    overall: {
        totalCapacity: number;
        usedCapacity: number;
        utilizationRate: number;
    };
    byZone: {
        zoneId: string;
        zoneCode: string;
        utilizationRate: number;
    }[];
    byVelocity: {
        velocityRating: VelocityRating;
        utilizationRate: number;
    }[];
    recommendations: string[];
}
/**
 * Function 1: Create a new warehouse zone
 *
 * @param warehouseId - Warehouse identifier
 * @param zoneData - Zone creation data
 * @returns Created warehouse zone
 */
export declare function createWarehouseZone(warehouseId: string, zoneData: {
    zoneCode: string;
    name: string;
    zoneType: ZoneType;
    temperature?: TemperatureZone;
    totalCapacity?: number;
    pickPriority?: number;
    metadata?: Record<string, any>;
}): WarehouseZone;
/**
 * Function 2: Update zone capacity metrics
 *
 * @param zone - Warehouse zone to update
 * @param capacityChange - Change in capacity usage
 * @returns Updated zone
 */
export declare function updateZoneCapacity(zone: WarehouseZone, capacityChange: {
    usedCapacityDelta: number;
    locationCountDelta?: number;
}): WarehouseZone;
/**
 * Function 3: Calculate zone utilization rate
 *
 * @param zone - Warehouse zone
 * @returns Utilization metrics
 */
export declare function calculateZoneUtilization(zone: WarehouseZone): {
    locationUtilization: number;
    capacityUtilization: number;
    isNearCapacity: boolean;
    isOverCapacity: boolean;
};
/**
 * Function 4: Get zones by type and status
 *
 * @param zones - Array of zones to filter
 * @param filters - Filter criteria
 * @returns Filtered zones
 */
export declare function filterZonesByTypeAndStatus(zones: WarehouseZone[], filters: {
    zoneTypes?: ZoneType[];
    statuses?: ZoneStatus[];
    temperatures?: TemperatureZone[];
    minUtilization?: number;
    maxUtilization?: number;
}): WarehouseZone[];
/**
 * Function 5: Sort zones by pick priority
 *
 * @param zones - Array of zones to sort
 * @param direction - Sort direction
 * @returns Sorted zones
 */
export declare function sortZonesByPickPriority(zones: WarehouseZone[], direction?: 'ASC' | 'DESC'): WarehouseZone[];
/**
 * Function 6: Identify zones requiring attention
 *
 * @param zones - Array of zones to analyze
 * @returns Zones with issues and recommendations
 */
export declare function identifyZonesRequiringAttention(zones: WarehouseZone[]): {
    zone: WarehouseZone;
    issues: string[];
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}[];
/**
 * Function 7: Calculate optimal zone allocation for new product
 *
 * @param zones - Available zones
 * @param productData - Product characteristics
 * @returns Recommended zone
 */
export declare function calculateOptimalZoneAllocation(zones: WarehouseZone[], productData: {
    temperatureRequirement: TemperatureZone;
    velocity: VelocityRating;
    requiredCapacity: number;
    productCategory?: string;
}): WarehouseZone | null;
/**
 * Function 8: Generate zone capacity analysis
 *
 * @param zone - Zone to analyze
 * @param locations - Locations in the zone
 * @returns Capacity analysis
 */
export declare function generateZoneCapacityAnalysis(zone: WarehouseZone, locations: StorageLocation[]): ZoneCapacityAnalysis;
/**
 * Function 9: Rebalance zones based on current utilization
 *
 * @param zones - Zones to rebalance
 * @returns Rebalancing recommendations
 */
export declare function generateZoneRebalancingPlan(zones: WarehouseZone[]): {
    sourceZoneId: string;
    targetZoneId: string;
    recommendedTransferCapacity: number;
    reason: string;
}[];
/**
 * Function 10: Create a storage location
 *
 * @param locationData - Location creation data
 * @returns Created storage location
 */
export declare function createStorageLocation(locationData: {
    warehouseId: string;
    zoneId: string;
    locationCode: string;
    parentLocationId?: string;
    locationType: LocationType;
    storageType: StorageType;
    coordinates?: {
        x?: number;
        y?: number;
        z?: number;
    };
    address?: {
        aisle?: string;
        bay?: string;
        level?: string;
        position?: string;
    };
    capacity?: {
        weight?: number;
        volume?: number;
        units?: number;
    };
    allowMixedItems?: boolean;
    allowMixedLots?: boolean;
    requiresLicensePlate?: boolean;
    dimensions?: LocationDimensions;
    restrictions?: LocationRestrictions;
    metadata?: Record<string, any>;
}): StorageLocation;
/**
 * Function 11: Build location hierarchy tree
 *
 * @param locations - All locations
 * @param rootLocationId - Starting point (null for top level)
 * @returns Hierarchical tree structure
 */
export declare function buildLocationHierarchy(locations: StorageLocation[], rootLocationId?: string | null): LocationHierarchy[];
/**
 * Function 12: Get all child locations recursively
 *
 * @param locations - All locations
 * @param parentLocationId - Parent location ID
 * @returns All descendant locations
 */
export declare function getAllChildLocations(locations: StorageLocation[], parentLocationId: string): StorageLocation[];
/**
 * Function 13: Get location path from root to location
 *
 * @param locations - All locations
 * @param locationId - Target location
 * @returns Path from root to location
 */
export declare function getLocationPath(locations: StorageLocation[], locationId: string): StorageLocation[];
/**
 * Function 14: Generate location code from hierarchy
 *
 * @param address - Location address components
 * @param format - Code format pattern
 * @returns Generated location code
 */
export declare function generateLocationCode(address: {
    aisle?: string;
    bay?: string;
    level?: string;
    position?: string;
}, format?: 'AABBLLPP' | 'A-BB-LL-PP' | 'CUSTOM'): string;
/**
 * Function 15: Parse location code into components
 *
 * @param locationCode - Location code to parse
 * @param format - Code format pattern
 * @returns Parsed address components
 */
export declare function parseLocationCode(locationCode: string, format?: 'AABBLLPP' | 'A-BB-LL-PP'): {
    aisle?: string;
    bay?: string;
    level?: string;
    position?: string;
} | null;
/**
 * Function 16: Find available locations by criteria
 *
 * @param locations - All locations
 * @param criteria - Search criteria
 * @returns Matching available locations
 */
export declare function findAvailableLocations(locations: StorageLocation[], criteria: {
    zoneId?: string;
    locationType?: LocationType[];
    storageType?: StorageType[];
    minCapacity?: {
        weight?: number;
        volume?: number;
        units?: number;
    };
    allowMixedItems?: boolean;
    velocityRating?: VelocityRating[];
}): StorageLocation[];
/**
 * Function 17: Validate location hierarchy integrity
 *
 * @param locations - All locations
 * @returns Validation results with issues
 */
export declare function validateLocationHierarchy(locations: StorageLocation[]): {
    isValid: boolean;
    issues: {
        locationId: string;
        locationCode: string;
        issue: string;
    }[];
};
/**
 * Function 18: Update location capacity
 *
 * @param location - Location to update
 * @param usageChange - Change in usage
 * @returns Updated location
 */
export declare function updateLocationCapacity(location: StorageLocation, usageChange: {
    weightDelta?: number;
    volumeDelta?: number;
    unitsDelta?: number;
}): StorageLocation;
/**
 * Function 19: Calculate location utilization
 *
 * @param location - Location to analyze
 * @returns Utilization percentages
 */
export declare function calculateLocationUtilization(location: StorageLocation): {
    weightUtilization?: number;
    volumeUtilization?: number;
    unitsUtilization?: number;
    overallUtilization: number;
    isAtCapacity: boolean;
    isOverCapacity: boolean;
};
/**
 * Function 20: Check if location can accommodate item
 *
 * @param location - Location to check
 * @param itemRequirements - Item requirements
 * @returns Whether location can accommodate item
 */
export declare function canLocationAccommodateItem(location: StorageLocation, itemRequirements: {
    weight?: number;
    volume?: number;
    units?: number;
    productId?: string;
    productCategory?: string;
    requiresTemperature?: TemperatureZone;
    isHazmat?: boolean;
}): {
    canAccommodate: boolean;
    reasons: string[];
};
/**
 * Function 21: Set location velocity rating
 *
 * @param location - Location to update
 * @param velocityRating - New velocity rating
 * @returns Updated location
 */
export declare function setLocationVelocityRating(location: StorageLocation, velocityRating: VelocityRating): StorageLocation;
/**
 * Function 22: Update location picking sequence
 *
 * @param location - Location to update
 * @param pickingSequence - New picking sequence number
 * @returns Updated location
 */
export declare function updateLocationPickingSequence(location: StorageLocation, pickingSequence: number): StorageLocation;
/**
 * Function 23: Add location restriction
 *
 * @param location - Location to update
 * @param restriction - Restriction to add
 * @returns Updated location
 */
export declare function addLocationRestriction(location: StorageLocation, restriction: {
    type: 'ALLOWED_PRODUCT' | 'BLOCKED_PRODUCT' | 'ALLOWED_CATEGORY' | 'BLOCKED_CATEGORY' | 'MAX_WEIGHT' | 'MAX_VOLUME' | 'HAZMAT_ONLY';
    value: any;
}): StorageLocation;
/**
 * Function 24: Remove location restriction
 *
 * @param location - Location to update
 * @param restriction - Restriction to remove
 * @returns Updated location
 */
export declare function removeLocationRestriction(location: StorageLocation, restriction: {
    type: 'ALLOWED_PRODUCT' | 'BLOCKED_PRODUCT' | 'ALLOWED_CATEGORY' | 'BLOCKED_CATEGORY' | 'MAX_WEIGHT' | 'MAX_VOLUME' | 'HAZMAT_ONLY';
    value?: any;
}): StorageLocation;
/**
 * Function 25: Update location status
 *
 * @param location - Location to update
 * @param newStatus - New status
 * @param reason - Reason for status change
 * @returns Updated location
 */
export declare function updateLocationStatus(location: StorageLocation, newStatus: LocationStatus, reason?: string): StorageLocation;
/**
 * Function 26: Calculate location dimensions volume
 *
 * @param dimensions - Location dimensions
 * @returns Volume in cubic units
 */
export declare function calculateLocationVolume(dimensions: LocationDimensions): number;
/**
 * Function 27: Create slotting rule
 *
 * @param ruleData - Rule creation data
 * @returns Created slotting rule
 */
export declare function createSlottingRule(ruleData: {
    warehouseId: string;
    ruleName: string;
    ruleType: SlottingRuleType;
    priority?: number;
    conditions: SlottingConditions;
    actions: SlottingActions;
    validFrom?: Date;
    validTo?: Date;
    metadata?: Record<string, any>;
}): SlottingRule;
/**
 * Function 28: Evaluate slotting rules for product
 *
 * @param rules - Active slotting rules
 * @param productData - Product characteristics
 * @returns Matching rules sorted by priority
 */
export declare function evaluateSlottingRules(rules: SlottingRule[], productData: {
    velocityClass?: VelocityRating;
    productCategory?: string;
    productAttributes?: Record<string, any>;
    turnoverRate?: number;
}): SlottingRule[];
/**
 * Function 29: Generate ABC classification for products
 *
 * @param productMetrics - Product sales/movement data
 * @returns Products with ABC classification
 */
export declare function generateABCClassification(productMetrics: {
    productId: string;
    revenue?: number;
    quantity?: number;
    pickCount?: number;
}[]): {
    productId: string;
    classification: VelocityRating;
    percentile: number;
    value: number;
}[];
/**
 * Function 30: Calculate optimal slotting based on velocity
 *
 * @param products - Products with velocity ratings
 * @param locations - Available locations
 * @returns Slotting recommendations
 */
export declare function calculateVelocityBasedSlotting(products: {
    productId: string;
    velocityRating: VelocityRating;
    currentLocationId?: string;
}[], locations: StorageLocation[]): SlottingRecommendation[];
/**
 * Function 31: Calculate affinity-based slotting
 *
 * @param orderData - Historical order line data
 * @param threshold - Minimum affinity score (0-1)
 * @returns Product pairs with high affinity
 */
export declare function calculateProductAffinity(orderData: {
    orderId: string;
    productIds: string[];
}[], threshold?: number): {
    productA: string;
    productB: string;
    affinityScore: number;
    coOccurrences: number;
}[];
/**
 * Function 32: Optimize pick path for zone
 *
 * @param locations - Locations to pick from
 * @param strategy - Picking strategy
 * @returns Optimized pick sequence
 */
export declare function optimizePickPath(locations: StorageLocation[], strategy?: 'S_SHAPE' | 'RETURN' | 'MIDPOINT' | 'LARGEST_GAP' | 'COMPOSITE'): PickPathOptimization;
/**
 * Function 33: Generate seasonal slotting recommendations
 *
 * @param products - Products with seasonal data
 * @param currentMonth - Current month (1-12)
 * @param locations - Available locations
 * @returns Seasonal slotting recommendations
 */
export declare function generateSeasonalSlottingRecommendations(products: {
    productId: string;
    currentLocationId?: string;
    seasonalPeak: {
        startMonth: number;
        endMonth: number;
    }[];
}[], currentMonth: number, locations: StorageLocation[]): SlottingRecommendation[];
/**
 * Function 34: Validate slotting rule configuration
 *
 * @param rule - Slotting rule to validate
 * @returns Validation result
 */
export declare function validateSlottingRule(rule: SlottingRule): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Function 35: Calculate slotting efficiency metrics
 *
 * @param assignments - Current location assignments
 * @param picks - Recent pick transactions
 * @returns Efficiency metrics
 */
export declare function calculateSlottingEfficiency(assignments: LocationAssignment[], picks: {
    productId: string;
    locationId: string;
    pickTime: number;
    travelDistance: number;
}[]): {
    avgPickTime: number;
    avgTravelDistance: number;
    velocityAlignment: number;
    utilizationRate: number;
    recommendations: string[];
};
/**
 * Function 36: Create location assignment
 *
 * @param assignmentData - Assignment creation data
 * @returns Created location assignment
 */
export declare function createLocationAssignment(assignmentData: {
    locationId: string;
    productId: string;
    lotNumber?: string;
    licensePlateId?: string;
    quantity: number;
    quantityUom: string;
    weight?: number;
    volume?: number;
    assignmentType: AssignmentType;
    receivedDate?: Date;
    expiryDate?: Date;
    metadata?: Record<string, any>;
}): LocationAssignment;
/**
 * Function 37: Update assignment quantity
 *
 * @param assignment - Assignment to update
 * @param quantityChange - Change in quantity
 * @returns Updated assignment
 */
export declare function updateAssignmentQuantity(assignment: LocationAssignment, quantityChange: {
    quantityDelta: number;
    weightDelta?: number;
    volumeDelta?: number;
    isPick?: boolean;
}): LocationAssignment;
/**
 * Function 38: Calculate available capacity by zone
 *
 * @param zones - Warehouse zones
 * @param locations - Storage locations
 * @param assignments - Current assignments
 * @returns Available capacity by zone
 */
export declare function calculateAvailableCapacityByZone(zones: WarehouseZone[], locations: StorageLocation[], assignments: LocationAssignment[]): {
    zoneId: string;
    zoneCode: string;
    totalCapacity: {
        weight: number;
        volume: number;
        units: number;
    };
    usedCapacity: {
        weight: number;
        volume: number;
        units: number;
    };
    availableCapacity: {
        weight: number;
        volume: number;
        units: number;
    };
    utilizationRate: number;
}[];
/**
 * Function 39: Find optimal location for product putaway
 *
 * @param product - Product to store
 * @param locations - Available locations
 * @param strategy - Putaway strategy
 * @returns Recommended location
 */
export declare function findOptimalPutawayLocation(product: {
    productId: string;
    quantity: number;
    weight?: number;
    volume?: number;
    velocityRating?: VelocityRating;
    productCategory?: string;
}, locations: StorageLocation[], strategy?: 'FIXED' | 'RANDOM' | 'CLOSEST' | 'FILL_RATE' | 'VELOCITY'): StorageLocation | null;
/**
 * Function 40: Generate capacity utilization report
 *
 * @param warehouse - Warehouse data
 * @param zones - Zones in warehouse
 * @param locations - All locations
 * @returns Comprehensive capacity report
 */
export declare function generateCapacityUtilizationReport(warehouse: Warehouse, zones: WarehouseZone[], locations: StorageLocation[]): CapacityUtilizationReport;
/**
 * Function 41: Allocate inventory to location
 *
 * @param assignment - Location assignment
 * @param allocationQuantity - Quantity to allocate
 * @returns Updated assignment
 */
export declare function allocateInventoryToLocation(assignment: LocationAssignment, allocationQuantity: number): LocationAssignment;
/**
 * Function 42: Release allocated inventory
 *
 * @param assignment - Location assignment
 * @param releaseQuantity - Quantity to release
 * @returns Updated assignment
 */
export declare function releaseAllocatedInventory(assignment: LocationAssignment, releaseQuantity: number): LocationAssignment;
/**
 * Function 43: Calculate location turnover rate
 *
 * @param location - Location to analyze
 * @param assignments - Historical assignments
 * @param periodDays - Analysis period in days
 * @returns Turnover metrics
 */
export declare function calculateLocationTurnoverRate(location: StorageLocation, assignments: LocationAssignment[], periodDays?: number): {
    locationId: string;
    locationCode: string;
    turnoverRate: number;
    avgPicksPerDay: number;
    avgDwellTime: number;
    emptyDays: number;
    utilizationDays: number;
};
declare const _default: {
    createWarehouseZone: typeof createWarehouseZone;
    updateZoneCapacity: typeof updateZoneCapacity;
    calculateZoneUtilization: typeof calculateZoneUtilization;
    filterZonesByTypeAndStatus: typeof filterZonesByTypeAndStatus;
    sortZonesByPickPriority: typeof sortZonesByPickPriority;
    identifyZonesRequiringAttention: typeof identifyZonesRequiringAttention;
    calculateOptimalZoneAllocation: typeof calculateOptimalZoneAllocation;
    generateZoneCapacityAnalysis: typeof generateZoneCapacityAnalysis;
    generateZoneRebalancingPlan: typeof generateZoneRebalancingPlan;
    createStorageLocation: typeof createStorageLocation;
    buildLocationHierarchy: typeof buildLocationHierarchy;
    getAllChildLocations: typeof getAllChildLocations;
    getLocationPath: typeof getLocationPath;
    generateLocationCode: typeof generateLocationCode;
    parseLocationCode: typeof parseLocationCode;
    findAvailableLocations: typeof findAvailableLocations;
    validateLocationHierarchy: typeof validateLocationHierarchy;
    updateLocationCapacity: typeof updateLocationCapacity;
    calculateLocationUtilization: typeof calculateLocationUtilization;
    canLocationAccommodateItem: typeof canLocationAccommodateItem;
    setLocationVelocityRating: typeof setLocationVelocityRating;
    updateLocationPickingSequence: typeof updateLocationPickingSequence;
    addLocationRestriction: typeof addLocationRestriction;
    removeLocationRestriction: typeof removeLocationRestriction;
    updateLocationStatus: typeof updateLocationStatus;
    calculateLocationVolume: typeof calculateLocationVolume;
    createSlottingRule: typeof createSlottingRule;
    evaluateSlottingRules: typeof evaluateSlottingRules;
    generateABCClassification: typeof generateABCClassification;
    calculateVelocityBasedSlotting: typeof calculateVelocityBasedSlotting;
    calculateProductAffinity: typeof calculateProductAffinity;
    optimizePickPath: typeof optimizePickPath;
    generateSeasonalSlottingRecommendations: typeof generateSeasonalSlottingRecommendations;
    validateSlottingRule: typeof validateSlottingRule;
    calculateSlottingEfficiency: typeof calculateSlottingEfficiency;
    createLocationAssignment: typeof createLocationAssignment;
    updateAssignmentQuantity: typeof updateAssignmentQuantity;
    calculateAvailableCapacityByZone: typeof calculateAvailableCapacityByZone;
    findOptimalPutawayLocation: typeof findOptimalPutawayLocation;
    generateCapacityUtilizationReport: typeof generateCapacityUtilizationReport;
    allocateInventoryToLocation: typeof allocateInventoryToLocation;
    releaseAllocatedInventory: typeof releaseAllocatedInventory;
    calculateLocationTurnoverRate: typeof calculateLocationTurnoverRate;
};
export default _default;
//# sourceMappingURL=warehouse-layout-management-kit.d.ts.map