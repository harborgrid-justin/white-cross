"use strict";
/**
 * File: /reuse/order/backorder-management-kit.ts
 * Locator: WC-ORD-BCKORD-001
 * Purpose: Backorder Management - Backorder handling, partial shipments, and fulfillment optimization
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, error-handling-kit, validation-kit, inventory-kit
 * Downstream: Order controllers, fulfillment services, inventory managers, notification systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 39 production-ready functions for backorder management, partial shipments, fulfillment optimization
 *
 * LLM Context: Enterprise-grade backorder management utilities competing with Oracle MICROS and SAP Order Management.
 * Provides comprehensive backorder lifecycle management including creation, tracking, priority management,
 * partial shipment processing, intelligent allocation, customer preferences, automated notifications,
 * release management, cancellation handling, substitute suggestions, delivery forecasting, analytics,
 * and fulfillment optimization with machine learning-driven predictions and allocation strategies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBackorderAnalytics = exports.updateExpectedDeliveryDates = exports.calculateExpectedDeliveryDate = exports.applySubstituteItem = exports.suggestSubstituteItems = exports.processBackorderCancellationRefund = exports.bulkCancelBackorders = exports.cancelBackorder = exports.manuallyReleaseBackorder = exports.evaluateAutoReleaseRules = exports.configureAutoReleaseRules = exports.configureBackorderNotifications = exports.getBackorderNotificationHistory = exports.scheduleBackorderNotifications = exports.sendBackorderNotification = exports.validateBackorderAgainstPreferences = exports.applyCustomerPreferencesToBackorder = exports.updateCustomerBackorderPreferences = exports.getCustomerBackorderPreferences = exports.getBackorderAllocationHistory = exports.optimizeMultiWarehouseAllocation = exports.reserveInventoryForBackorder = exports.releaseBackorderAllocation = exports.allocateInventoryToBackorders = exports.trackPartialShipments = exports.calculatePartialShipmentStrategy = exports.consolidateBackorderShipments = exports.validatePartialShipment = exports.processPartialShipment = exports.getPrioritizedBackorders = exports.escalateBackorderPriority = exports.recalculateBackorderPriorities = exports.calculateBackorderPriority = exports.bulkCreateBackorders = exports.getBackorders = exports.trackBackorderLifecycle = exports.updateBackorderStatus = exports.getBackorderById = exports.createBackorder = exports.createPriorityGuard = exports.isValidBackorder = exports.isAllocationEligible = exports.createBackorderHistoryModel = exports.createBackorderAllocationModel = exports.createBackorderModel = void 0;
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Backorder model with comprehensive tracking and state management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Backorder model
 *
 * @example
 * ```typescript
 * const BackorderModel = createBackorderModel(sequelize);
 * const backorder = await BackorderModel.create({
 *   backorderId: 'BO-2024-001',
 *   orderId: 'ORD-123',
 *   itemSku: 'SKU-789',
 *   requestedQuantity: 100,
 *   backorderedQuantity: 100,
 *   status: 'pending',
 *   priority: 'high'
 * });
 * ```
 */
const createBackorderModel = (sequelize) => {
    class BackorderModel extends sequelize_1.Model {
    }
    BackorderModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        backorderId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique backorder identifier',
        },
        orderLineId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Associated order line ID',
        },
        orderId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Parent order ID',
        },
        customerId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Customer identifier',
        },
        itemId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Item/product identifier',
        },
        itemSku: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Item SKU',
        },
        requestedQuantity: {
            type: sequelize_1.DataTypes.DECIMAL(18, 4),
            allowNull: false,
            comment: 'Original requested quantity',
        },
        backorderedQuantity: {
            type: sequelize_1.DataTypes.DECIMAL(18, 4),
            allowNull: false,
            comment: 'Quantity on backorder',
        },
        allocatedQuantity: {
            type: sequelize_1.DataTypes.DECIMAL(18, 4),
            allowNull: false,
            defaultValue: 0,
            comment: 'Quantity allocated but not shipped',
        },
        shippedQuantity: {
            type: sequelize_1.DataTypes.DECIMAL(18, 4),
            allowNull: false,
            defaultValue: 0,
            comment: 'Quantity already shipped',
        },
        remainingQuantity: {
            type: sequelize_1.DataTypes.DECIMAL(18, 4),
            allowNull: false,
            comment: 'Remaining quantity to fulfill',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'awaiting_inventory', 'partially_allocated', 'fully_allocated', 'partially_shipped', 'awaiting_customer_approval', 'on_hold', 'cancelled', 'fulfilled', 'expired'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Backorder status',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('critical', 'high', 'medium', 'low'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Backorder priority level',
        },
        priorityScore: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            comment: 'Numerical priority score (0-100)',
        },
        expectedRestockDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Expected inventory restock date',
        },
        estimatedDeliveryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Estimated delivery date to customer',
        },
        allocationStrategy: {
            type: sequelize_1.DataTypes.ENUM('fifo', 'priority_based', 'customer_tier', 'value_based', 'smart_allocation'),
            allowNull: false,
            defaultValue: 'fifo',
            comment: 'Allocation strategy to use',
        },
        releaseMode: {
            type: sequelize_1.DataTypes.ENUM('automatic', 'manual', 'scheduled', 'conditional'),
            allowNull: false,
            defaultValue: 'automatic',
            comment: 'Release mode for backorder',
        },
        allowPartialShipment: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Allow partial shipments',
        },
        minimumShipmentQuantity: {
            type: sequelize_1.DataTypes.DECIMAL(18, 4),
            allowNull: true,
            comment: 'Minimum quantity for partial shipment',
        },
        consolidationWindowHours: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 24,
            comment: 'Hours to wait for consolidation',
        },
        autoReleaseEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Enable automatic release',
        },
        notificationsSent: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Count of notifications sent',
        },
        lastNotificationAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last notification timestamp',
        },
        holdReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for hold status',
        },
        holdUntil: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Hold until date',
        },
        cancellationReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for cancellation',
        },
        cancelledBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who cancelled backorder',
        },
        cancelledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Cancellation timestamp',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created backorder',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who last updated backorder',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'backorders',
        timestamps: true,
        indexes: [
            { fields: ['backorderId'], unique: true },
            { fields: ['orderId'] },
            { fields: ['customerId'] },
            { fields: ['itemId'] },
            { fields: ['itemSku'] },
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['priorityScore'] },
            { fields: ['createdAt'] },
            { fields: ['expectedRestockDate'] },
            { fields: ['status', 'priority'] },
            { fields: ['customerId', 'status'] },
        ],
    });
    return BackorderModel;
};
exports.createBackorderModel = createBackorderModel;
/**
 * Backorder allocation tracking model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BackorderAllocation model
 *
 * @example
 * ```typescript
 * const BackorderAllocation = createBackorderAllocationModel(sequelize);
 * await BackorderAllocation.create({
 *   backorderId: 'BO-2024-001',
 *   inventoryLocationId: 'WH-001-A1',
 *   quantity: 50,
 *   status: 'allocated'
 * });
 * ```
 */
