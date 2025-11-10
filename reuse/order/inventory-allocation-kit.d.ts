/**
 * LOC: ORD-INVATP-001
 * File: /reuse/order/inventory-allocation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order fulfillment services
 *   - Warehouse management systems
 *   - Inventory controllers
 */
/**
 * Allocation strategy types for inventory distribution
 */
export declare enum AllocationStrategy {
    FIFO = "FIFO",// First In First Out
    LIFO = "LIFO",// Last In First Out
    FEFO = "FEFO",// First Expired First Out
    NEAREST = "NEAREST",// Nearest warehouse to customer
    LOWEST_COST = "LOWEST_COST",// Lowest shipping cost
    BALANCED = "BALANCED",// Balance inventory across warehouses
    PRIORITY = "PRIORITY",// Based on order priority
    CUSTOM = "CUSTOM"
}
/**
 * Reservation types for inventory holding
 */
export declare enum ReservationType {
    HARD = "HARD",// Committed allocation
    SOFT = "SOFT",// Tentative allocation
    PLANNED = "PLANNED",// Future planned allocation
    BACKORDER = "BACKORDER",// Backorder reservation
    TEMPORARY = "TEMPORARY"
}
/**
 * ATP calculation methods
 */
export declare enum ATPMethod {
    SIMPLE = "SIMPLE",// On-hand - allocated
    PROJECTED = "PROJECTED",// Include scheduled receipts
    CUMULATIVE = "CUMULATIVE",// Cumulative ATP over time
    DISCRETE = "DISCRETE",// Discrete ATP per period
    MULTI_LEVEL = "MULTI_LEVEL"
}
/**
 * Allocation priority levels
 */
export declare enum AllocationPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    NORMAL = "NORMAL",
    LOW = "LOW",
    BACKORDER = "BACKORDER"
}
/**
 * Allocation status tracking
 */
