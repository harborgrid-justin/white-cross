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
import { Sequelize, Transaction } from 'sequelize';
/**
 * Backorder status type with strict state machine
 */
type BackorderStatus = 'pending' | 'awaiting_inventory' | 'partially_allocated' | 'fully_allocated' | 'partially_shipped' | 'awaiting_customer_approval' | 'on_hold' | 'cancelled' | 'fulfilled' | 'expired';
/**
 * Priority levels with numeric scores
 */
type BackorderPriority = 'critical' | 'high' | 'medium' | 'low';
/**
 * Allocation strategy types
 */
type AllocationStrategy = 'fifo' | 'priority_based' | 'customer_tier' | 'value_based' | 'smart_allocation';
/**
 * Release modes
 */
type ReleaseMode = 'automatic' | 'manual' | 'scheduled' | 'conditional';
/**
 * Conditional type for backorder metadata based on status
 */
type BackorderMetadata<T extends BackorderStatus> = T extends 'partially_allocated' ? {
    allocatedQuantity: number;
    remainingQuantity: number;
    allocationDetails: AllocationDetail[];
} : T extends 'cancelled' ? {
    cancellationReason: string;
    cancelledBy: string;
    cancelledAt: Date;
} : T extends 'on_hold' ? {
    holdReason: string;
    holdUntil?: Date;
    holdBy: string;
} : Record<string, any>;
/**
 * Mapped type for backorder priority scores
 */
type PriorityScoreMap = {
    [K in BackorderPriority]: number;
};
/**
 * Utility type to extract allocation-eligible backorder statuses
 */