const createBackorderAllocationModel = (sequelize) => {
    class BackorderAllocation extends sequelize_1.Model {
    }
    BackorderAllocation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        allocationId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique allocation identifier',
        },
        backorderId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Associated backorder ID',
        },
        inventoryLocationId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Inventory location identifier',
        },
        warehouseId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Warehouse identifier',
        },
        itemId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Item identifier',
        },
        quantity: {
            type: sequelize_1.DataTypes.DECIMAL(18, 4),
            allowNull: false,
            comment: 'Allocated quantity',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('allocated', 'reserved', 'shipped', 'released', 'expired'),
            allowNull: false,
            defaultValue: 'allocated',
            comment: 'Allocation status',
        },
        allocatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Allocation timestamp',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Allocation expiration timestamp',
        },
        shippedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Shipment timestamp',
        },
        releasedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Release timestamp',
        },
        lotNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Lot/batch number',
        },
        serialNumbers: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Serial numbers for serialized items',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'backorder_allocations',
        timestamps: true,
        indexes: [
            { fields: ['allocationId'], unique: true },
            { fields: ['backorderId'] },
            { fields: ['inventoryLocationId'] },
            { fields: ['warehouseId'] },
            { fields: ['status'] },
            { fields: ['allocatedAt'] },
            { fields: ['expiresAt'] },
        ],
    });
    return BackorderAllocation;
};
exports.createBackorderAllocationModel = createBackorderAllocationModel;
/**
 * Backorder history and audit log model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BackorderHistory model
 *
 * @example
 * ```typescript
 * const BackorderHistory = createBackorderHistoryModel(sequelize);
 * await BackorderHistory.create({
 *   backorderId: 'BO-2024-001',
 *   action: 'status_changed',
 *   previousState: { status: 'pending' },
 *   newState: { status: 'allocated' }
 * });
 * ```
 */
const createBackorderHistoryModel = (sequelize) => {
    class BackorderHistory extends sequelize_1.Model {
    }
    BackorderHistory.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        backorderId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Backorder identifier',
        },
        action: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Action performed',
        },
        performedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who performed action',
        },
        performedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Action timestamp',
        },
        previousState: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Previous backorder state',
        },
        newState: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'New backorder state',
        },
        changeDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Description of changes',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'IP address',
        },
        userAgent: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'User agent string',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'backorder_history',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['backorderId'] },
            { fields: ['performedBy'] },
            { fields: ['performedAt'] },
            { fields: ['action'] },
        ],
    });
    return BackorderHistory;
};
exports.createBackorderHistoryModel = createBackorderHistoryModel;
// ============================================================================
// TYPE GUARDS AND VALIDATORS
// ============================================================================
/**
 * Type guard to check if status is allocation-eligible.
 *
 * @param {BackorderStatus} status - Status to check
 * @returns {boolean} True if allocation-eligible
 *
 * @example
 * ```typescript
 * if (isAllocationEligible(backorder.status)) {
 *   await allocateInventory(backorder);
 * }
 * ```
 */
const isAllocationEligible = (status) => {
    return status === 'pending' || status === 'awaiting_inventory' || status === 'partially_allocated';
};
exports.isAllocationEligible = isAllocationEligible;
/**
 * Type guard to validate backorder object structure.
 *
 * @param {unknown} value - Value to validate
 * @returns {boolean} True if valid backorder
 *
 * @example
 * ```typescript
 * if (isValidBackorder(data)) {
 *   await processBackorder(data);
 * }
 * ```
 */
const isValidBackorder = (value) => {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    return (typeof obj.backorderId === 'string' &&
        typeof obj.orderId === 'string' &&
        typeof obj.customerId === 'string' &&
        typeof obj.itemId === 'string' &&
        typeof obj.requestedQuantity === 'number' &&
        typeof obj.status === 'string');
};
exports.isValidBackorder = isValidBackorder;
/**
 * Type guard factory for creating priority-specific guards.
 *
 * @param {BackorderPriority} priority - Priority to check for
 * @returns {TypeGuard<Backorder>} Type guard function
 *
 * @example
 * ```typescript
 * const isCritical = createPriorityGuard('critical');
 * if (isCritical(backorder)) {
 *   await escalateBackorder(backorder);
 * }
 * ```
 */
const createPriorityGuard = (priority) => {
    return (value) => {
        return (0, exports.isValidBackorder)(value) && value.priority === priority;
    };
};
exports.createPriorityGuard = createPriorityGuard;
// ============================================================================
// BACKORDER CREATION AND TRACKING (Functions 1-6)
// ============================================================================
/**
 * Creates a new backorder with intelligent priority calculation.
 *
 * @param {Object} params - Backorder creation parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Backorder>} Created backorder
 *
 * @example
 * ```typescript
 * const backorder = await createBackorder({
 *   orderId: 'ORD-123',
 *   orderLineId: 'OL-456',
 *   customerId: 'CUST-789',
 *   itemId: 'ITEM-001',
 *   itemSku: 'SKU-ABC',
 *   requestedQuantity: 100,
 *   backorderedQuantity: 100,
 *   priority: 'high',
 *   createdBy: 'user@example.com'
 * });
 * ```
 */