export declare enum AllocationStatus {
    PENDING = "PENDING",
    ALLOCATED = "ALLOCATED",
    PARTIALLY_ALLOCATED = "PARTIALLY_ALLOCATED",
    RESERVED = "RESERVED",
    RELEASED = "RELEASED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
/**
 * Warehouse fulfillment capabilities
 */
export declare enum WarehouseCapability {
    STANDARD = "STANDARD",
    EXPEDITED = "EXPEDITED",
    DROPSHIP = "DROPSHIP",
    STORE_PICKUP = "STORE_PICKUP",
    SAME_DAY = "SAME_DAY",
    HAZMAT = "HAZMAT",
    REFRIGERATED = "REFRIGERATED",
    OVERSIZED = "OVERSIZED"
}
/**
 * Available-to-Promise result with time-phased availability
 */
export interface ATPResult {
    itemId: string;
    warehouseId: string;
    atpQuantity: number;
    onHandQuantity: number;
    allocatedQuantity: number;
    reservedQuantity: number;
    inTransitQuantity: number;
    backorderQuantity: number;
    projectedAvailability: ProjectedAvailability[];
    safetyStockLevel: number;
    reorderPoint: number;
    leadTimeDays: number;
    calculationTimestamp: Date;
    method: ATPMethod;
}
/**
 * Time-phased projected availability
 */
export interface ProjectedAvailability {
    date: Date;
    projectedQuantity: number;
    scheduledReceipts: number;
    scheduledDemand: number;
    cumulativeATP: number;
}
/**
 * Inventory reservation record
 */
export interface InventoryReservation {
    reservationId: string;
    itemId: string;
    warehouseId: string;
    quantity: number;
    reservedQuantity: number;
    allocatedQuantity: number;
    type: ReservationType;
    priority: AllocationPriority;
    orderId?: string;
    orderLineId?: string;
    customerId?: string;
    expirationDate?: Date;
    createdDate: Date;
    createdBy: string;
    status: AllocationStatus;
    metadata?: Record<string, unknown>;
}
/**
 * Allocation request with requirements
 */
export interface AllocationRequest {
    requestId: string;
    itemId: string;
    requestedQuantity: number;
    orderId: string;
    orderLineId: string;
    customerId: string;
    customerLocation?: GeoLocation;
    priority: AllocationPriority;
    requiredDate: Date;
    strategy: AllocationStrategy;
    allowPartialAllocation: boolean;
    allowSubstitutes: boolean;
    allowCrossWarehouse: boolean;
    maxWarehouses?: number;
    requiredCapabilities?: WarehouseCapability[];
    metadata?: Record<string, unknown>;
}
/**
 * Allocation result with warehouse assignments
 */
export interface AllocationResult {
    requestId: string;
    status: AllocationStatus;
    allocations: WarehouseAllocation[];
    totalAllocated: number;
    totalRequested: number;
    fulfillmentPercentage: number;
    shortQuantity: number;
    substitutions?: ItemSubstitution[];
    estimatedShipDate?: Date;
    estimatedDeliveryDate?: Date;
    totalCost?: number;
    processingTime: number;
}
/**
 * Individual warehouse allocation
 */
export interface WarehouseAllocation {
    warehouseId: string;
    warehouseName: string;
    itemId: string;
    allocatedQuantity: number;
    reservationId: string;
    location?: GeoLocation;
    distance?: number;
    shippingCost?: number;
    estimatedShipDate?: Date;
    estimatedDeliveryDate?: Date;
    lotNumbers?: string[];
    serialNumbers?: string[];
    expirationDates?: Date[];
}
/**
 * Item substitution option
 */
export interface ItemSubstitution {
    originalItemId: string;
    substituteItemId: string;
    substituteDescription: string;
    quantity: number;
    substitutionReason: string;
    priceAdjustment: number;
    requiresApproval: boolean;
}
/**
 * Geographic location for distance calculations
 */
export interface GeoLocation {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}
/**
 * Warehouse inventory snapshot
 */
export interface WarehouseInventory {
    warehouseId: string;
    warehouseName: string;
    itemId: string;
    onHandQuantity: number;
    availableQuantity: number;
    allocatedQuantity: number;
    reservedQuantity: number;
    inTransitQuantity: number;
    safetyStock: number;
    reorderPoint: number;
    maxStock?: number;
    location?: GeoLocation;
    capabilities: WarehouseCapability[];
    costPerUnit?: number;
    leadTimeDays: number;
}
/**
 * Safety stock configuration
 */
export interface SafetyStockConfig {
    itemId: string;
    warehouseId: string;
    safetyStockQuantity: number;
    reorderPoint: number;
    reorderQuantity: number;
    leadTimeDays: number;
    demandVariability: number;
    serviceLevel: number;
    calculationMethod: 'FIXED' | 'VARIABLE' | 'STATISTICAL';
    reviewDate: Date;
}
/**
 * Allocation optimization criteria
 */
export interface OptimizationCriteria {
    minimizeShippingCost: boolean;
    minimizeWarehouses: boolean;
    minimizeDistance: boolean;
    balanceInventory: boolean;
    preferNearExpiry: boolean;
    respectPriority: boolean;
    weights?: {
        cost?: number;
        distance?: number;
        serviceLevel?: number;
        inventoryBalance?: number;
    };
}
/**
 * Reallocation request for inventory redistribution
 */
export interface ReallocationRequest {
    sourceWarehouseId: string;
    targetWarehouseId: string;
    itemId: string;
    quantity: number;
    reason: string;
    priority: AllocationPriority;
    requestedDate: Date;
    approvalRequired: boolean;
}
/**
 * Allocation expiration policy
 */
export interface AllocationExpirationPolicy {
    reservationType: ReservationType;
    expirationPeriodHours: number;
    autoRelease: boolean;
    notificationThresholdHours?: number;
    escalationRequired: boolean;
}
/**
 * Split shipment configuration
 */
export interface SplitShipmentConfig {
    allowSplitShipment: boolean;
    maxShipments: number;
    minQuantityPerShipment: number;
    additionalCostPerShipment?: number;
    preferConsolidation: boolean;
}
/**
 * Allocation analytics data
 */
export interface AllocationAnalytics {
    period: string;
    totalRequests: number;
    fullyAllocatedRequests: number;
    partiallyAllocatedRequests: number;
    failedAllocations: number;
    averageFulfillmentRate: number;
    averageAllocationTime: number;
    topAllocatedItems: Array<{
        itemId: string;
        quantity: number;
    }>;
    warehouseUtilization: Array<{
        warehouseId: string;
        utilizationRate: number;
    }>;
}
/**
 * Calculate simple ATP (Available-to-Promise) for an item
 *
 * @param itemId - Item identifier
 * @param warehouseId - Warehouse identifier
 * @param inventory - Current inventory snapshot
 * @returns ATP result with availability details
 */
export declare function calculateSimpleATP(itemId: string, warehouseId: string, inventory: WarehouseInventory): Promise<ATPResult>;
/**
 * Calculate projected ATP with scheduled receipts and demand
 *
 * @param itemId - Item identifier
 * @param warehouseId - Warehouse identifier
 * @param inventory - Current inventory snapshot
 * @param scheduledReceipts - Future scheduled receipts
 * @param scheduledDemand - Future scheduled demand
 * @param horizonDays - Planning horizon in days
 * @returns ATP result with time-phased projections
 */
export declare function calculateProjectedATP(itemId: string, warehouseId: string, inventory: WarehouseInventory, scheduledReceipts: Array<{
    date: Date;
    quantity: number;
}>, scheduledDemand: Array<{
    date: Date;
    quantity: number;
}>, horizonDays?: number): Promise<ATPResult>;
/**
 * Calculate cumulative ATP across time periods
 *
 * @param itemId - Item identifier
 * @param warehouseId - Warehouse identifier
 * @param projectedData - Time-phased projected availability data
 * @returns ATP result with cumulative calculations
 */
export declare function calculateCumulativeATP(itemId: string, warehouseId: string, projectedData: ProjectedAvailability[]): ATPResult;
/**
 * Calculate multi-warehouse ATP aggregation
 *
 * @param itemId - Item identifier
 * @param warehouseInventories - Inventory across multiple warehouses
 * @returns Aggregated ATP result across all warehouses
 */
export declare function calculateMultiWarehouseATP(itemId: string, warehouseInventories: WarehouseInventory[]): Promise<ATPResult>;
/**
 * Create a soft reservation for inventory
 *
 * @param request - Allocation request details
 * @param warehouseId - Warehouse to reserve from
 * @param quantity - Quantity to reserve
 * @param expirationHours - Reservation expiration in hours
 * @returns Created reservation record
 */
export declare function createSoftReservation(request: AllocationRequest, warehouseId: string, quantity: number, expirationHours?: number): Promise<InventoryReservation>;
/**
 * Create a hard reservation (committed allocation)
 *
 * @param request - Allocation request details
 * @param warehouseId - Warehouse to allocate from
 * @param quantity - Quantity to allocate
 * @returns Created hard reservation record
 */
export declare function createHardReservation(request: AllocationRequest, warehouseId: string, quantity: number): Promise<InventoryReservation>;
/**
 * Convert soft reservation to hard allocation
 *
 * @param reservation - Existing soft reservation
 * @returns Updated reservation as hard allocation
 */
export declare function convertToHardAllocation(reservation: InventoryReservation): Promise<InventoryReservation>;
/**
 * Release inventory reservation
 *
 * @param reservationId - Reservation identifier to release
 * @param releaseReason - Reason for release
 * @returns Updated reservation with released status
 */
export declare function releaseReservation(reservationId: string, releaseReason: string): Promise<InventoryReservation>;
/**
 * Extend reservation expiration time
 *
 * @param reservationId - Reservation identifier
 * @param additionalHours - Additional hours to extend
 * @returns Updated reservation with new expiration
 */
export declare function extendReservationExpiration(reservationId: string, additionalHours: number): Promise<InventoryReservation>;
/**
 * Allocate inventory from single warehouse
 *
 * @param request - Allocation request
 * @param inventory - Warehouse inventory snapshot
 * @returns Allocation result
 */
export declare function allocateFromSingleWarehouse(request: AllocationRequest, inventory: WarehouseInventory): Promise<AllocationResult>;
/**
 * Allocate inventory from multiple warehouses
 *
 * @param request - Allocation request
 * @param inventories - Available warehouse inventories
 * @returns Allocation result with multi-warehouse assignments
 */
export declare function allocateFromMultipleWarehouses(request: AllocationRequest, inventories: WarehouseInventory[]): Promise<AllocationResult>;
/**
 * Allocate with backorder creation for shortages
 *
 * @param request - Allocation request
 * @param inventories - Available inventories
 * @returns Allocation result with backorder details
 */
export declare function allocateWithBackorder(request: AllocationRequest, inventories: WarehouseInventory[]): Promise<AllocationResult>;
/**
 * Batch allocate multiple items/orders efficiently
 *
 * @param requests - Array of allocation requests
 * @param inventoryMap - Map of item inventories by itemId
 * @returns Array of allocation results
 */
export declare function batchAllocateInventory(requests: AllocationRequest[], inventoryMap: Map<string, WarehouseInventory[]>): Promise<AllocationResult[]>;
/**
 * Prioritize allocation requests based on business rules
 *
 * @param requests - Array of allocation requests
 * @param rules - Prioritization rules configuration
 * @returns Sorted allocation requests by priority
 */
export declare function prioritizeAllocationRequests(requests: AllocationRequest[], rules?: {
    considerCustomerTier?: boolean;
    considerOrderValue?: boolean;
    considerRequiredDate?: boolean;
    considerItemCriticality?: boolean;
}): AllocationRequest[];
/**
 * Apply allocation priority overrides based on customer status
 *
 * @param request - Allocation request
 * @param customerTier - Customer tier/status
 * @returns Updated request with adjusted priority
 */
export declare function applyCustomerPriorityOverride(request: AllocationRequest, customerTier: 'VIP' | 'PLATINUM' | 'GOLD' | 'SILVER' | 'STANDARD'): AllocationRequest;
/**
 * Calculate dynamic priority score for allocation
 *
 * @param request - Allocation request
 * @param factors - Scoring factors
 * @returns Priority score (higher = more important)
 */
export declare function calculateAllocationPriorityScore(request: AllocationRequest, factors: {
    orderValue?: number;
    customerLifetimeValue?: number;
    daysUntilRequired?: number;
    itemMargin?: number;
}): number;
/**
 * Optimize allocation across warehouses to minimize cost
 *
 * @param request - Allocation request
 * @param inventories - Available inventories with cost data
 * @param criteria - Optimization criteria
 * @returns Optimized allocation result
 */
export declare function optimizeAllocationByCost(request: AllocationRequest, inventories: WarehouseInventory[], criteria: OptimizationCriteria): Promise<AllocationResult>;
/**
 * Optimize to minimize number of warehouses used
 *
 * @param request - Allocation request
 * @param inventories - Available inventories
 * @returns Optimized allocation using fewest warehouses
 */
export declare function optimizeToMinimizeWarehouses(request: AllocationRequest, inventories: WarehouseInventory[]): Promise<AllocationResult>;
/**
 * Balance inventory allocation across warehouses
 *
 * @param requests - Multiple allocation requests
 * @param inventories - Available inventories
 * @returns Balanced allocation results
 */
export declare function balanceInventoryAllocation(requests: AllocationRequest[], inventories: WarehouseInventory[]): Promise<AllocationResult[]>;
/**
 * Calculate optimal safety stock level using statistical method
 *
 * @param itemId - Item identifier
 * @param warehouseId - Warehouse identifier
 * @param demandHistory - Historical demand data
 * @param leadTimeDays - Lead time in days
 * @param serviceLevel - Desired service level (e.g., 0.95)
 * @returns Safety stock configuration
 */
export declare function calculateSafetyStockLevel(itemId: string, warehouseId: string, demandHistory: number[], leadTimeDays: number, serviceLevel?: number): SafetyStockConfig;
/**
 * Check if safety stock should be protected from allocation
 *
 * @param inventory - Warehouse inventory
 * @param allocationQuantity - Requested allocation quantity
 * @returns Whether allocation would breach safety stock
 */
export declare function checkSafetyStockBreach(inventory: WarehouseInventory, allocationQuantity: number): {
    breached: boolean;
    shortfall: number;
};
/**
 * Recommend safety stock adjustments based on performance
 *
 * @param config - Current safety stock configuration
 * @param performance - Historical performance metrics
 * @returns Recommended adjustments
 */
export declare function recommendSafetyStockAdjustment(config: SafetyStockConfig, performance: {
    stockoutOccurrences: number;
    excessInventoryDays: number;
    actualServiceLevel: number;
}): Partial<SafetyStockConfig>;
/**
 * Reallocate inventory between warehouses
 *
 * @param reallocationRequest - Reallocation request details
 * @param sourceInventory - Source warehouse inventory
 * @param targetInventory - Target warehouse inventory
 * @returns Reallocation result
 */
export declare function reallocateInventoryBetweenWarehouses(reallocationRequest: ReallocationRequest, sourceInventory: WarehouseInventory, targetInventory: WarehouseInventory): Promise<{
    success: boolean;
    transferId: string;
    quantity: number;
    estimatedArrivalDate: Date;
}>;
/**
 * Identify reallocation opportunities based on demand patterns
 *
 * @param inventories - All warehouse inventories
 * @param demandForecasts - Demand forecasts by warehouse
 * @returns Recommended reallocations
 */
export declare function identifyReallocationOpportunities(inventories: WarehouseInventory[], demandForecasts: Map<string, number>): ReallocationRequest[];
/**
 * Process expired reservations and release inventory
 *
 * @param reservations - All active reservations
 * @param currentTime - Current timestamp
 * @returns List of expired and released reservations
 */
export declare function processExpiredReservations(reservations: InventoryReservation[], currentTime?: Date): Promise<InventoryReservation[]>;
/**
 * Get reservations expiring soon for notification
 *
 * @param reservations - All active reservations
 * @param thresholdHours - Notification threshold in hours
 * @returns Reservations expiring within threshold
 */
export declare function getExpiringSoonReservations(reservations: InventoryReservation[], thresholdHours?: number): InventoryReservation[];
/**
 * Apply expiration policy to reservation
 *
 * @param reservation - Inventory reservation
 * @param policy - Expiration policy to apply
 * @returns Updated reservation with policy applied
 */
export declare function applyExpirationPolicy(reservation: InventoryReservation, policy: AllocationExpirationPolicy): InventoryReservation;
/**
 * Plan cross-warehouse fulfillment strategy
 *
 * @param request - Allocation request
 * @param inventories - Available inventories across warehouses
 * @param customerLocation - Customer delivery location
 * @returns Cross-warehouse fulfillment plan
 */
export declare function planCrossWarehouseFulfillment(request: AllocationRequest, inventories: WarehouseInventory[], customerLocation: GeoLocation): Promise<AllocationResult>;
/**
 * Consolidate shipments from multiple warehouses
 *
 * @param allocations - Warehouse allocations
 * @param consolidationHub - Hub location for consolidation
 * @returns Consolidated shipment plan
 */
export declare function consolidateMultiWarehouseShipments(allocations: WarehouseAllocation[], consolidationHub?: GeoLocation): {
    requiresConsolidation: boolean;
    consolidationPoint?: GeoLocation;
    estimatedConsolidationDelay: number;
    totalShippingCost: number;
};
/**
 * Create split shipment allocation plan
 *
 * @param request - Allocation request
 * @param inventories - Available inventories
 * @param config - Split shipment configuration
 * @returns Split shipment allocation result
 */
export declare function createSplitShipmentPlan(request: AllocationRequest, inventories: WarehouseInventory[], config: SplitShipmentConfig): Promise<AllocationResult>;
/**
 * Calculate split shipment costs and trade-offs
 *
 * @param allocations - Warehouse allocations
 * @param config - Split shipment configuration
 * @returns Cost analysis of split shipment
 */
export declare function analyzeSplitShipmentCosts(allocations: WarehouseAllocation[], config: SplitShipmentConfig): {
    numberOfShipments: number;
    baseShippingCost: number;
    additionalCosts: number;
    totalCost: number;
    recommendation: 'SPLIT' | 'CONSOLIDATE';
};
/**
 * Find substitute items for allocation
 *
 * @param itemId - Original item identifier
 * @param requiredQuantity - Required quantity
 * @param substitutionRules - Substitution rules/mappings
 * @returns Array of substitute options
 */
export declare function findSubstituteItems(itemId: string, requiredQuantity: number, substitutionRules: Array<{
    originalItemId: string;
    substituteItemId: string;
    substituteDescription: string;
    priceAdjustment: number;
    requiresApproval: boolean;
    priority: number;
}>): ItemSubstitution[];
/**
 * Allocate with automatic substitution
 *
 * @param request - Allocation request
 * @param inventories - Inventory for original item
 * @param substituteInventories - Inventories for substitute items
 * @param substitutionRules - Substitution rules
 * @returns Allocation result with substitutions
 */
export declare function allocateWithSubstitution(request: AllocationRequest, inventories: WarehouseInventory[], substituteInventories: Map<string, WarehouseInventory[]>, substitutionRules: Array<{
    originalItemId: string;
    substituteItemId: string;
    substituteDescription: string;
    priceAdjustment: number;
    requiresApproval: boolean;
    priority: number;
}>): Promise<AllocationResult>;
//# sourceMappingURL=inventory-allocation-kit.d.ts.map