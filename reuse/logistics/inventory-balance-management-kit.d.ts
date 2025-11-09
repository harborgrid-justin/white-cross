/**
 * LOC: INV-BAL-001
 * File: /reuse/logistics/inventory-balance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *   - ioredis (for caching)
 *
 * DOWNSTREAM (imported by):
 *   - Inventory controllers
 *   - Warehouse management services
 *   - Order fulfillment systems
 *   - ATP calculation engines
 */
/**
 * Inventory transaction type enumeration
 */
export declare enum InventoryTransactionType {
    RECEIPT = "RECEIPT",
    SHIPMENT = "SHIPMENT",
    ADJUSTMENT = "ADJUSTMENT",
    TRANSFER = "TRANSFER",
    CYCLE_COUNT = "CYCLE_COUNT",
    RESERVATION = "RESERVATION",
    ALLOCATION = "ALLOCATION",
    RETURN = "RETURN",
    DAMAGE = "DAMAGE",
    OBSOLESCENCE = "OBSOLESCENCE"
}
/**
 * Stock status enumeration
 */
export declare enum StockStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    ALLOCATED = "ALLOCATED",
    ON_HOLD = "ON_HOLD",
    DAMAGED = "DAMAGED",
    QUARANTINE = "QUARANTINE",
    IN_TRANSIT = "IN_TRANSIT",
    OBSOLETE = "OBSOLETE"
}
/**
 * Lot status enumeration
 */
export declare enum LotStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    RECALLED = "RECALLED",
    QUARANTINE = "QUARANTINE",
    RELEASED = "RELEASED"
}
/**
 * Reservation status enumeration
 */
export declare enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    FULFILLED = "FULFILLED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
/**
 * Inventory balance by location
 */
export interface InventoryBalance {
    balanceId: string;
    itemId: string;
    sku: string;
    locationId: string;
    warehouseId: string;
    binLocation?: string;
    quantityOnHand: number;
    quantityAvailable: number;
    quantityReserved: number;
    quantityAllocated: number;
    quantityOnOrder: number;
    quantityInTransit: number;
    quantityDamaged: number;
    quantityOnHold: number;
    unitOfMeasure: string;
    lastUpdated: Date;
    lastCountDate?: Date;
    costPerUnit?: number;
    totalValue?: number;
    metadata?: Record<string, any>;
}
/**
 * Stock level thresholds and parameters
 */
export interface StockLevelThresholds {
    itemId: string;
    locationId: string;
    minimumQuantity: number;
    maximumQuantity: number;
    reorderPoint: number;
    reorderQuantity: number;
    safetyStock: number;
    leadTimeDays: number;
    reviewCycle?: number;
    seasonalFactors?: Record<string, number>;
}
/**
 * Lot tracking information
 */
export interface LotInfo {
    lotId: string;
    lotNumber: string;
    itemId: string;
    sku: string;
    locationId: string;
    quantity: number;
    quantityAvailable: number;
    manufacturingDate?: Date;
    expirationDate?: Date;
    receiptDate: Date;
    vendorLotNumber?: string;
    status: LotStatus;
    qualityTestResults?: Record<string, any>;
    certifications?: string[];
    metadata?: Record<string, any>;
}
/**
 * Serial number tracking information
 */
export interface SerialInfo {
    serialId: string;
    serialNumber: string;
    itemId: string;
    sku: string;
    locationId: string;
    lotId?: string;
    status: StockStatus;
    receiptDate: Date;
    lastMovementDate?: Date;
    currentOwnerId?: string;
    warrantyExpiration?: Date;
    maintenanceSchedule?: Date[];
    metadata?: Record<string, any>;
}
/**
 * Available-to-Promise (ATP) calculation
 */
export interface ATPCalculation {
    itemId: string;
    sku: string;
    locationId?: string;
    requestedQuantity: number;
    availableQuantity: number;
    promiseDate: Date;
    canFulfill: boolean;
    alternativeLocations?: Array<{
        locationId: string;
        availableQuantity: number;
        promiseDate: Date;
    }>;
    futureAvailability?: Array<{
        date: Date;
        quantity: number;
    }>;
    calculationTimestamp: Date;
}
/**
 * Inventory reservation
 */