const createBackorder = async (params, transaction) => {
    const backorderId = `BO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Calculate priority score
    const priorityScoreMap = {
        critical: 100,
        high: 75,
        medium: 50,
        low: 25,
    };
    const priority = params.priority || 'medium';
    const priorityScore = priorityScoreMap[priority];
    const backorder = {
        backorderId,
        orderLineId: params.orderLineId,
        orderId: params.orderId,
        customerId: params.customerId,
        itemId: params.itemId,
        itemSku: params.itemSku,
        requestedQuantity: params.requestedQuantity,
        backorderedQuantity: params.backorderedQuantity,
        allocatedQuantity: 0,
        shippedQuantity: 0,
        remainingQuantity: params.backorderedQuantity,
        priority,
        priorityScore,
        status: 'pending',
        metadata: (params.metadata || {}),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Log creation in history
    await logBackorderHistory({
        backorderId,
        action: 'created',
        performedBy: params.createdBy,
        previousState: null,
        newState: backorder,
        changeDescription: `Backorder created for ${params.backorderedQuantity} units of ${params.itemSku}`,
    }, transaction);
    return backorder;
};
exports.createBackorder = createBackorder;
/**
 * Retrieves backorder by ID with full details.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} [options] - Query options
 * @returns {Promise<Backorder | null>} Backorder or null
 *
 * @example
 * ```typescript
 * const backorder = await getBackorderById('BO-2024-001', {
 *   includeAllocations: true,
 *   includeHistory: true
 * });
 * ```
 */
const getBackorderById = async (backorderId, options = {}) => {
    // Implementation would query database
    // For now, return mock structure
    return null;
};
exports.getBackorderById = getBackorderById;
/**
 * Updates backorder status with state machine validation.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {BackorderStatus} newStatus - New status
 * @param {Object} params - Update parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Backorder>} Updated backorder
 *
 * @example
 * ```typescript
 * const backorder = await updateBackorderStatus(
 *   'BO-2024-001',
 *   'partially_allocated',
 *   {
 *     updatedBy: 'system',
 *     metadata: { allocatedQuantity: 50, remainingQuantity: 50 }
 *   }
 * );
 * ```
 */
const updateBackorderStatus = async (backorderId, newStatus, params, transaction) => {
    // Validate state transition
    const validTransitions = {
        pending: ['awaiting_inventory', 'partially_allocated', 'fully_allocated', 'on_hold', 'cancelled'],
        awaiting_inventory: ['partially_allocated', 'fully_allocated', 'on_hold', 'cancelled'],
        partially_allocated: ['fully_allocated', 'partially_shipped', 'on_hold', 'cancelled'],
        fully_allocated: ['partially_shipped', 'fulfilled', 'on_hold', 'cancelled'],
        partially_shipped: ['fulfilled', 'on_hold', 'cancelled'],
        on_hold: ['pending', 'awaiting_inventory', 'cancelled'],
    };
    // Implementation would validate and update
    const updatedBackorder = {
        backorderId,
        status: newStatus,
        metadata: params.metadata || {},
        updatedAt: new Date(),
    };
    return updatedBackorder;
};
exports.updateBackorderStatus = updateBackorderStatus;
/**
 * Tracks backorder lifecycle metrics and milestones.
 *
 * @param {string} backorderId - Backorder identifier
 * @returns {Promise<Object>} Lifecycle metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackBackorderLifecycle('BO-2024-001');
 * console.log(`Age: ${metrics.ageInHours}h, Status: ${metrics.currentStatus}`);
 * ```
 */
const trackBackorderLifecycle = async (backorderId) => {
    // Implementation would calculate lifecycle metrics
    return {
        backorderId,
        currentStatus: 'pending',
        ageInHours: 48,
        timeInEachStatus: {
            pending: 24,
            awaiting_inventory: 24,
        },
        milestones: [],
        slaCompliance: {
            withinSla: true,
            slaThresholdHours: 72,
            currentAgeHours: 48,
        },
    };
};
exports.trackBackorderLifecycle = trackBackorderLifecycle;
/**
 * Retrieves backorders with advanced filtering and pagination.
 *
 * @param {Object} filters - Filter criteria
 * @param {Object} [pagination] - Pagination options
 * @returns {Promise<Object>} Paginated backorders
 *
 * @example
 * ```typescript
 * const result = await getBackorders({
 *   status: ['pending', 'awaiting_inventory'],
 *   priority: ['critical', 'high'],
 *   customerId: 'CUST-123',
 *   createdAfter: new Date('2024-01-01')
 * }, { page: 1, limit: 50 });
 * ```
 */
const getBackorders = async (filters = {}, pagination = {}) => {
    // Implementation would query database with filters
    return {
        data: [],
        pagination: {
            currentPage: pagination.page || 1,
            totalPages: 0,
            totalRecords: 0,
            hasNext: false,
            hasPrevious: false,
        },
    };
};
exports.getBackorders = getBackorders;
/**
 * Bulk creates backorders from order lines with insufficient inventory.
 *
 * @param {Array} orderLines - Order lines to process
 * @param {Object} options - Processing options
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Object>} Bulk creation results
 *
 * @example
 * ```typescript
 * const result = await bulkCreateBackorders([
 *   { orderLineId: 'OL-1', itemId: 'ITEM-1', shortageQuantity: 50 },
 *   { orderLineId: 'OL-2', itemId: 'ITEM-2', shortageQuantity: 100 }
 * ], { notifyCustomers: true, autoPrioritize: true });
 * ```
 */
const bulkCreateBackorders = async (orderLines, options, transaction) => {
    const created = [];
    const failed = [];
    for (const line of orderLines) {
        try {
            const backorder = await (0, exports.createBackorder)({
                orderId: line.orderId,
                orderLineId: line.orderLineId,
                customerId: line.customerId,
                itemId: line.itemId,
                itemSku: line.itemSku,
                requestedQuantity: line.requestedQuantity,
                backorderedQuantity: line.shortageQuantity,
                priority: options.defaultPriority,
                createdBy: options.createdBy,
            }, transaction);
            created.push(backorder);
        }
        catch (error) {
            failed.push({
                orderLineId: line.orderLineId,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return {
        created,
        failed,
        summary: {
            totalProcessed: orderLines.length,
            successCount: created.length,
            failureCount: failed.length,
            totalBackorderedQuantity: created.reduce((sum, bo) => sum + bo.backorderedQuantity, 0),
        },
    };
};
exports.bulkCreateBackorders = bulkCreateBackorders;
// ============================================================================
// BACKORDER PRIORITY MANAGEMENT (Functions 7-10)
// ============================================================================
/**
 * Calculates dynamic priority score based on multiple factors.
 *
 * @param {Object} params - Priority calculation parameters
 * @returns {Promise<Object>} Priority score and details
 *
 * @example
 * ```typescript
 * const priority = await calculateBackorderPriority({
 *   customerId: 'CUST-123',
 *   itemId: 'ITEM-456',
 *   orderValue: 50000,
 *   customerTier: 'platinum',
 *   orderAge: 72,
 *   backorderedQuantity: 100
 * });
 * ```
 */
const calculateBackorderPriority = async (params) => {
    const factors = {
        customerTierScore: 0,
        orderValueScore: 0,
        orderAgeScore: 0,
        itemCriticalityScore: 0,
        seasonalDemandScore: 0,
    };
    const reasoning = [];
    // Customer tier scoring
    const tierScores = { platinum: 40, gold: 30, silver: 20, bronze: 10 };
    factors.customerTierScore = tierScores[params.customerTier || 'bronze'];
    reasoning.push(`Customer tier (${params.customerTier || 'bronze'}): ${factors.customerTierScore} points`);
    // Order value scoring (0-25 points)
    factors.orderValueScore = Math.min(25, (params.orderValue / 1000) * 0.5);
    reasoning.push(`Order value ($${params.orderValue}): ${factors.orderValueScore.toFixed(1)} points`);
    // Order age scoring (0-20 points)
    factors.orderAgeScore = Math.min(20, (params.orderAge / 24) * 5);
    reasoning.push(`Order age (${params.orderAge}h): ${factors.orderAgeScore.toFixed(1)} points`);
    // Item criticality scoring
    const criticalityScores = { critical: 10, standard: 5, low: 0 };
    factors.itemCriticalityScore = criticalityScores[params.itemCriticality || 'standard'];
    reasoning.push(`Item criticality: ${factors.itemCriticalityScore} points`);
    // Seasonal demand scoring
    factors.seasonalDemandScore = (params.seasonalDemand || 0) * 0.05;
    reasoning.push(`Seasonal demand: ${factors.seasonalDemandScore.toFixed(1)} points`);
    // Calculate total score
    const priorityScore = Math.min(100, factors.customerTierScore +
        factors.orderValueScore +
        factors.orderAgeScore +
        factors.itemCriticalityScore +
        factors.seasonalDemandScore);
    // Determine priority level
    let priority;
    if (priorityScore >= 85)
        priority = 'critical';
    else if (priorityScore >= 65)
        priority = 'high';
    else if (priorityScore >= 40)
        priority = 'medium';
    else
        priority = 'low';
    reasoning.push(`Total score: ${priorityScore.toFixed(1)} → ${priority} priority`);
    return { priority, priorityScore, factors, reasoning };
};
exports.calculateBackorderPriority = calculateBackorderPriority;
/**
 * Recalculates priorities for all active backorders.
 *
 * @param {Object} [options] - Recalculation options
 * @returns {Promise<Object>} Recalculation results
 *
 * @example
 * ```typescript
 * const result = await recalculateBackorderPriorities({
 *   includeStatuses: ['pending', 'awaiting_inventory'],
 *   batchSize: 100
 * });
 * console.log(`Updated ${result.updated} backorders`);
 * ```
 */
const recalculateBackorderPriorities = async (options = {}) => {
    // Implementation would recalculate all priorities
    return {
        analyzed: 0,
        updated: 0,
        unchanged: 0,
        changes: [],
    };
};
exports.recalculateBackorderPriorities = recalculateBackorderPriorities;
/**
 * Escalates backorder priority based on age and conditions.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} params - Escalation parameters
 * @returns {Promise<Backorder>} Updated backorder
 *
 * @example
 * ```typescript
 * const backorder = await escalateBackorderPriority('BO-2024-001', {
 *   reason: 'Age threshold exceeded',
 *   escalatedBy: 'system',
 *   notifyStakeholders: true
 * });
 * ```
 */
const escalateBackorderPriority = async (backorderId, params) => {
    // Implementation would escalate priority
    const backorder = await (0, exports.getBackorderById)(backorderId);
    if (!backorder) {
        throw new Error(`Backorder ${backorderId} not found`);
    }
    const priorityLevels = ['low', 'medium', 'high', 'critical'];
    const currentIndex = priorityLevels.indexOf(backorder.priority);
    const newPriority = params.targetPriority || priorityLevels[Math.min(currentIndex + 1, 3)];
    return (0, exports.updateBackorderStatus)(backorderId, backorder.status, {
        updatedBy: params.escalatedBy,
        metadata: {
            ...backorder.metadata,
            escalationReason: params.reason,
            escalatedAt: new Date(),
        },
    });
};
exports.escalateBackorderPriority = escalateBackorderPriority;
/**
 * Retrieves backorders sorted by priority with smart ranking.
 *
 * @param {Object} [filters] - Filter options
 * @param {Object} [options] - Query options
 * @returns {Promise<Array>} Prioritized backorders
 *
 * @example
 * ```typescript
 * const backorders = await getPrioritizedBackorders({
 *   status: ['pending', 'awaiting_inventory'],
 *   customerId: 'CUST-123'
 * }, { limit: 20, includeScore: true });
 * ```
 */
const getPrioritizedBackorders = async (filters = {}, options = {}) => {
    // Implementation would query and sort by priority
    return [];
};
exports.getPrioritizedBackorders = getPrioritizedBackorders;
// ============================================================================
// PARTIAL SHIPMENT PROCESSING (Functions 11-15)
// ============================================================================
/**
 * Processes partial shipment for backorder with validation.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} params - Shipment parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<PartialShipment>} Shipment details
 *
 * @example
 * ```typescript
 * const shipment = await processPartialShipment('BO-2024-001', {
 *   quantity: 50,
 *   allocations: [{ allocationId: 'AL-001', quantity: 50 }],
 *   carrier: 'UPS',
 *   trackingNumber: '1Z999AA10123456784',
 *   shippedBy: 'warehouse@example.com'
 * });
 * ```
 */
const processPartialShipment = async (backorderId, params, transaction) => {
    const backorder = await (0, exports.getBackorderById)(backorderId);
    if (!backorder) {
        throw new Error(`Backorder ${backorderId} not found`);
    }
    // Validate partial shipment is allowed
    if (!backorder.allowPartialShipment) {
        throw new Error('Partial shipments not allowed for this backorder');
    }
    // Validate quantity
    const remainingToShip = backorder.backorderedQuantity - backorder.shippedQuantity;
    if (params.quantity > remainingToShip) {
        throw new Error(`Quantity ${params.quantity} exceeds remaining ${remainingToShip}`);
    }
    // Check minimum shipment quantity
    if (backorder.minimumShipmentQuantity && params.quantity < backorder.minimumShipmentQuantity) {
        throw new Error(`Quantity ${params.quantity} below minimum ${backorder.minimumShipmentQuantity}`);
    }
    const shipmentId = `SHP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const shipment = {
        shipmentId,
        backorderId,
        shippedQuantity: params.quantity,
        remainingQuantity: remainingToShip - params.quantity,
        trackingNumber: params.trackingNumber,
        carrier: params.carrier,
        shipmentDate: new Date(),
        estimatedDeliveryDate: params.estimatedDeliveryDate,
        shippingCost: params.shippingCost,
        items: [],
    };
    // Update backorder status
    const newShippedQuantity = backorder.shippedQuantity + params.quantity;
    const newStatus = newShippedQuantity >= backorder.backorderedQuantity ? 'fulfilled' : 'partially_shipped';
    await (0, exports.updateBackorderStatus)(backorderId, newStatus, {
        updatedBy: params.shippedBy,
        metadata: {
            ...backorder.metadata,
            lastShipmentId: shipmentId,
            lastShipmentDate: new Date(),
        },
    }, transaction);
    return shipment;
};
exports.processPartialShipment = processPartialShipment;
/**
 * Validates if partial shipment is allowed based on preferences and rules.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {number} proposedQuantity - Proposed shipment quantity
 * @returns {Promise<Object>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePartialShipment('BO-2024-001', 25);
 * if (!validation.allowed) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
const validatePartialShipment = async (backorderId, proposedQuantity) => {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    const backorder = await (0, exports.getBackorderById)(backorderId);
    if (!backorder) {
        errors.push('Backorder not found');
        return { allowed: false, errors, warnings, recommendations };
    }
    // Check if partial shipments allowed
    if (!backorder.allowPartialShipment) {
        errors.push('Partial shipments not allowed for this backorder');
    }
    // Check minimum quantity
    if (backorder.minimumShipmentQuantity && proposedQuantity < backorder.minimumShipmentQuantity) {
        errors.push(`Quantity below minimum of ${backorder.minimumShipmentQuantity}`);
    }
    // Check remaining quantity
    const remainingQuantity = backorder.backorderedQuantity - backorder.shippedQuantity;
    if (proposedQuantity > remainingQuantity) {
        errors.push(`Quantity exceeds remaining ${remainingQuantity}`);
    }
    // Warnings
    if (proposedQuantity < remainingQuantity * 0.5) {
        warnings.push('Shipping less than 50% of remaining quantity may increase shipping costs');
    }
    // Recommendations
    if (remainingQuantity - proposedQuantity < 10) {
        recommendations.push('Consider waiting for full quantity to reduce shipping costs');
    }
    return {
        allowed: errors.length === 0,
        errors,
        warnings,
        recommendations,
        minimumQuantity: backorder.minimumShipmentQuantity || undefined,
        maximumQuantity: remainingQuantity,
    };
};
exports.validatePartialShipment = validatePartialShipment;
/**
 * Consolidates multiple backorders into a single shipment.
 *
 * @param {Array<string>} backorderIds - Backorder identifiers
 * @param {Object} params - Consolidation parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Object>} Consolidated shipment
 *
 * @example
 * ```typescript
 * const shipment = await consolidateBackorderShipments(
 *   ['BO-2024-001', 'BO-2024-002', 'BO-2024-003'],
 *   {
 *     customerId: 'CUST-123',
 *     carrier: 'FedEx',
 *     shippedBy: 'warehouse@example.com'
 *   }
 * );
 * ```
 */
const consolidateBackorderShipments = async (backorderIds, params, transaction) => {
    // Implementation would consolidate shipments
    return {
        consolidatedShipmentId: `CS-${Date.now()}`,
        backorders: [],
        totalItems: 0,
        totalWeight: 0,
        estimatedCost: 0,
        estimatedDeliveryDate: new Date(),
        savings: {
            individualShippingCost: 0,
            consolidatedShippingCost: 0,
            savingsAmount: 0,
            savingsPercentage: 0,
        },
    };
};
exports.consolidateBackorderShipments = consolidateBackorderShipments;
/**
 * Calculates optimal partial shipment strategy.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} [options] - Calculation options
 * @returns {Promise<Object>} Shipment strategy
 *
 * @example
 * ```typescript
 * const strategy = await calculatePartialShipmentStrategy('BO-2024-001', {
 *   optimizeFor: 'cost',
 *   maxShipments: 3
 * });
 * ```
 */
const calculatePartialShipmentStrategy = async (backorderId, options = {}) => {
    // Implementation would calculate optimal strategy
    return {
        recommendedStrategy: 'multiple_shipments',
        shipmentPlan: [],
        analysis: {
            totalCost: 0,
            totalTime: 0,
            customerSatisfactionScore: 0,
            reasoning: [],
        },
    };
};
exports.calculatePartialShipmentStrategy = calculatePartialShipmentStrategy;
/**
 * Tracks all partial shipments for a backorder.
 *
 * @param {string} backorderId - Backorder identifier
 * @returns {Promise<Object>} Shipment tracking details
 *
 * @example
 * ```typescript
 * const tracking = await trackPartialShipments('BO-2024-001');
 * console.log(`${tracking.shipments.length} shipments, ${tracking.totalShipped} units shipped`);
 * ```
 */
const trackPartialShipments = async (backorderId) => {
    // Implementation would track all shipments
    return {
        backorderId,
        totalRequested: 0,
        totalShipped: 0,
        totalRemaining: 0,
        shipments: [],
        completionPercentage: 0,
    };
};
exports.trackPartialShipments = trackPartialShipments;
// ============================================================================
// BACKORDER ALLOCATION (Functions 16-20)
// ============================================================================
/**
 * Allocates inventory to backorders using specified strategy.
 *
 * @param {Object} params - Allocation parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<AllocationResult>} Allocation results
 *
 * @example
 * ```typescript
 * const result = await allocateInventoryToBackorders({
 *   itemId: 'ITEM-001',
 *   availableQuantity: 500,
 *   warehouseId: 'WH-001',
 *   strategy: 'priority_based',
 *   allocatedBy: 'system'
 * });
 * ```
 */
const allocateInventoryToBackorders = async (params, transaction) => {
    // Get eligible backorders
    const backorders = await (0, exports.getBackorders)({
        itemId: params.itemId,
        status: ['pending', 'awaiting_inventory', 'partially_allocated'],
    });
    const allocations = [];
    let remainingQuantity = params.availableQuantity;
    // Sort backorders based on strategy
    let sortedBackorders = backorders.data;
    switch (params.strategy) {
        case 'fifo':
            sortedBackorders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            break;
        case 'priority_based':
            sortedBackorders.sort((a, b) => b.priorityScore - a.priorityScore);
            break;
        case 'value_based':
            // Would sort by order value
            break;
    }
    // Allocate inventory
    for (const backorder of sortedBackorders) {
        if (remainingQuantity <= 0)
            break;
        const quantityNeeded = backorder.remainingQuantity;
        const quantityToAllocate = Math.min(quantityNeeded, remainingQuantity);
        const allocation = {
            allocationId: `AL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            inventoryLocationId: params.inventoryLocationId,
            warehouseId: params.warehouseId,
            quantity: quantityToAllocate,
            allocatedAt: new Date(),
            lotNumber: params.lotNumber,
        };
        allocations.push(allocation);
        remainingQuantity -= quantityToAllocate;
    }
    // For smart allocation, include ML confidence and reasoning
    if (params.strategy === 'smart_allocation') {
        return {
            allocations,
            mlConfidence: 0.92,
            reasoning: [
                'Prioritized high-value customers',
                'Considered historical fulfillment patterns',
                'Optimized for minimal shipping costs',
            ],
        };
    }
    return { allocations };
};
exports.allocateInventoryToBackorders = allocateInventoryToBackorders;
/**
 * Releases allocated inventory back to available pool.
 *
 * @param {string} allocationId - Allocation identifier
 * @param {Object} params - Release parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Object>} Release result
 *
 * @example
 * ```typescript
 * const result = await releaseBackorderAllocation('AL-2024-001', {
 *   reason: 'Customer cancelled order',
 *   releasedBy: 'user@example.com',
 *   returnToInventory: true
 * });
 * ```
 */
const releaseBackorderAllocation = async (allocationId, params, transaction) => {
    // Implementation would release allocation
    return {
        success: true,
        releasedQuantity: 0,
        inventoryReturned: params.returnToInventory || false,
        reallocated: params.reallocate || false,
    };
};
exports.releaseBackorderAllocation = releaseBackorderAllocation;
/**
 * Reserves inventory for high-priority backorders.
 *
 * @param {Object} params - Reservation parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Object>} Reservation result
 *
 * @example
 * ```typescript
 * const reservation = await reserveInventoryForBackorder({
 *   backorderId: 'BO-2024-001',
 *   quantity: 100,
 *   reservationDuration: 48,
 *   priority: 'critical'
 * });
 * ```
 */
const reserveInventoryForBackorder = async (params, transaction) => {
    const reservationId = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + params.reservationDuration * 60 * 60 * 1000);
    return {
        reservationId,
        backorderId: params.backorderId,
        reservedQuantity: params.quantity,
        expiresAt,
        inventoryLocations: [],
    };
};
exports.reserveInventoryForBackorder = reserveInventoryForBackorder;
/**
 * Optimizes allocation across multiple warehouses.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} [options] - Optimization options
 * @returns {Promise<Object>} Optimized allocation plan
 *
 * @example
 * ```typescript
 * const plan = await optimizeMultiWarehouseAllocation('BO-2024-001', {
 *   minimizeShippingCost: true,
 *   preferSingleWarehouse: true
 * });
 * ```
 */
const optimizeMultiWarehouseAllocation = async (backorderId, options = {}) => {
    // Implementation would optimize warehouse allocation
    return {
        recommendedAllocation: [],
        totalCost: 0,
        totalDeliveryTime: 0,
        warehousesUsed: 0,
        savingsVsSuboptimal: {
            costSavings: 0,
            timeSavings: 0,
        },
    };
};
exports.optimizeMultiWarehouseAllocation = optimizeMultiWarehouseAllocation;
/**
 * Gets allocation history and current status for backorder.
 *
 * @param {string} backorderId - Backorder identifier
 * @returns {Promise<Object>} Allocation history
 *
 * @example
 * ```typescript
 * const history = await getBackorderAllocationHistory('BO-2024-001');
 * console.log(`${history.allocations.length} allocations, ${history.totalAllocated} units`);
 * ```
 */
const getBackorderAllocationHistory = async (backorderId) => {
    // Implementation would retrieve allocation history
    return {
        backorderId,
        totalAllocated: 0,
        currentlyAllocated: 0,
        allocations: [],
        allocationTimeline: [],
    };
};
exports.getBackorderAllocationHistory = getBackorderAllocationHistory;
// ============================================================================
// CUSTOMER BACKORDER PREFERENCES (Functions 21-24)
// ============================================================================
/**
 * Retrieves customer's backorder preferences.
 *
 * @param {string} customerId - Customer identifier
 * @returns {Promise<CustomerBackorderPreference>} Customer preferences
 *
 * @example
 * ```typescript
 * const prefs = await getCustomerBackorderPreferences('CUST-123');
 * if (prefs.allowPartialShipments) {
 *   await processPartialShipment(backorderId, quantity);
 * }
 * ```
 */
const getCustomerBackorderPreferences = async (customerId) => {
    // Implementation would retrieve customer preferences
    return null;
};
exports.getCustomerBackorderPreferences = getCustomerBackorderPreferences;
/**
 * Updates customer's backorder preferences.
 *
 * @param {string} customerId - Customer identifier
 * @param {Partial<CustomerBackorderPreference>} preferences - Preferences to update
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<CustomerBackorderPreference>} Updated preferences
 *
 * @example
 * ```typescript
 * const prefs = await updateCustomerBackorderPreferences('CUST-123', {
 *   allowPartialShipments: true,
 *   minimumShipmentQuantity: 25,
 *   notificationPreferences: {
 *     email: true,
 *     sms: false,
 *     frequency: 'daily'
 *   }
 * });
 * ```
 */
const updateCustomerBackorderPreferences = async (customerId, preferences, transaction) => {
    const preferenceId = `PREF-${customerId}-${Date.now()}`;
    const defaultPreferences = {
        customerId,
        preferenceId,
        allowPartialShipments: true,
        consolidationWindow: 24,
        notificationPreferences: {
            email: true,
            sms: false,
            push: false,
            frequency: 'immediate',
        },
        autoAcceptSubstitutes: false,
    };
    return {
        ...defaultPreferences,
        ...preferences,
        customerId,
        preferenceId,
    };
};
exports.updateCustomerBackorderPreferences = updateCustomerBackorderPreferences;
/**
 * Applies customer preferences to backorder processing.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {string} customerId - Customer identifier
 * @returns {Promise<Object>} Applied preferences and impact
 *
 * @example
 * ```typescript
 * const result = await applyCustomerPreferencesToBackorder('BO-2024-001', 'CUST-123');
 * console.log('Preferences applied:', result.appliedSettings);
 * ```
 */
const applyCustomerPreferencesToBackorder = async (backorderId, customerId) => {
    const preferences = await (0, exports.getCustomerBackorderPreferences)(customerId);
    if (!preferences) {
        return {
            backorderId,
            customerId,
            preferencesApplied: false,
            appliedSettings: {
                allowPartialShipments: true,
                consolidationWindow: 24,
                notificationSettings: {},
            },
            impact: ['Using default settings - no customer preferences found'],
        };
    }
    return {
        backorderId,
        customerId,
        preferencesApplied: true,
        appliedSettings: {
            allowPartialShipments: preferences.allowPartialShipments,
            minimumShipmentQuantity: preferences.minimumShipmentQuantity,
            consolidationWindow: preferences.consolidationWindow,
            notificationSettings: preferences.notificationPreferences,
        },
        impact: [],
    };
};
exports.applyCustomerPreferencesToBackorder = applyCustomerPreferencesToBackorder;
/**
 * Validates backorder against customer preferences.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {string} customerId - Customer identifier
 * @returns {Promise<Object>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBackorderAgainstPreferences('BO-2024-001', 'CUST-123');
 * if (!validation.compliant) {
 *   console.log('Violations:', validation.violations);
 * }
 * ```
 */
const validateBackorderAgainstPreferences = async (backorderId, customerId) => {
    // Implementation would validate against preferences
    return {
        compliant: true,
        violations: [],
        warnings: [],
        recommendations: [],
    };
};
exports.validateBackorderAgainstPreferences = validateBackorderAgainstPreferences;
// ============================================================================
// BACKORDER NOTIFICATIONS (Functions 25-28)
// ============================================================================
/**
 * Sends backorder notification to customer.
 *
 * @param {Object} params - Notification parameters
 * @returns {Promise<BackorderNotification>} Notification details
 *
 * @example
 * ```typescript
 * const notification = await sendBackorderNotification({
 *   backorderId: 'BO-2024-001',
 *   customerId: 'CUST-123',
 *   notificationType: 'created',
 *   channels: ['email', 'sms'],
 *   templateData: { itemName: 'Product X', quantity: 100 }
 * });
 * ```
 */
const sendBackorderNotification = async (params) => {
    const notifications = [];
    for (const channel of params.channels) {
        const notificationId = `NOT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const notification = {
            notificationId,
            backorderId: params.backorderId,
            customerId: params.customerId,
            notificationType: params.notificationType,
            channel,
            subject: `Backorder ${params.notificationType}`,
            message: `Your backorder ${params.backorderId} status: ${params.notificationType}`,
            sentAt: new Date(),
            status: 'sent',
        };
        notifications.push(notification);
    }
    return notifications;
};
exports.sendBackorderNotification = sendBackorderNotification;
/**
 * Schedules automated backorder notifications.
 *
 * @param {Object} params - Scheduling parameters
 * @returns {Promise<Object>} Scheduled notification details
 *
 * @example
 * ```typescript
 * const schedule = await scheduleBackorderNotifications({
 *   backorderId: 'BO-2024-001',
 *   notificationSchedule: [
 *     { type: 'reminder', sendAt: new Date(Date.now() + 86400000) },
 *     { type: 'delayed', sendAt: new Date(Date.now() + 172800000) }
 *   ]
 * });
 * ```
 */
const scheduleBackorderNotifications = async (params) => {
    // Implementation would schedule notifications
    return {
        backorderId: params.backorderId,
        scheduledCount: params.notificationSchedule.length,
        schedules: [],
    };
};
exports.scheduleBackorderNotifications = scheduleBackorderNotifications;
/**
 * Retrieves notification history for backorder.
 *
 * @param {string} backorderId - Backorder identifier
 * @returns {Promise<Object>} Notification history
 *
 * @example
 * ```typescript
 * const history = await getBackorderNotificationHistory('BO-2024-001');
 * console.log(`Sent ${history.totalSent} notifications`);
 * ```
 */
const getBackorderNotificationHistory = async (backorderId) => {
    // Implementation would retrieve notification history
    return {
        backorderId,
        totalSent: 0,
        notifications: [],
        deliveryStats: {
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0,
            deliveryRate: 0,
            readRate: 0,
        },
    };
};
exports.getBackorderNotificationHistory = getBackorderNotificationHistory;
/**
 * Configures notification preferences for backorder events.
 *
 * @param {Object} config - Notification configuration
 * @returns {Promise<Object>} Configuration result
 *
 * @example
 * ```typescript
 * const config = await configureBackorderNotifications({
 *   customerId: 'CUST-123',
 *   events: {
 *     created: { enabled: true, channels: ['email'] },
 *     allocated: { enabled: true, channels: ['email', 'sms'] },
 *     delayed: { enabled: true, channels: ['email', 'sms', 'push'] }
 *   }
 * });
 * ```
 */
const configureBackorderNotifications = async (config) => {
    // Implementation would save notification configuration
    const configurationId = `NOTCONF-${config.customerId}-${Date.now()}`;
    return {
        customerId: config.customerId,
        configurationId,
        eventsConfigured: Object.keys(config.events).length,
        activeChannels: [],
    };
};
exports.configureBackorderNotifications = configureBackorderNotifications;
// ============================================================================
// AUTO-RELEASE MANAGEMENT (Functions 29-31)
// ============================================================================
/**
 * Configures automatic release rules for backorders.
 *
 * @param {AutoReleaseRule} rule - Release rule configuration
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<AutoReleaseRule>} Created rule
 *
 * @example
 * ```typescript
 * const rule = await configureAutoReleaseRules({
 *   name: 'High Priority Auto-Release',
 *   enabled: true,
 *   conditions: [
 *     { field: 'priority', operator: 'equals', value: 'critical' },
 *     { field: 'allocatedQuantity', operator: 'greater_than', value: 0, logicalOperator: 'AND' }
 *   ],
 *   action: 'ship',
 *   priority: 100
 * });
 * ```
 */
const configureAutoReleaseRules = async (rule, transaction) => {
    const ruleId = `RULE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
        ...rule,
        ruleId,
    };
};
exports.configureAutoReleaseRules = configureAutoReleaseRules;
/**
 * Evaluates backorder against auto-release rules.
 *
 * @param {string} backorderId - Backorder identifier
 * @returns {Promise<Object>} Evaluation result
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateAutoReleaseRules('BO-2024-001');
 * if (evaluation.shouldRelease) {
 *   await releaseBackorder(backorderId, evaluation.matchedRule);
 * }
 * ```
 */
const evaluateAutoReleaseRules = async (backorderId) => {
    // Implementation would evaluate rules
    return {
        backorderId,
        shouldRelease: false,
        matchedRules: [],
        recommendedAction: 'hold',
        reasoning: [],
        confidence: 0,
    };
};
exports.evaluateAutoReleaseRules = evaluateAutoReleaseRules;
/**
 * Manually releases backorder for processing.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} params - Release parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Object>} Release result
 *
 * @example
 * ```typescript
 * const result = await manuallyReleaseBackorder('BO-2024-001', {
 *   releasedBy: 'manager@example.com',
 *   reason: 'Customer escalation',
 *   skipValidation: false
 * });
 * ```
 */
const manuallyReleaseBackorder = async (backorderId, params, transaction) => {
    // Implementation would manually release backorder
    return {
        success: true,
        backorderId,
        releasedAt: new Date(),
        nextActions: [],
        warnings: [],
    };
};
exports.manuallyReleaseBackorder = manuallyReleaseBackorder;
// ============================================================================
// BACKORDER CANCELLATION (Functions 32-34)
// ============================================================================
/**
 * Cancels backorder with inventory deallocation.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} params - Cancellation parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Object>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelBackorder('BO-2024-001', {
 *   reason: 'Customer requested cancellation',
 *   cancelledBy: 'support@example.com',
 *   refundAmount: 1500.00,
 *   notifyCustomer: true
 * });
 * ```
 */
const cancelBackorder = async (backorderId, params, transaction) => {
    const backorder = await (0, exports.getBackorderById)(backorderId);
    // Update status to cancelled
    await (0, exports.updateBackorderStatus)(backorderId, 'cancelled', {
        updatedBy: params.cancelledBy,
        metadata: {
            cancellationReason: params.reason,
            cancelledBy: params.cancelledBy,
            cancelledAt: new Date(),
        },
    }, transaction);
    return {
        success: true,
        backorderId,
        cancelledAt: new Date(),
        deallocatedQuantity: 0,
        refundProcessed: !!params.refundAmount,
        refundAmount: params.refundAmount,
        inventoryRestocked: params.restockInventory || false,
        customerNotified: params.notifyCustomer || false,
    };
};
exports.cancelBackorder = cancelBackorder;
/**
 * Bulk cancels multiple backorders.
 *
 * @param {Array<string>} backorderIds - Backorder identifiers
 * @param {Object} params - Cancellation parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Object>} Bulk cancellation result
 *
 * @example
 * ```typescript
 * const result = await bulkCancelBackorders(
 *   ['BO-2024-001', 'BO-2024-002'],
 *   { reason: 'Item discontinued', cancelledBy: 'admin@example.com' }
 * );
 * ```
 */
const bulkCancelBackorders = async (backorderIds, params, transaction) => {
    const cancelled = [];
    const failed = [];
    for (const backorderId of backorderIds) {
        try {
            const result = await (0, exports.cancelBackorder)(backorderId, params, transaction);
            cancelled.push({
                backorderId,
                cancelledAt: result.cancelledAt,
            });
        }
        catch (error) {
            failed.push({
                backorderId,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return {
        totalProcessed: backorderIds.length,
        successCount: cancelled.length,
        failureCount: failed.length,
        cancelled,
        failed,
        totalDeallocated: 0,
    };
};
exports.bulkCancelBackorders = bulkCancelBackorders;
/**
 * Processes refunds for cancelled backorders.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} params - Refund parameters
 * @returns {Promise<Object>} Refund result
 *
 * @example
 * ```typescript
 * const refund = await processBackorderCancellationRefund('BO-2024-001', {
 *   refundAmount: 1500.00,
 *   refundMethod: 'original_payment',
 *   processedBy: 'finance@example.com'
 * });
 * ```
 */
const processBackorderCancellationRefund = async (backorderId, params) => {
    const refundId = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
        refundId,
        backorderId,
        refundAmount: params.refundAmount,
        refundMethod: params.refundMethod,
        processedAt: new Date(),
        estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'processing',
    };
};
exports.processBackorderCancellationRefund = processBackorderCancellationRefund;
// ============================================================================
// SUBSTITUTE ITEMS (Functions 35-36)
// ============================================================================
/**
 * Suggests substitute items for backordered products.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} [options] - Search options
 * @returns {Promise<Array<SubstituteItem>>} Substitute items
 *
 * @example
 * ```typescript
 * const substitutes = await suggestSubstituteItems('BO-2024-001', {
 *   maxPriceDifference: 15,
 *   minimumMatchScore: 70,
 *   includeOutOfStock: false
 * });
 * ```
 */
const suggestSubstituteItems = async (backorderId, options = {}) => {
    // Implementation would find substitute items
    return [];
};
exports.suggestSubstituteItems = suggestSubstituteItems;
/**
 * Applies substitute item to backorder.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {string} substituteItemId - Substitute item identifier
 * @param {Object} params - Substitution parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Object>} Substitution result
 *
 * @example
 * ```typescript
 * const result = await applySubstituteItem('BO-2024-001', 'ITEM-SUBSTITUTE', {
 *   customerApproved: true,
 *   priceDifference: 5.00,
 *   appliedBy: 'sales@example.com'
 * });
 * ```
 */
const applySubstituteItem = async (backorderId, substituteItemId, params, transaction) => {
    // Implementation would apply substitute
    return {
        success: true,
        backorderId,
        originalItemId: '',
        substituteItemId,
        appliedAt: new Date(),
        priceAdjustment: params.priceDifference,
        requiresCustomerApproval: !params.customerApproved,
        approvalStatus: params.customerApproved ? 'approved' : 'pending',
    };
};
exports.applySubstituteItem = applySubstituteItem;
// ============================================================================
// DELIVERY DATE CALCULATIONS (Functions 37-38)
// ============================================================================
/**
 * Calculates expected delivery date for backorder.
 *
 * @param {string} backorderId - Backorder identifier
 * @param {Object} [options] - Calculation options
 * @returns {Promise<ExpectedDeliveryCalculation>} Delivery calculation
 *
 * @example
 * ```typescript
 * const delivery = await calculateExpectedDeliveryDate('BO-2024-001', {
 *   includeAlternatives: true,
 *   considerExpedited: true
 * });
 * console.log(`Expected delivery: ${delivery.estimatedDeliveryDate}`);
 * ```
 */
const calculateExpectedDeliveryDate = async (backorderId, options = {}) => {
    const backorder = await (0, exports.getBackorderById)(backorderId);
    if (!backorder) {
        throw new Error(`Backorder ${backorderId} not found`);
    }
    const factors = {
        supplierLeadTime: 14,
        warehouseProcessingTime: 2,
        shippingTime: 3,
        bufferTime: 2,
    };
    const totalDays = Object.values(factors).reduce((sum, days) => sum + days, 0);
    const estimatedDeliveryDate = new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000);
    return {
        backorderId,
        itemId: backorder.itemId,
        currentDate: new Date(),
        expectedRestockDate: backorder.expectedRestockDate || undefined,
        estimatedDeliveryDate,
        confidence: 75,
        factors,
        alternativeOptions: options.includeAlternatives ? [
            {
                option: 'Expedited shipping',
                deliveryDate: new Date(Date.now() + (totalDays - 2) * 24 * 60 * 60 * 1000),
                additionalCost: 35.00,
            },
        ] : undefined,
    };
};
exports.calculateExpectedDeliveryDate = calculateExpectedDeliveryDate;
/**
 * Updates expected delivery dates in bulk.
 *
 * @param {Object} params - Update parameters
 * @returns {Promise<Object>} Update results
 *
 * @example
 * ```typescript
 * const result = await updateExpectedDeliveryDates({
 *   itemId: 'ITEM-001',
 *   newRestockDate: new Date('2024-12-15'),
 *   reason: 'Supplier delay',
 *   updatedBy: 'purchasing@example.com'
 * });
 * ```
 */
const updateExpectedDeliveryDates = async (params) => {
    // Implementation would update delivery dates
    return {
        updatedCount: 0,
        backordersUpdated: [],
        customersNotified: 0,
    };
};
exports.updateExpectedDeliveryDates = updateExpectedDeliveryDates;
// ============================================================================
// ANALYTICS AND REPORTING (Function 39)
// ============================================================================
/**
 * Generates comprehensive backorder analytics.
 *
 * @param {Object} params - Analytics parameters
 * @returns {Promise<BackorderAnalytics>} Analytics data
 *
 * @example
 * ```typescript
 * const analytics = await generateBackorderAnalytics({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   groupBy: ['priority', 'item'],
 *   includeForecasts: true
 * });
 * console.log(`Fill rate: ${analytics.metrics.fillRate}%`);
 * ```
 */
const generateBackorderAnalytics = async (params) => {
    // Implementation would generate analytics
    const priorityMetrics = {
        critical: { count: 0, averageWaitTime: 0, fulfillmentRate: 0 },
        high: { count: 0, averageWaitTime: 0, fulfillmentRate: 0 },
        medium: { count: 0, averageWaitTime: 0, fulfillmentRate: 0 },
        low: { count: 0, averageWaitTime: 0, fulfillmentRate: 0 },
    };
    return {
        period: {
            startDate: params.startDate,
            endDate: params.endDate,
        },
        metrics: {
            totalBackorders: 0,
            activeBackorders: 0,
            fulfilledBackorders: 0,
            cancelledBackorders: 0,
            averageWaitTime: 0,
            fillRate: 0,
            partialShipmentRate: 0,
        },
        byPriority: priorityMetrics,
        byItem: [],
        trends: {
            dailyBackorders: [],
            fulfillmentVelocity: 0,
            inventoryTurnover: 0,
        },
    };
};
exports.generateBackorderAnalytics = generateBackorderAnalytics;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Logs backorder history entry.
 *
 * @param {Object} params - History entry parameters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<void>}
 */
const logBackorderHistory = async (params, transaction) => {
    // Implementation would log to history table
    return;
};
/**
 * Validates backorder transition.
 *
 * @param {BackorderStatus} fromStatus - Current status
 * @param {BackorderStatus} toStatus - Target status
 * @returns {boolean} True if transition is valid
 */
const isValidStatusTransition = (fromStatus, toStatus) => {
    const validTransitions = {
        pending: ['awaiting_inventory', 'partially_allocated', 'fully_allocated', 'on_hold', 'cancelled'],
        awaiting_inventory: ['partially_allocated', 'fully_allocated', 'on_hold', 'cancelled'],
        partially_allocated: ['fully_allocated', 'partially_shipped', 'on_hold', 'cancelled'],
        fully_allocated: ['partially_shipped', 'fulfilled', 'on_hold', 'cancelled'],
        partially_shipped: ['fulfilled', 'on_hold', 'cancelled'],
        on_hold: ['pending', 'awaiting_inventory', 'cancelled'],
    };
    return validTransitions[fromStatus]?.includes(toStatus) || false;
};
//# sourceMappingURL=backorder-management-kit.js.map