type AllocationEligibleStatus = Extract<BackorderStatus, 'pending' | 'awaiting_inventory' | 'partially_allocated'>;
interface BackorderBase {
    backorderId: string;
    orderLineId: string;
    orderId: string;
    customerId: string;
    itemId: string;
    itemSku: string;
    requestedQuantity: number;
    backorderedQuantity: number;
    allocatedQuantity: number;
    shippedQuantity: number;
    remainingQuantity: number;
    priority: BackorderPriority;
    priorityScore: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Discriminated union for backorder with status-specific data
 */
type Backorder<T extends BackorderStatus = BackorderStatus> = BackorderBase & {
    status: T;
    metadata: BackorderMetadata<T>;
};
interface AllocationDetail {
    allocationId: string;
    inventoryLocationId: string;
    warehouseId: string;
    quantity: number;
    allocatedAt: Date;
    expiresAt?: Date;
    lotNumber?: string;
    serialNumbers?: string[];
}
interface PartialShipment {
    shipmentId: string;
    backorderId: string;
    shippedQuantity: number;
    remainingQuantity: number;
    trackingNumber: string;
    carrier: string;
    shipmentDate: Date;
    estimatedDeliveryDate: Date;
    shippingCost: number;
    items: ShipmentItem[];
}
interface ShipmentItem {
    itemId: string;
    sku: string;
    quantity: number;
    lotNumber?: string;
    serialNumbers?: string[];
    sourceLocation: string;
}
interface CustomerBackorderPreference {
    customerId: string;
    preferenceId: string;
    allowPartialShipments: boolean;
    minimumShipmentQuantity?: number;
    minimumShipmentValue?: number;
    consolidationWindow: number;
    preferredCarrier?: string;
    notificationPreferences: {
        email: boolean;
        sms: boolean;
        push: boolean;
        frequency: 'immediate' | 'daily' | 'weekly';
    };
    autoAcceptSubstitutes: boolean;
    substitutePreferences?: {
        allowHigherPrice: boolean;
        maxPriceIncrease: number;
        allowDifferentBrand: boolean;
    };
}
interface BackorderNotification {
    notificationId: string;
    backorderId: string;
    customerId: string;
    notificationType: 'created' | 'allocated' | 'partially_shipped' | 'delayed' | 'fulfilled' | 'cancelled';
    channel: 'email' | 'sms' | 'push' | 'webhook';
    subject: string;
    message: string;
    sentAt: Date;
    deliveredAt?: Date;
    readAt?: Date;
    status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
}
interface AutoReleaseRule {
    ruleId: string;
    name: string;
    enabled: boolean;
    conditions: ReleaseCondition[];
    action: 'allocate' | 'ship' | 'notify' | 'escalate';
    priority: number;
    evaluationInterval: number;
    metadata: Record<string, any>;
}
interface ReleaseCondition {
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'exists';
    value: any;
    logicalOperator?: 'AND' | 'OR';
}
interface SubstituteItem {
    itemId: string;
    sku: string;
    name: string;
    description: string;
    matchScore: number;
    priceComparison: {
        originalPrice: number;
        substitutePrice: number;
        priceDifference: number;
        percentageDifference: number;
    };
    availability: {
        inStock: boolean;
        availableQuantity: number;
        expectedRestockDate?: Date;
    };
    similarityFactors: {
        category: boolean;
        brand: boolean;
        specifications: boolean;
        customerRating: number;
    };
}
interface ExpectedDeliveryCalculation {
    backorderId: string;
    itemId: string;
    currentDate: Date;
    expectedRestockDate?: Date;
    estimatedDeliveryDate?: Date;
    confidence: number;
    factors: {
        supplierLeadTime: number;
        warehouseProcessingTime: number;
        shippingTime: number;
        bufferTime: number;
    };
    alternativeOptions?: Array<{
        option: string;
        deliveryDate: Date;
        additionalCost: number;
    }>;
}
interface BackorderAnalytics {
    period: {
        startDate: Date;
        endDate: Date;
    };
    metrics: {
        totalBackorders: number;
        activeBackorders: number;
        fulfilledBackorders: number;
        cancelledBackorders: number;
        averageWaitTime: number;
        fillRate: number;
        partialShipmentRate: number;
    };
    byPriority: {
        [K in BackorderPriority]: {
            count: number;
            averageWaitTime: number;
            fulfillmentRate: number;
        };
    };
    byItem: Array<{
        itemId: string;
        sku: string;
        backorderCount: number;
        totalQuantity: number;
        averageWaitTime: number;
    }>;
    trends: {
        dailyBackorders: Array<{
            date: Date;
            count: number;
        }>;
        fulfillmentVelocity: number;
        inventoryTurnover: number;
    };
}
interface FulfillmentOptimization {
    optimizationId: string;
    createdAt: Date;
    backordersAnalyzed: number;
    recommendations: OptimizationRecommendation[];
    estimatedImpact: {
        fulfillmentRateIncrease: number;
        costReduction: number;
        customerSatisfactionScore: number;
    };
    implementationPlan: {
        immediateActions: string[];
        shortTermActions: string[];
        longTermActions: string[];
    };
}
interface OptimizationRecommendation {
    recommendationId: string;
    type: 'inventory' | 'allocation' | 'shipping' | 'supplier' | 'customer_service';
    priority: BackorderPriority;
    description: string;
    expectedBenefit: string;
    estimatedCost: number;
    implementationComplexity: 'low' | 'medium' | 'high';
    data: Record<string, any>;
}
/**
 * Generic type guard factory
 */
type TypeGuard<T> = (value: unknown) => value is T;
/**
 * Conditional type for allocation results based on strategy
 */
type AllocationResult<T extends AllocationStrategy> = T extends 'smart_allocation' ? {
    allocations: AllocationDetail[];
    mlConfidence: number;
    reasoning: string[];
} : {
    allocations: AllocationDetail[];
};
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
export declare const createBackorderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        backorderId: string;
        orderLineId: string;
        orderId: string;
        customerId: string;
        itemId: string;
        itemSku: string;
        requestedQuantity: number;
        backorderedQuantity: number;
        allocatedQuantity: number;
        shippedQuantity: number;
        remainingQuantity: number;
        status: BackorderStatus;
        priority: BackorderPriority;
        priorityScore: number;
        expectedRestockDate: Date | null;
        estimatedDeliveryDate: Date | null;
        allocationStrategy: AllocationStrategy;
        releaseMode: ReleaseMode;
        allowPartialShipment: boolean;
        minimumShipmentQuantity: number | null;
        consolidationWindowHours: number;
        autoReleaseEnabled: boolean;
        notificationsSent: number;
        lastNotificationAt: Date | null;
        holdReason: string | null;
        holdUntil: Date | null;
        cancellationReason: string | null;
        cancelledBy: string | null;
        cancelledAt: Date | null;
        createdBy: string;
        updatedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createBackorderAllocationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        allocationId: string;
        backorderId: string;
        inventoryLocationId: string;
        warehouseId: string;
        itemId: string;
        quantity: number;
        status: "allocated" | "reserved" | "shipped" | "released" | "expired";
        allocatedAt: Date;
        expiresAt: Date | null;
        shippedAt: Date | null;
        releasedAt: Date | null;
        lotNumber: string | null;
        serialNumbers: string[] | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createBackorderHistoryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        backorderId: string;
        action: string;
        performedBy: string;
        performedAt: Date;
        previousState: Record<string, any> | null;
        newState: Record<string, any>;
        changeDescription: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
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
export declare const isAllocationEligible: (status: BackorderStatus) => status is AllocationEligibleStatus;
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
export declare const isValidBackorder: (value: unknown) => value is Backorder;
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
export declare const createPriorityGuard: (priority: BackorderPriority) => TypeGuard<Backorder>;
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
export declare const createBackorder: <T extends BackorderStatus = "pending">(params: {
    orderId: string;
    orderLineId: string;
    customerId: string;
    itemId: string;
    itemSku: string;
    requestedQuantity: number;
    backorderedQuantity: number;
    priority?: BackorderPriority;
    allocationStrategy?: AllocationStrategy;
    releaseMode?: ReleaseMode;
    allowPartialShipment?: boolean;
    minimumShipmentQuantity?: number;
    createdBy: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction) => Promise<Backorder<T>>;
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
export declare const getBackorderById: <T extends BackorderStatus = BackorderStatus>(backorderId: string, options?: {
    includeAllocations?: boolean;
    includeHistory?: boolean;
    includeCustomerPreferences?: boolean;
}) => Promise<(Backorder<T> & {
    allocations?: AllocationDetail[];
    history?: any[];
    customerPreferences?: CustomerBackorderPreference;
}) | null>;
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
export declare const updateBackorderStatus: <TFrom extends BackorderStatus, TTo extends BackorderStatus>(backorderId: string, newStatus: TTo, params: {
    updatedBy: string;
    metadata?: BackorderMetadata<TTo>;
    reason?: string;
}, transaction?: Transaction) => Promise<Backorder<TTo>>;
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
export declare const trackBackorderLifecycle: (backorderId: string) => Promise<{
    backorderId: string;
    currentStatus: BackorderStatus;
    ageInHours: number;
    timeInEachStatus: Partial<Record<BackorderStatus, number>>;
    milestones: Array<{
        status: BackorderStatus;
        timestamp: Date;
        duration: number;
    }>;
    slaCompliance: {
        withinSla: boolean;
        slaThresholdHours: number;
        currentAgeHours: number;
    };
}>;
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
export declare const getBackorders: <T extends BackorderStatus = BackorderStatus>(filters?: {
    status?: T | T[];
    priority?: BackorderPriority | BackorderPriority[];
    customerId?: string;
    itemId?: string;
    itemSku?: string;
    orderId?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    expectedRestockBefore?: Date;
    allocationStrategy?: AllocationStrategy;
}, pagination?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}) => Promise<{
    data: Backorder<T>[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}>;
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
export declare const bulkCreateBackorders: (orderLines: Array<{
    orderLineId: string;
    orderId: string;
    customerId: string;
    itemId: string;
    itemSku: string;
    requestedQuantity: number;
    shortageQuantity: number;
}>, options: {
    notifyCustomers?: boolean;
    autoPrioritize?: boolean;
    defaultPriority?: BackorderPriority;
    createdBy: string;
}, transaction?: Transaction) => Promise<{
    created: Backorder[];
    failed: Array<{
        orderLineId: string;
        error: string;
    }>;
    summary: {
        totalProcessed: number;
        successCount: number;
        failureCount: number;
        totalBackorderedQuantity: number;
    };
}>;
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
export declare const calculateBackorderPriority: (params: {
    customerId: string;
    itemId: string;
    orderValue: number;
    customerTier?: "platinum" | "gold" | "silver" | "bronze";
    orderAge: number;
    backorderedQuantity: number;
    itemCriticality?: "critical" | "standard" | "low";
    seasonalDemand?: number;
}) => Promise<{
    priority: BackorderPriority;
    priorityScore: number;
    factors: {
        customerTierScore: number;
        orderValueScore: number;
        orderAgeScore: number;
        itemCriticalityScore: number;
        seasonalDemandScore: number;
    };
    reasoning: string[];
}>;
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
export declare const recalculateBackorderPriorities: (options?: {
    includeStatuses?: BackorderStatus[];
    batchSize?: number;
    dryRun?: boolean;
}) => Promise<{
    analyzed: number;
    updated: number;
    unchanged: number;
    changes: Array<{
        backorderId: string;
        oldPriority: BackorderPriority;
        newPriority: BackorderPriority;
        oldScore: number;
        newScore: number;
    }>;
}>;
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
export declare const escalateBackorderPriority: (backorderId: string, params: {
    reason: string;
    escalatedBy: string;
    targetPriority?: BackorderPriority;
    notifyStakeholders?: boolean;
    metadata?: Record<string, any>;
}) => Promise<Backorder>;
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
export declare const getPrioritizedBackorders: (filters?: {
    status?: BackorderStatus[];
    customerId?: string;
    itemId?: string;
}, options?: {
    limit?: number;
    includeScore?: boolean;
    includeRecommendations?: boolean;
}) => Promise<Array<Backorder & {
    priorityScore: number;
    priorityRank: number;
    recommendations?: string[];
}>>;
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
export declare const processPartialShipment: (backorderId: string, params: {
    quantity: number;
    allocations: Array<{
        allocationId: string;
        quantity: number;
    }>;
    carrier: string;
    trackingNumber: string;
    estimatedDeliveryDate: Date;
    shippingCost: number;
    shippedBy: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction) => Promise<PartialShipment>;
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
export declare const validatePartialShipment: (backorderId: string, proposedQuantity: number) => Promise<{
    allowed: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
    minimumQuantity?: number;
    maximumQuantity?: number;
}>;
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
export declare const consolidateBackorderShipments: (backorderIds: string[], params: {
    customerId: string;
    carrier: string;
    shippedBy: string;
    consolidationStrategy?: "maximize_items" | "minimize_cost" | "fastest_delivery";
    metadata?: Record<string, any>;
}, transaction?: Transaction) => Promise<{
    consolidatedShipmentId: string;
    backorders: Array<{
        backorderId: string;
        quantity: number;
    }>;
    totalItems: number;
    totalWeight: number;
    estimatedCost: number;
    estimatedDeliveryDate: Date;
    savings: {
        individualShippingCost: number;
        consolidatedShippingCost: number;
        savingsAmount: number;
        savingsPercentage: number;
    };
}>;
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
export declare const calculatePartialShipmentStrategy: (backorderId: string, options?: {
    optimizeFor?: "cost" | "speed" | "customer_satisfaction";
    maxShipments?: number;
    considerInventoryForecasts?: boolean;
}) => Promise<{
    recommendedStrategy: "single_shipment" | "multiple_shipments" | "wait_for_full";
    shipmentPlan: Array<{
        shipmentNumber: number;
        quantity: number;
        estimatedDate: Date;
        estimatedCost: number;
        inventorySource: string;
    }>;
    analysis: {
        totalCost: number;
        totalTime: number;
        customerSatisfactionScore: number;
        reasoning: string[];
    };
}>;
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
export declare const trackPartialShipments: (backorderId: string) => Promise<{
    backorderId: string;
    totalRequested: number;
    totalShipped: number;
    totalRemaining: number;
    shipments: Array<PartialShipment & {
        deliveryStatus: "in_transit" | "delivered" | "delayed" | "failed";
        currentLocation?: string;
        lastUpdate: Date;
    }>;
    completionPercentage: number;
    estimatedCompletionDate?: Date;
}>;
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
export declare const allocateInventoryToBackorders: <T extends AllocationStrategy>(params: {
    itemId: string;
    availableQuantity: number;
    warehouseId: string;
    inventoryLocationId: string;
    strategy: T;
    allocatedBy: string;
    lotNumber?: string;
    expirationDate?: Date;
    metadata?: Record<string, any>;
}, transaction?: Transaction) => Promise<AllocationResult<T>>;
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
export declare const releaseBackorderAllocation: (allocationId: string, params: {
    reason: string;
    releasedBy: string;
    returnToInventory?: boolean;
    reallocate?: boolean;
    metadata?: Record<string, any>;
}, transaction?: Transaction) => Promise<{
    success: boolean;
    releasedQuantity: number;
    inventoryReturned: boolean;
    reallocated: boolean;
    newAllocationId?: string;
}>;
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
export declare const reserveInventoryForBackorder: (params: {
    backorderId: string;
    itemId: string;
    quantity: number;
    warehouseId?: string;
    reservationDuration: number;
    priority: BackorderPriority;
    reservedBy: string;
}, transaction?: Transaction) => Promise<{
    reservationId: string;
    backorderId: string;
    reservedQuantity: number;
    expiresAt: Date;
    inventoryLocations: Array<{
        locationId: string;
        quantity: number;
    }>;
}>;
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
export declare const optimizeMultiWarehouseAllocation: (backorderId: string, options?: {
    minimizeShippingCost?: boolean;
    minimizeDeliveryTime?: boolean;
    preferSingleWarehouse?: boolean;
    maxWarehouses?: number;
}) => Promise<{
    recommendedAllocation: Array<{
        warehouseId: string;
        quantity: number;
        shippingCost: number;
        deliveryDays: number;
        distance: number;
    }>;
    totalCost: number;
    totalDeliveryTime: number;
    warehousesUsed: number;
    savingsVsSuboptimal: {
        costSavings: number;
        timeSavings: number;
    };
}>;
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
export declare const getBackorderAllocationHistory: (backorderId: string) => Promise<{
    backorderId: string;
    totalAllocated: number;
    currentlyAllocated: number;
    allocations: Array<AllocationDetail & {
        status: "active" | "shipped" | "released" | "expired";
        releaseReason?: string;
    }>;
    allocationTimeline: Array<{
        timestamp: Date;
        action: "allocated" | "released" | "shipped" | "expired";
        quantity: number;
        details: string;
    }>;
}>;
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
export declare const getCustomerBackorderPreferences: (customerId: string) => Promise<CustomerBackorderPreference | null>;
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
export declare const updateCustomerBackorderPreferences: (customerId: string, preferences: Partial<Omit<CustomerBackorderPreference, "customerId" | "preferenceId">>, transaction?: Transaction) => Promise<CustomerBackorderPreference>;
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
export declare const applyCustomerPreferencesToBackorder: (backorderId: string, customerId: string) => Promise<{
    backorderId: string;
    customerId: string;
    preferencesApplied: boolean;
    appliedSettings: {
        allowPartialShipments: boolean;
        minimumShipmentQuantity?: number;
        consolidationWindow: number;
        notificationSettings: any;
    };
    impact: string[];
}>;
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
export declare const validateBackorderAgainstPreferences: (backorderId: string, customerId: string) => Promise<{
    compliant: boolean;
    violations: string[];
    warnings: string[];
    recommendations: string[];
}>;
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
export declare const sendBackorderNotification: (params: {
    backorderId: string;
    customerId: string;
    notificationType: BackorderNotification["notificationType"];
    channels: BackorderNotification["channel"][];
    templateData?: Record<string, any>;
    priority?: "high" | "normal" | "low";
}) => Promise<BackorderNotification[]>;
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
export declare const scheduleBackorderNotifications: (params: {
    backorderId: string;
    customerId: string;
    notificationSchedule: Array<{
        type: BackorderNotification["notificationType"];
        sendAt: Date;
        channels: BackorderNotification["channel"][];
        condition?: string;
    }>;
}) => Promise<{
    backorderId: string;
    scheduledCount: number;
    schedules: Array<{
        scheduleId: string;
        notificationType: string;
        sendAt: Date;
        status: "scheduled" | "sent" | "cancelled";
    }>;
}>;
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
export declare const getBackorderNotificationHistory: (backorderId: string) => Promise<{
    backorderId: string;
    totalSent: number;
    notifications: BackorderNotification[];
    deliveryStats: {
        sent: number;
        delivered: number;
        read: number;
        failed: number;
        deliveryRate: number;
        readRate: number;
    };
}>;
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
export declare const configureBackorderNotifications: (config: {
    customerId: string;
    events: Partial<Record<BackorderNotification["notificationType"], {
        enabled: boolean;
        channels: BackorderNotification["channel"][];
        template?: string;
        throttle?: number;
    }>>;
    globalSettings?: {
        quietHoursStart?: number;
        quietHoursEnd?: number;
        timezone?: string;
    };
}) => Promise<{
    customerId: string;
    configurationId: string;
    eventsConfigured: number;
    activeChannels: BackorderNotification["channel"][];
}>;
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
export declare const configureAutoReleaseRules: (rule: Omit<AutoReleaseRule, "ruleId">, transaction?: Transaction) => Promise<AutoReleaseRule>;
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
export declare const evaluateAutoReleaseRules: (backorderId: string) => Promise<{
    backorderId: string;
    shouldRelease: boolean;
    matchedRules: AutoReleaseRule[];
    recommendedAction: "allocate" | "ship" | "notify" | "escalate" | "hold";
    reasoning: string[];
    confidence: number;
}>;
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
export declare const manuallyReleaseBackorder: (backorderId: string, params: {
    releasedBy: string;
    reason: string;
    skipValidation?: boolean;
    forceRelease?: boolean;
    metadata?: Record<string, any>;
}, transaction?: Transaction) => Promise<{
    success: boolean;
    backorderId: string;
    releasedAt: Date;
    nextActions: string[];
    warnings: string[];
}>;
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
export declare const cancelBackorder: (backorderId: string, params: {
    reason: string;
    cancelledBy: string;
    refundAmount?: number;
    restockInventory?: boolean;
    notifyCustomer?: boolean;
    metadata?: Record<string, any>;
}, transaction?: Transaction) => Promise<{
    success: boolean;
    backorderId: string;
    cancelledAt: Date;
    deallocatedQuantity: number;
    refundProcessed: boolean;
    refundAmount?: number;
    inventoryRestocked: boolean;
    customerNotified: boolean;
}>;
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
export declare const bulkCancelBackorders: (backorderIds: string[], params: {
    reason: string;
    cancelledBy: string;
    restockInventory?: boolean;
    notifyCustomers?: boolean;
}, transaction?: Transaction) => Promise<{
    totalProcessed: number;
    successCount: number;
    failureCount: number;
    cancelled: Array<{
        backorderId: string;
        cancelledAt: Date;
    }>;
    failed: Array<{
        backorderId: string;
        error: string;
    }>;
    totalDeallocated: number;
}>;
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
export declare const processBackorderCancellationRefund: (backorderId: string, params: {
    refundAmount: number;
    refundMethod: "original_payment" | "store_credit" | "check" | "wire_transfer";
    processedBy: string;
    notes?: string;
}) => Promise<{
    refundId: string;
    backorderId: string;
    refundAmount: number;
    refundMethod: string;
    processedAt: Date;
    estimatedCompletionDate: Date;
    status: "pending" | "processing" | "completed" | "failed";
}>;
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
export declare const suggestSubstituteItems: (backorderId: string, options?: {
    maxPriceDifference?: number;
    minimumMatchScore?: number;
    includeOutOfStock?: boolean;
    sameBrandOnly?: boolean;
    limit?: number;
}) => Promise<SubstituteItem[]>;
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
export declare const applySubstituteItem: (backorderId: string, substituteItemId: string, params: {
    customerApproved: boolean;
    priceDifference: number;
    appliedBy: string;
    notifyCustomer?: boolean;
    metadata?: Record<string, any>;
}, transaction?: Transaction) => Promise<{
    success: boolean;
    backorderId: string;
    originalItemId: string;
    substituteItemId: string;
    appliedAt: Date;
    priceAdjustment: number;
    requiresCustomerApproval: boolean;
    approvalStatus: "approved" | "pending" | "rejected";
}>;
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
export declare const calculateExpectedDeliveryDate: (backorderId: string, options?: {
    includeAlternatives?: boolean;
    considerExpedited?: boolean;
    useHistoricalData?: boolean;
}) => Promise<ExpectedDeliveryCalculation>;
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
export declare const updateExpectedDeliveryDates: (params: {
    itemId?: string;
    backorderIds?: string[];
    newRestockDate: Date;
    reason: string;
    updatedBy: string;
    notifyCustomers?: boolean;
}) => Promise<{
    updatedCount: number;
    backordersUpdated: Array<{
        backorderId: string;
        oldDeliveryDate?: Date;
        newDeliveryDate: Date;
    }>;
    customersNotified: number;
}>;
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
export declare const generateBackorderAnalytics: (params: {
    startDate: Date;
    endDate: Date;
    customerId?: string;
    itemId?: string;
    groupBy?: Array<"priority" | "item" | "customer" | "status">;
    includeForecasts?: boolean;
}) => Promise<BackorderAnalytics>;
export type { BackorderStatus, BackorderPriority, AllocationStrategy, ReleaseMode, Backorder, BackorderMetadata, AllocationDetail, PartialShipment, ShipmentItem, CustomerBackorderPreference, BackorderNotification, AutoReleaseRule, ReleaseCondition, SubstituteItem, ExpectedDeliveryCalculation, BackorderAnalytics, FulfillmentOptimization, OptimizationRecommendation, AllocationEligibleStatus, PriorityScoreMap, AllocationResult, TypeGuard, };
//# sourceMappingURL=backorder-management-kit.d.ts.map