export interface InventoryReservation {
    reservationId: string;
    itemId: string;
    sku: string;
    locationId: string;
    lotId?: string;
    serialNumbers?: string[];
    quantity: number;
    quantityFulfilled: number;
    quantityRemaining: number;
    orderId?: string;
    customerId?: string;
    priority: number;
    status: ReservationStatus;
    reservedAt: Date;
    expiresAt?: Date;
    fulfilledAt?: Date;
    cancelledAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Inventory movement record
 */
export interface InventoryMovement {
    movementId: string;
    itemId: string;
    sku: string;
    transactionType: InventoryTransactionType;
    fromLocationId?: string;
    toLocationId?: string;
    lotId?: string;
    serialNumbers?: string[];
    quantity: number;
    quantityBefore: number;
    quantityAfter: number;
    unitCost?: number;
    totalValue?: number;
    referenceNumber?: string;
    userId?: string;
    timestamp: Date;
    reason?: string;
    metadata?: Record<string, any>;
}
/**
 * Balance initialization configuration
 */
export interface BalanceInitConfig {
    itemId: string;
    locationId: string;
    initialQuantity: number;
    unitCost?: number;
    lotNumber?: string;
    serialNumbers?: string[];
    userId: string;
}
/**
 * Stock level alert
 */
export interface StockLevelAlert {
    alertId: string;
    itemId: string;
    sku: string;
    locationId: string;
    alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK' | 'REORDER_POINT';
    currentQuantity: number;
    thresholdQuantity: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    createdAt: Date;
    acknowledgedAt?: Date;
    resolvedAt?: Date;
}
/**
 * Query options for performance optimization
 */
export interface BalanceQueryOptions {
    useCache?: boolean;
    cacheTTL?: number;
    includeMetadata?: boolean;
    includeCostData?: boolean;
    forUpdate?: boolean;
}
/**
 * Database index recommendations for optimal performance
 *
 * CREATE INDEX idx_inventory_balance_item_location ON inventory_balances(item_id, location_id);
 * CREATE INDEX idx_inventory_balance_warehouse ON inventory_balances(warehouse_id, last_updated DESC);
 * CREATE INDEX idx_inventory_balance_qty_available ON inventory_balances(quantity_available) WHERE quantity_available > 0;
 * CREATE INDEX idx_lot_info_item_location ON lot_info(item_id, location_id, status);
 * CREATE INDEX idx_lot_info_expiration ON lot_info(expiration_date) WHERE status = 'ACTIVE';
 * CREATE INDEX idx_serial_info_item ON serial_info(item_id, status);
 * CREATE INDEX idx_serial_number ON serial_info(serial_number) UNIQUE;
 * CREATE INDEX idx_reservation_item_location ON inventory_reservations(item_id, location_id, status);
 * CREATE INDEX idx_reservation_order ON inventory_reservations(order_id, status);
 * CREATE INDEX idx_reservation_expiration ON inventory_reservations(expires_at) WHERE status = 'CONFIRMED';
 * CREATE INDEX idx_movement_item_timestamp ON inventory_movements(item_id, timestamp DESC);
 * CREATE INDEX idx_movement_location ON inventory_movements(from_location_id, to_location_id, timestamp DESC);
 */
/**
 * Cache key generators for Redis caching
 */
export declare const CacheKeys: {
    balance: (itemId: string, locationId: string) => string;
    balanceItem: (itemId: string) => string;
    balanceLocation: (locationId: string) => string;
    lot: (lotId: string) => string;
    lotsForItem: (itemId: string, locationId: string) => string;
    serial: (serialNumber: string) => string;
    atp: (itemId: string, locationId?: string) => string;
    reservation: (reservationId: string) => string;
    reservationsForItem: (itemId: string) => string;
    stockAlert: (itemId: string, locationId: string) => string;
};
/**
 * 1. Initializes inventory balance for a new item at a location.
 *
 * Performance: Uses upsert for idempotency, single query operation
 *
 * @param {BalanceInitConfig} config - Initialization configuration
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<InventoryBalance>} Created balance record
 *
 * @example
 * ```typescript
 * const balance = await initializeInventoryBalance({
 *   itemId: 'ITEM-001',
 *   locationId: 'WH-01-A-01',
 *   initialQuantity: 1000,
 *   unitCost: 25.50,
 *   userId: 'USER-123'
 * }, sequelize);
 * ```
 */
export declare function initializeInventoryBalance(config: BalanceInitConfig, sequelize: any): Promise<InventoryBalance>;
/**
 * 2. Retrieves inventory balance for item at specific location with caching.
 *
 * Performance: Redis cache with 300s TTL, optimized index on (item_id, location_id)
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {BalanceQueryOptions} options - Query options
 * @returns {Promise<InventoryBalance | null>} Balance record
 *
 * @example
 * ```typescript
 * const balance = await getInventoryBalance('ITEM-001', 'WH-01-A-01', {
 *   useCache: true,
 *   includeCostData: true
 * });
 * ```
 */
export declare function getInventoryBalance(itemId: string, locationId: string, options?: BalanceQueryOptions): Promise<InventoryBalance | null>;
/**
 * 3. Retrieves all inventory balances for an item across all locations.
 *
 * Performance: Single query with index on item_id, returns array efficiently
 *
 * @param {string} itemId - Item ID
 * @param {object} filters - Optional filters
 * @returns {Promise<InventoryBalance[]>} Array of balances
 *
 * @example
 * ```typescript
 * const balances = await getInventoryBalancesByItem('ITEM-001', {
 *   onlyAvailable: true,
 *   warehouseId: 'WH-01'
 * });
 * ```
 */
export declare function getInventoryBalancesByItem(itemId: string, filters?: {
    onlyAvailable?: boolean;
    warehouseId?: string;
    minQuantity?: number;
}): Promise<InventoryBalance[]>;
/**
 * 4. Retrieves all inventory balances for a location.
 *
 * Performance: Cursor-based pagination for large result sets, index on location_id
 *
 * @param {string} locationId - Location ID
 * @param {object} options - Pagination options
 * @returns {Promise<object>} Paginated balances
 *
 * @example
 * ```typescript
 * const result = await getInventoryBalancesByLocation('WH-01-A-01', {
 *   limit: 100,
 *   cursor: 'cursor_token'
 * });
 * ```
 */
export declare function getInventoryBalancesByLocation(locationId: string, options?: {
    limit?: number;
    cursor?: string;
    includeZeroBalances?: boolean;
}): Promise<{
    balances: InventoryBalance[];
    nextCursor?: string;
    hasMore: boolean;
}>;
/**
 * 5. Updates inventory balance with transaction support.
 *
 * Performance: Row-level locking with FOR UPDATE, atomic operations
 *
 * @param {string} balanceId - Balance ID
 * @param {Partial<InventoryBalance>} updates - Fields to update
 * @param {any} transaction - Sequelize transaction
 * @returns {Promise<InventoryBalance>} Updated balance
 *
 * @example
 * ```typescript
 * await sequelize.transaction(async (t) => {
 *   const balance = await updateInventoryBalance('BAL-001', {
 *     quantityOnHand: 950,
 *     quantityAvailable: 900
 *   }, t);
 * });
 * ```
 */
export declare function updateInventoryBalance(balanceId: string, updates: Partial<InventoryBalance>, transaction?: any): Promise<InventoryBalance>;
/**
 * 6. Bulk initializes balances for multiple items (warehouse receiving).
 *
 * Performance: Single bulk insert operation, optimized for high volume
 *
 * @param {BalanceInitConfig[]} configs - Array of configurations
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<InventoryBalance[]>} Created balances
 *
 * @example
 * ```typescript
 * const balances = await bulkInitializeBalances([
 *   { itemId: 'ITEM-001', locationId: 'WH-01-A-01', initialQuantity: 1000 },
 *   { itemId: 'ITEM-002', locationId: 'WH-01-A-02', initialQuantity: 500 }
 * ], sequelize);
 * ```
 */
export declare function bulkInitializeBalances(configs: BalanceInitConfig[], sequelize: any): Promise<InventoryBalance[]>;
/**
 * 7. Reconciles inventory balance with physical count.
 *
 * Performance: Transaction-wrapped for consistency, creates adjustment record
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {number} physicalCount - Actual counted quantity
 * @param {string} userId - User performing count
 * @returns {Promise<object>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileInventoryBalance(
 *   'ITEM-001',
 *   'WH-01-A-01',
 *   985,
 *   'USER-123'
 * );
 * ```
 */
export declare function reconcileInventoryBalance(itemId: string, locationId: string, physicalCount: number, userId: string): Promise<{
    balance: InventoryBalance;
    adjustment: InventoryMovement;
    variance: number;
    variancePercentage: number;
}>;
/**
 * 8. Transfers inventory balance between locations.
 *
 * Performance: Atomic operation with transaction, updates two balances simultaneously
 *
 * @param {string} itemId - Item ID
 * @param {string} fromLocationId - Source location
 * @param {string} toLocationId - Destination location
 * @param {number} quantity - Quantity to transfer
 * @param {string} userId - User initiating transfer
 * @returns {Promise<object>} Transfer result
 *
 * @example
 * ```typescript
 * const result = await transferInventoryBalance(
 *   'ITEM-001',
 *   'WH-01-A-01',
 *   'WH-01-B-05',
 *   100,
 *   'USER-123'
 * );
 * ```
 */
export declare function transferInventoryBalance(itemId: string, fromLocationId: string, toLocationId: string, quantity: number, userId: string): Promise<{
    fromBalance: InventoryBalance;
    toBalance: InventoryBalance;
    movement: InventoryMovement;
}>;
/**
 * 9. Retrieves balance history for audit trail.
 *
 * Performance: Indexed query on (item_id, timestamp), efficient date range filtering
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {object} dateRange - Date range filter
 * @returns {Promise<InventoryMovement[]>} Movement history
 *
 * @example
 * ```typescript
 * const history = await getBalanceHistory('ITEM-001', 'WH-01-A-01', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare function getBalanceHistory(itemId: string, locationId: string, dateRange: {
    startDate: Date;
    endDate: Date;
}): Promise<InventoryMovement[]>;
/**
 * 10. Checks if item is below reorder point.
 *
 * Performance: Single query with cached thresholds, fast comparison
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @returns {Promise<boolean>} True if below reorder point
 *
 * @example
 * ```typescript
 * const needsReorder = await isAtReorderPoint('ITEM-001', 'WH-01-A-01');
 * if (needsReorder) {
 *   await generatePurchaseOrder('ITEM-001');
 * }
 * ```
 */
export declare function isAtReorderPoint(itemId: string, locationId: string): Promise<boolean>;
/**
 * 11. Generates stock level alerts for items below threshold.
 *
 * Performance: Batch query with JOIN, creates alerts efficiently
 *
 * @param {string} warehouseId - Warehouse ID
 * @returns {Promise<StockLevelAlert[]>} Generated alerts
 *
 * @example
 * ```typescript
 * const alerts = await generateStockLevelAlerts('WH-01');
 * alerts.forEach(alert => {
 *   if (alert.severity === 'CRITICAL') {
 *     sendNotification(alert);
 *   }
 * });
 * ```
 */
export declare function generateStockLevelAlerts(warehouseId: string): Promise<StockLevelAlert[]>;
/**
 * 12. Calculates inventory turnover rate.
 *
 * Performance: Aggregation query with date filtering, cached for period
 *
 * @param {string} itemId - Item ID
 * @param {number} days - Number of days for calculation
 * @returns {Promise<number>} Turnover rate
 *
 * @example
 * ```typescript
 * const turnover = await calculateInventoryTurnover('ITEM-001', 90);
 * // Returns: 4.5 (turned over 4.5 times in 90 days)
 * ```
 */
export declare function calculateInventoryTurnover(itemId: string, days: number): Promise<number>;
/**
 * 13. Identifies slow-moving inventory items.
 *
 * Performance: Efficient aggregation with HAVING clause, indexed on timestamp
 *
 * @param {string} warehouseId - Warehouse ID
 * @param {number} thresholdDays - Days without movement
 * @returns {Promise<Array>} Slow-moving items
 *
 * @example
 * ```typescript
 * const slowMovers = await identifySlowMovingItems('WH-01', 180);
 * ```
 */
export declare function identifySlowMovingItems(warehouseId: string, thresholdDays: number): Promise<Array<{
    itemId: string;
    sku: string;
    locationId: string;
    quantityOnHand: number;
    daysSinceLastMovement: number;
    totalValue: number;
}>>;
/**
 * 14. Calculates safety stock requirements.
 *
 * Performance: Statistical calculation with cached demand data
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {object} params - Calculation parameters
 * @returns {Promise<number>} Safety stock quantity
 *
 * @example
 * ```typescript
 * const safetyStock = await calculateSafetyStock('ITEM-001', 'WH-01', {
 *   serviceLevel: 0.95,
 *   leadTimeDays: 7,
 *   demandVariability: 0.2
 * });
 * ```
 */
export declare function calculateSafetyStock(itemId: string, locationId: string, params: {
    serviceLevel: number;
    leadTimeDays: number;
    demandVariability: number;
}): Promise<number>;
/**
 * 15. Updates stock level thresholds.
 *
 * Performance: Single update with cache invalidation
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {Partial<StockLevelThresholds>} thresholds - Updated thresholds
 * @returns {Promise<StockLevelThresholds>} Updated thresholds
 *
 * @example
 * ```typescript
 * const updated = await updateStockLevelThresholds('ITEM-001', 'WH-01', {
 *   reorderPoint: 200,
 *   reorderQuantity: 1000,
 *   safetyStock: 100
 * });
 * ```
 */
export declare function updateStockLevelThresholds(itemId: string, locationId: string, thresholds: Partial<StockLevelThresholds>): Promise<StockLevelThresholds>;
/**
 * 16. Forecasts inventory requirements based on historical data.
 *
 * Performance: Time-series analysis with cached historical data
 *
 * @param {string} itemId - Item ID
 * @param {number} forecastDays - Days to forecast
 * @returns {Promise<Array>} Daily forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastInventoryRequirements('ITEM-001', 30);
 * ```
 */
export declare function forecastInventoryRequirements(itemId: string, forecastDays: number): Promise<Array<{
    date: Date;
    forecastedDemand: number;
    confidenceInterval: [number, number];
}>>;
/**
 * 17. Identifies overstock situations.
 *
 * Performance: Query with threshold comparison, indexed filtering
 *
 * @param {string} warehouseId - Warehouse ID
 * @param {number} thresholdMultiplier - Multiplier of maximum quantity
 * @returns {Promise<Array>} Overstock items
 *
 * @example
 * ```typescript
 * const overstock = await identifyOverstockItems('WH-01', 1.5);
 * // Returns items with quantity > 1.5x maximum threshold
 * ```
 */
export declare function identifyOverstockItems(warehouseId: string, thresholdMultiplier?: number): Promise<Array<{
    itemId: string;
    sku: string;
    locationId: string;
    quantityOnHand: number;
    maximumQuantity: number;
    excessQuantity: number;
    excessValue: number;
}>>;
/**
 * 18. Generates stock replenishment recommendations.
 *
 * Performance: Complex query with multiple joins, cached for period
 *
 * @param {string} warehouseId - Warehouse ID
 * @returns {Promise<Array>} Replenishment recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateStockReplenishmentRecommendations('WH-01');
 * recommendations.forEach(rec => {
 *   if (rec.priority === 'HIGH') {
 *     createPurchaseOrder(rec);
 *   }
 * });
 * ```
 */
export declare function generateStockReplenishmentRecommendations(warehouseId: string): Promise<Array<{
    itemId: string;
    sku: string;
    locationId: string;
    currentQuantity: number;
    recommendedOrderQuantity: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    estimatedStockoutDate?: Date;
    estimatedCost: number;
}>>;
/**
 * 19. Creates a new lot for received inventory.
 *
 * Performance: Single insert with indexed lot_number for fast lookup
 *
 * @param {Partial<LotInfo>} lotData - Lot information
 * @returns {Promise<LotInfo>} Created lot
 *
 * @example
 * ```typescript
 * const lot = await createLot({
 *   lotNumber: 'LOT-2024-001',
 *   itemId: 'ITEM-001',
 *   locationId: 'WH-01-A-01',
 *   quantity: 1000,
 *   expirationDate: new Date('2025-12-31'),
 *   vendorLotNumber: 'VENDOR-LOT-123'
 * });
 * ```
 */
export declare function createLot(lotData: Partial<LotInfo>): Promise<LotInfo>;
/**
 * 20. Retrieves lot information by lot number with caching.
 *
 * Performance: Redis cached with 600s TTL, indexed on lot_number
 *
 * @param {string} lotNumber - Lot number
 * @returns {Promise<LotInfo | null>} Lot information
 *
 * @example
 * ```typescript
 * const lot = await getLotByNumber('LOT-2024-001');
 * if (lot && lot.status === LotStatus.EXPIRED) {
 *   await quarantineLot(lot.lotId);
 * }
 * ```
 */
export declare function getLotByNumber(lotNumber: string): Promise<LotInfo | null>;
/**
 * 21. Retrieves all lots for an item at a location with FIFO ordering.
 *
 * Performance: Indexed query ordered by receipt_date, efficient for FIFO picking
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {object} filters - Optional filters
 * @returns {Promise<LotInfo[]>} Array of lots in FIFO order
 *
 * @example
 * ```typescript
 * const lots = await getLotsForItem('ITEM-001', 'WH-01-A-01', {
 *   activeOnly: true,
 *   minQuantity: 1
 * });
 * // Returns lots ordered oldest first for FIFO picking
 * ```
 */
export declare function getLotsForItem(itemId: string, locationId: string, filters?: {
    activeOnly?: boolean;
    minQuantity?: number;
    expiringBefore?: Date;
}): Promise<LotInfo[]>;
/**
 * 22. Retrieves lots expiring within specified days.
 *
 * Performance: Indexed query on expiration_date, efficient date comparison
 *
 * @param {number} days - Days until expiration
 * @param {string} warehouseId - Optional warehouse filter
 * @returns {Promise<LotInfo[]>} Expiring lots
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringLots(30, 'WH-01');
 * expiring.forEach(lot => {
 *   sendExpirationAlert(lot);
 * });
 * ```
 */
export declare function getExpiringLots(days: number, warehouseId?: string): Promise<LotInfo[]>;
/**
 * 23. Adjusts lot quantity (consumption, damage, adjustment).
 *
 * Performance: Transaction-wrapped with row locking, atomic update
 *
 * @param {string} lotId - Lot ID
 * @param {number} quantityChange - Quantity change (negative for reduction)
 * @param {string} reason - Adjustment reason
 * @returns {Promise<LotInfo>} Updated lot
 *
 * @example
 * ```typescript
 * await adjustLotQuantity('LOT-001', -50, 'Production consumption');
 * ```
 */
export declare function adjustLotQuantity(lotId: string, quantityChange: number, reason: string): Promise<LotInfo>;
/**
 * 24. Moves lot between locations (lot transfer).
 *
 * Performance: Transaction with two-phase update, maintains lot integrity
 *
 * @param {string} lotId - Lot ID
 * @param {string} fromLocationId - Source location
 * @param {string} toLocationId - Destination location
 * @param {number} quantity - Quantity to move (partial or full)
 * @returns {Promise<object>} Transfer result
 *
 * @example
 * ```typescript
 * const result = await moveLot('LOT-001', 'WH-01-A-01', 'WH-02-B-03', 500);
 * ```
 */
export declare function moveLot(lotId: string, fromLocationId: string, toLocationId: string, quantity: number): Promise<{
    sourceLot: LotInfo;
    destinationLot?: LotInfo;
    movement: InventoryMovement;
}>;
/**
 * 25. Creates serial number records for received serialized items.
 *
 * Performance: Bulk insert for multiple serials, indexed on serial_number
 *
 * @param {Partial<SerialInfo>[]} serialData - Array of serial records
 * @returns {Promise<SerialInfo[]>} Created serial records
 *
 * @example
 * ```typescript
 * const serials = await createSerialNumbers([
 *   { serialNumber: 'SN-001', itemId: 'ITEM-001', locationId: 'WH-01' },
 *   { serialNumber: 'SN-002', itemId: 'ITEM-001', locationId: 'WH-01' }
 * ]);
 * ```
 */
export declare function createSerialNumbers(serialData: Partial<SerialInfo>[]): Promise<SerialInfo[]>;
/**
 * 26. Retrieves serial number information.
 *
 * Performance: Unique index on serial_number, instant lookup
 *
 * @param {string} serialNumber - Serial number
 * @returns {Promise<SerialInfo | null>} Serial information
 *
 * @example
 * ```typescript
 * const serial = await getSerialNumber('SN-123456');
 * console.log(`Location: ${serial.locationId}, Status: ${serial.status}`);
 * ```
 */
export declare function getSerialNumber(serialNumber: string): Promise<SerialInfo | null>;
/**
 * 27. Retrieves all serial numbers for an item at location.
 *
 * Performance: Indexed query on (item_id, location_id, status)
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {StockStatus} status - Optional status filter
 * @returns {Promise<SerialInfo[]>} Serial numbers
 *
 * @example
 * ```typescript
 * const available = await getSerialNumbersForItem(
 *   'ITEM-001',
 *   'WH-01-A-01',
 *   StockStatus.AVAILABLE
 * );
 * ```
 */
export declare function getSerialNumbersForItem(itemId: string, locationId: string, status?: StockStatus): Promise<SerialInfo[]>;
/**
 * 28. Updates serial number status and location.
 *
 * Performance: Single update with cache invalidation, indexed lookup
 *
 * @param {string} serialNumber - Serial number
 * @param {object} updates - Updates to apply
 * @returns {Promise<SerialInfo>} Updated serial
 *
 * @example
 * ```typescript
 * await updateSerialNumber('SN-123456', {
 *   status: StockStatus.ALLOCATED,
 *   currentOwnerId: 'ORDER-789'
 * });
 * ```
 */
export declare function updateSerialNumber(serialNumber: string, updates: {
    status?: StockStatus;
    locationId?: string;
    currentOwnerId?: string;
    lotId?: string;
}): Promise<SerialInfo>;
/**
 * 29. Calculates Available-to-Promise (ATP) for an item.
 *
 * Performance: Optimized calculation with cached data, multi-location aggregation
 *
 * @param {string} itemId - Item ID
 * @param {number} requestedQuantity - Requested quantity
 * @param {string} locationId - Optional specific location
 * @returns {Promise<ATPCalculation>} ATP calculation result
 *
 * @example
 * ```typescript
 * const atp = await calculateATP('ITEM-001', 500, 'WH-01');
 * if (atp.canFulfill) {
 *   console.log(`Can fulfill by ${atp.promiseDate}`);
 * } else {
 *   console.log('Check alternative locations:', atp.alternativeLocations);
 * }
 * ```
 */
export declare function calculateATP(itemId: string, requestedQuantity: number, locationId?: string): Promise<ATPCalculation>;
/**
 * 30. Calculates ATP across multiple locations (network ATP).
 *
 * Performance: Parallel queries across locations, aggregated efficiently
 *
 * @param {string} itemId - Item ID
 * @param {number} requestedQuantity - Requested quantity
 * @param {string[]} locationIds - Array of location IDs to check
 * @returns {Promise<ATPCalculation>} Aggregated ATP
 *
 * @example
 * ```typescript
 * const networkATP = await calculateNetworkATP('ITEM-001', 1000, [
 *   'WH-01', 'WH-02', 'WH-03'
 * ]);
 * ```
 */
export declare function calculateNetworkATP(itemId: string, requestedQuantity: number, locationIds: string[]): Promise<ATPCalculation>;
/**
 * 31. Calculates future ATP with scheduled receipts.
 *
 * Performance: Time-series projection with scheduled receipt data
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {number} forecastDays - Days to project
 * @returns {Promise<Array>} Daily ATP projection
 *
 * @example
 * ```typescript
 * const futureATP = await calculateFutureATP('ITEM-001', 'WH-01', 30);
 * futureATP.forEach(day => {
 *   console.log(`${day.date}: ${day.atp} units available`);
 * });
 * ```
 */
export declare function calculateFutureATP(itemId: string, locationId: string, forecastDays: number): Promise<Array<{
    date: Date;
    atp: number;
    scheduledReceipts: number;
    scheduledShipments: number;
}>>;
/**
 * 32. Checks ATP for multiple items (batch ATP check).
 *
 * Performance: Bulk query optimization, processes multiple items efficiently
 *
 * @param {Array} items - Array of items to check
 * @returns {Promise<Map>} Map of itemId to ATP result
 *
 * @example
 * ```typescript
 * const atpResults = await checkBatchATP([
 *   { itemId: 'ITEM-001', quantity: 500 },
 *   { itemId: 'ITEM-002', quantity: 300 }
 * ]);
 * ```
 */
export declare function checkBatchATP(items: Array<{
    itemId: string;
    quantity: number;
    locationId?: string;
}>): Promise<Map<string, ATPCalculation>>;
/**
 * 33. Allocates ATP quantity for an order (soft allocation).
 *
 * Performance: Transaction-wrapped allocation, updates balance atomically
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {number} quantity - Quantity to allocate
 * @param {string} orderId - Order reference
 * @returns {Promise<object>} Allocation result
 *
 * @example
 * ```typescript
 * const allocation = await allocateATP('ITEM-001', 'WH-01', 100, 'ORDER-789');
 * ```
 */
export declare function allocateATP(itemId: string, locationId: string, quantity: number, orderId: string): Promise<{
    balance: InventoryBalance;
    allocated: boolean;
    allocationId: string;
}>;
/**
 * 34. Releases allocated ATP (cancellation or modification).
 *
 * Performance: Atomic update with transaction support
 *
 * @param {string} allocationId - Allocation ID
 * @returns {Promise<InventoryBalance>} Updated balance
 *
 * @example
 * ```typescript
 * await releaseATPAllocation('ALLOC-123');
 * ```
 */
export declare function releaseATPAllocation(allocationId: string): Promise<InventoryBalance>;
/**
 * 35. Calculates ATP by lot with FEFO consideration.
 *
 * Performance: Lot-level ATP with expiration date ordering
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {number} requestedQuantity - Requested quantity
 * @returns {Promise<object>} Lot-based ATP
 *
 * @example
 * ```typescript
 * const lotATP = await calculateATPByLot('ITEM-001', 'WH-01', 500);
 * lotATP.lotAllocations.forEach(alloc => {
 *   console.log(`Lot ${alloc.lotNumber}: ${alloc.quantity} expires ${alloc.expirationDate}`);
 * });
 * ```
 */
export declare function calculateATPByLot(itemId: string, locationId: string, requestedQuantity: number): Promise<{
    canFulfill: boolean;
    totalAvailable: number;
    lotAllocations: Array<{
        lotId: string;
        lotNumber: string;
        quantity: number;
        expirationDate?: Date;
    }>;
}>;
/**
 * 36. Generates ATP report for all items at location.
 *
 * Performance: Efficient bulk calculation with caching
 *
 * @param {string} locationId - Location ID
 * @returns {Promise<Array>} ATP report
 *
 * @example
 * ```typescript
 * const report = await generateATPReport('WH-01');
 * ```
 */
export declare function generateATPReport(locationId: string): Promise<Array<{
    itemId: string;
    sku: string;
    quantityOnHand: number;
    quantityAvailable: number;
    atp: number;
    reservations: number;
    allocations: number;
}>>;
/**
 * 37. Checks if ATP meets service level agreement.
 *
 * Performance: Quick calculation with cached historical data
 *
 * @param {string} itemId - Item ID
 * @param {number} targetFillRate - Target fill rate (0-1)
 * @returns {Promise<object>} SLA compliance status
 *
 * @example
 * ```typescript
 * const slaStatus = await checkATPServiceLevel('ITEM-001', 0.95);
 * if (!slaStatus.meetsSLA) {
 *   await adjustStockLevels('ITEM-001', slaStatus.recommendedIncrease);
 * }
 * ```
 */
export declare function checkATPServiceLevel(itemId: string, targetFillRate: number): Promise<{
    meetsSLA: boolean;
    currentFillRate: number;
    targetFillRate: number;
    recommendedIncrease?: number;
}>;
/**
 * 38. Creates inventory reservation for an order.
 *
 * Performance: Transaction-wrapped with balance locking, atomic operation
 *
 * @param {Partial<InventoryReservation>} reservationData - Reservation details
 * @returns {Promise<InventoryReservation>} Created reservation
 *
 * @example
 * ```typescript
 * const reservation = await createReservation({
 *   itemId: 'ITEM-001',
 *   locationId: 'WH-01',
 *   quantity: 100,
 *   orderId: 'ORDER-789',
 *   customerId: 'CUST-456',
 *   priority: 1,
 *   expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export declare function createReservation(reservationData: Partial<InventoryReservation>): Promise<InventoryReservation>;
/**
 * 39. Retrieves reservation by ID with caching.
 *
 * Performance: Redis cached, indexed lookup by reservation_id
 *
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<InventoryReservation | null>} Reservation
 *
 * @example
 * ```typescript
 * const reservation = await getReservation('RES-123');
 * ```
 */
export declare function getReservation(reservationId: string): Promise<InventoryReservation | null>;
/**
 * 40. Retrieves all reservations for an order.
 *
 * Performance: Indexed query on order_id, efficient filtering
 *
 * @param {string} orderId - Order ID
 * @returns {Promise<InventoryReservation[]>} Reservations
 *
 * @example
 * ```typescript
 * const reservations = await getReservationsByOrder('ORDER-789');
 * const totalReserved = reservations.reduce((sum, r) => sum + r.quantity, 0);
 * ```
 */
export declare function getReservationsByOrder(orderId: string): Promise<InventoryReservation[]>;
/**
 * 41. Retrieves reservations for an item at location.
 *
 * Performance: Composite index on (item_id, location_id, status)
 *
 * @param {string} itemId - Item ID
 * @param {string} locationId - Location ID
 * @param {ReservationStatus} status - Optional status filter
 * @returns {Promise<InventoryReservation[]>} Reservations
 *
 * @example
 * ```typescript
 * const activeReservations = await getReservationsForItem(
 *   'ITEM-001',
 *   'WH-01',
 *   ReservationStatus.CONFIRMED
 * );
 * ```
 */
export declare function getReservationsForItem(itemId: string, locationId: string, status?: ReservationStatus): Promise<InventoryReservation[]>;
/**
 * 42. Fulfills reservation (picks and ships inventory).
 *
 * Performance: Transaction with balance updates, atomic fulfillment
 *
 * @param {string} reservationId - Reservation ID
 * @param {number} quantityFulfilled - Quantity fulfilled
 * @param {object} fulfillmentData - Fulfillment details
 * @returns {Promise<object>} Fulfillment result
 *
 * @example
 * ```typescript
 * const result = await fulfillReservation('RES-123', 100, {
 *   shipmentId: 'SHIP-456',
 *   lotIds: ['LOT-001'],
 *   serialNumbers: ['SN-001', 'SN-002']
 * });
 * ```
 */
export declare function fulfillReservation(reservationId: string, quantityFulfilled: number, fulfillmentData: {
    shipmentId?: string;
    lotIds?: string[];
    serialNumbers?: string[];
}): Promise<{
    reservation: InventoryReservation;
    balance: InventoryBalance;
    movement: InventoryMovement;
}>;
/**
 * 43. Cancels reservation and releases inventory.
 *
 * Performance: Atomic cancellation with balance restoration
 *
 * @param {string} reservationId - Reservation ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<object>} Cancellation result
 *
 * @example
 * ```typescript
 * await cancelReservation('RES-123', 'Order cancelled by customer');
 * ```
 */
export declare function cancelReservation(reservationId: string, reason: string): Promise<{
    reservation: InventoryReservation;
    balance: InventoryBalance;
}>;
/**
 * 44. Expires old reservations automatically.
 *
 * Performance: Batch update for expired reservations, indexed on expires_at
 *
 * @returns {Promise<number>} Number of expired reservations
 *
 * @example
 * ```typescript
 * // Run periodically via cron job
 * const expired = await expireOldReservations();
 * console.log(`Expired ${expired} reservations`);
 * ```
 */
export declare function expireOldReservations(): Promise<number>;
/**
 * 45. Modifies existing reservation quantity.
 *
 * Performance: Transaction-wrapped modification with balance adjustment
 *
 * @param {string} reservationId - Reservation ID
 * @param {number} newQuantity - New quantity
 * @returns {Promise<InventoryReservation>} Updated reservation
 *
 * @example
 * ```typescript
 * await modifyReservation('RES-123', 150); // Increase from 100 to 150
 * ```
 */
export declare function modifyReservation(reservationId: string, newQuantity: number): Promise<InventoryReservation>;
/**
 * 46. Generates reservation summary report.
 *
 * Performance: Aggregation query with grouping, cached for period
 *
 * @param {string} locationId - Location ID
 * @param {object} filters - Optional filters
 * @returns {Promise<object>} Reservation summary
 *
 * @example
 * ```typescript
 * const summary = await generateReservationSummary('WH-01', {
 *   dateFrom: new Date('2024-01-01'),
 *   dateTo: new Date('2024-01-31')
 * });
 * ```
 */
export declare function generateReservationSummary(locationId: string, filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    customerId?: string;
}): Promise<{
    totalReservations: number;
    activeReservations: number;
    fulfilledReservations: number;
    cancelledReservations: number;
    totalQuantityReserved: number;
    totalQuantityFulfilled: number;
    fulfillmentRate: number;
    byItem: Array<{
        itemId: string;
        sku: string;
        reservationCount: number;
        quantityReserved: number;
        quantityFulfilled: number;
    }>;
}>;
/**
 * Cache manager for inventory data (Redis integration)
 */
export declare class InventoryCacheManager {
    private ttl;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    invalidatePattern(pattern: string): Promise<void>;
}
/**
 * Bulk operation optimizer
 */
export declare class BulkOperationOptimizer {
    private batchSize;
    processBatches<T, R>(items: T[], processor: (batch: T[]) => Promise<R[]>): Promise<R[]>;
}
/**
 * Query performance monitor
 */
export declare class QueryPerformanceMonitor {
    private slowQueryThreshold;
    logSlowQuery(query: string, duration: number): void;
    trackQuery(queryName: string, duration: number): void;
}
declare const _default: {
    initializeInventoryBalance: typeof initializeInventoryBalance;
    getInventoryBalance: typeof getInventoryBalance;
    getInventoryBalancesByItem: typeof getInventoryBalancesByItem;
    getInventoryBalancesByLocation: typeof getInventoryBalancesByLocation;
    updateInventoryBalance: typeof updateInventoryBalance;
    bulkInitializeBalances: typeof bulkInitializeBalances;
    reconcileInventoryBalance: typeof reconcileInventoryBalance;
    transferInventoryBalance: typeof transferInventoryBalance;
    getBalanceHistory: typeof getBalanceHistory;
    isAtReorderPoint: typeof isAtReorderPoint;
    generateStockLevelAlerts: typeof generateStockLevelAlerts;
    calculateInventoryTurnover: typeof calculateInventoryTurnover;
    identifySlowMovingItems: typeof identifySlowMovingItems;
    calculateSafetyStock: typeof calculateSafetyStock;
    updateStockLevelThresholds: typeof updateStockLevelThresholds;
    forecastInventoryRequirements: typeof forecastInventoryRequirements;
    identifyOverstockItems: typeof identifyOverstockItems;
    generateStockReplenishmentRecommendations: typeof generateStockReplenishmentRecommendations;
    createLot: typeof createLot;
    getLotByNumber: typeof getLotByNumber;
    getLotsForItem: typeof getLotsForItem;
    getExpiringLots: typeof getExpiringLots;
    adjustLotQuantity: typeof adjustLotQuantity;
    moveLot: typeof moveLot;
    createSerialNumbers: typeof createSerialNumbers;
    getSerialNumber: typeof getSerialNumber;
    getSerialNumbersForItem: typeof getSerialNumbersForItem;
    updateSerialNumber: typeof updateSerialNumber;
    calculateATP: typeof calculateATP;
    calculateNetworkATP: typeof calculateNetworkATP;
    calculateFutureATP: typeof calculateFutureATP;
    checkBatchATP: typeof checkBatchATP;
    allocateATP: typeof allocateATP;
    releaseATPAllocation: typeof releaseATPAllocation;
    calculateATPByLot: typeof calculateATPByLot;
    generateATPReport: typeof generateATPReport;
    checkATPServiceLevel: typeof checkATPServiceLevel;
    createReservation: typeof createReservation;
    getReservation: typeof getReservation;
    getReservationsByOrder: typeof getReservationsByOrder;
    getReservationsForItem: typeof getReservationsForItem;
    fulfillReservation: typeof fulfillReservation;
    cancelReservation: typeof cancelReservation;
    expireOldReservations: typeof expireOldReservations;
    modifyReservation: typeof modifyReservation;
    generateReservationSummary: typeof generateReservationSummary;
    CacheKeys: {
        balance: (itemId: string, locationId: string) => string;
        balanceItem: (itemId: string) => string;
        balanceLocation: (locationId: string) => string;
        lot: (lotId: string) => string;
        lotsForItem: (itemId: string, locationId: string) => string;
        serial: (serialNumber: string) => string;
        atp: (itemId: string, locationId?: string) => string;
        reservation: (reservationId: string) => string;
        reservationsForItem: (itemId: string) => string;
        stockAlert: (itemId: string, locationId: string) => string;
    };
    InventoryCacheManager: typeof InventoryCacheManager;
    BulkOperationOptimizer: typeof BulkOperationOptimizer;
    QueryPerformanceMonitor: typeof QueryPerformanceMonitor;
};
export default _default;
//# sourceMappingURL=inventory-balance-management-kit.d.ts.map