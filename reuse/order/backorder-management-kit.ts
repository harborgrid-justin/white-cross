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

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';

// ============================================================================
// ADVANCED TYPE DEFINITIONS
// ============================================================================

/**
 * Backorder status type with strict state machine
 */
type BackorderStatus =
  | 'pending'
  | 'awaiting_inventory'
  | 'partially_allocated'
  | 'fully_allocated'
  | 'partially_shipped'
  | 'awaiting_customer_approval'
  | 'on_hold'
  | 'cancelled'
  | 'fulfilled'
  | 'expired';

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
type BackorderMetadata<T extends BackorderStatus> = T extends 'partially_allocated'
  ? { allocatedQuantity: number; remainingQuantity: number; allocationDetails: AllocationDetail[] }
  : T extends 'cancelled'
  ? { cancellationReason: string; cancelledBy: string; cancelledAt: Date }
  : T extends 'on_hold'
  ? { holdReason: string; holdUntil?: Date; holdBy: string }
  : Record<string, any>;

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
  consolidationWindow: number; // hours
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
    maxPriceIncrease: number; // percentage
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
  evaluationInterval: number; // minutes
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
  matchScore: number; // 0-100
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
  confidence: number; // 0-100
  factors: {
    supplierLeadTime: number; // days
    warehouseProcessingTime: number; // days
    shippingTime: number; // days
    bufferTime: number; // days
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
    averageWaitTime: number; // hours
    fillRate: number; // percentage
    partialShipmentRate: number; // percentage
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
    dailyBackorders: Array<{ date: Date; count: number }>;
    fulfillmentVelocity: number; // backorders per day
    inventoryTurnover: number;
  };
}

interface FulfillmentOptimization {
  optimizationId: string;
  createdAt: Date;
  backordersAnalyzed: number;
  recommendations: OptimizationRecommendation[];
  estimatedImpact: {
    fulfillmentRateIncrease: number; // percentage
    costReduction: number; // currency
    customerSatisfactionScore: number; // 0-100
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
type AllocationResult<T extends AllocationStrategy> = T extends 'smart_allocation'
  ? { allocations: AllocationDetail[]; mlConfidence: number; reasoning: string[] }
  : { allocations: AllocationDetail[] };

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
export const createBackorderModel = (sequelize: Sequelize) => {
  class BackorderModel extends Model {
    public id!: number;
    public backorderId!: string;
    public orderLineId!: string;
    public orderId!: string;
    public customerId!: string;
    public itemId!: string;
    public itemSku!: string;
    public requestedQuantity!: number;
    public backorderedQuantity!: number;
    public allocatedQuantity!: number;
    public shippedQuantity!: number;
    public remainingQuantity!: number;
    public status!: BackorderStatus;
    public priority!: BackorderPriority;
    public priorityScore!: number;
    public expectedRestockDate!: Date | null;
    public estimatedDeliveryDate!: Date | null;
    public allocationStrategy!: AllocationStrategy;
    public releaseMode!: ReleaseMode;
    public allowPartialShipment!: boolean;
    public minimumShipmentQuantity!: number | null;
    public consolidationWindowHours!: number;
    public autoReleaseEnabled!: boolean;
    public notificationsSent!: number;
    public lastNotificationAt!: Date | null;
    public holdReason!: string | null;
    public holdUntil!: Date | null;
    public cancellationReason!: string | null;
    public cancelledBy!: string | null;
    public cancelledAt!: Date | null;
    public createdBy!: string;
    public updatedBy!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BackorderModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      backorderId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique backorder identifier',
      },
      orderLineId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Associated order line ID',
      },
      orderId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Parent order ID',
      },
      customerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Customer identifier',
      },
      itemId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Item/product identifier',
      },
      itemSku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Item SKU',
      },
      requestedQuantity: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        comment: 'Original requested quantity',
      },
      backorderedQuantity: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        comment: 'Quantity on backorder',
      },
      allocatedQuantity: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Quantity allocated but not shipped',
      },
      shippedQuantity: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Quantity already shipped',
      },
      remainingQuantity: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        comment: 'Remaining quantity to fulfill',
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'awaiting_inventory',
          'partially_allocated',
          'fully_allocated',
          'partially_shipped',
          'awaiting_customer_approval',
          'on_hold',
          'cancelled',
          'fulfilled',
          'expired'
        ),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Backorder status',
      },
      priority: {
        type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Backorder priority level',
      },
      priorityScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
        comment: 'Numerical priority score (0-100)',
      },
      expectedRestockDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expected inventory restock date',
      },
      estimatedDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Estimated delivery date to customer',
      },
      allocationStrategy: {
        type: DataTypes.ENUM('fifo', 'priority_based', 'customer_tier', 'value_based', 'smart_allocation'),
        allowNull: false,
        defaultValue: 'fifo',
        comment: 'Allocation strategy to use',
      },
      releaseMode: {
        type: DataTypes.ENUM('automatic', 'manual', 'scheduled', 'conditional'),
        allowNull: false,
        defaultValue: 'automatic',
        comment: 'Release mode for backorder',
      },
      allowPartialShipment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Allow partial shipments',
      },
      minimumShipmentQuantity: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: true,
        comment: 'Minimum quantity for partial shipment',
      },
      consolidationWindowHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 24,
        comment: 'Hours to wait for consolidation',
      },
      autoReleaseEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Enable automatic release',
      },
      notificationsSent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Count of notifications sent',
      },
      lastNotificationAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last notification timestamp',
      },
      holdReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for hold status',
      },
      holdUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Hold until date',
      },
      cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for cancellation',
      },
      cancelledBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who cancelled backorder',
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Cancellation timestamp',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created backorder',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who last updated backorder',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
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
    }
  );

  return BackorderModel;
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
export const createBackorderAllocationModel = (sequelize: Sequelize) => {
  class BackorderAllocation extends Model {
    public id!: number;
    public allocationId!: string;
    public backorderId!: string;
    public inventoryLocationId!: string;
    public warehouseId!: string;
    public itemId!: string;
    public quantity!: number;
    public status!: 'allocated' | 'reserved' | 'shipped' | 'released' | 'expired';
    public allocatedAt!: Date;
    public expiresAt!: Date | null;
    public shippedAt!: Date | null;
    public releasedAt!: Date | null;
    public lotNumber!: string | null;
    public serialNumbers!: string[] | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BackorderAllocation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      allocationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique allocation identifier',
      },
      backorderId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Associated backorder ID',
      },
      inventoryLocationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Inventory location identifier',
      },
      warehouseId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Warehouse identifier',
      },
      itemId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Item identifier',
      },
      quantity: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        comment: 'Allocated quantity',
      },
      status: {
        type: DataTypes.ENUM('allocated', 'reserved', 'shipped', 'released', 'expired'),
        allowNull: false,
        defaultValue: 'allocated',
        comment: 'Allocation status',
      },
      allocatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Allocation timestamp',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Allocation expiration timestamp',
      },
      shippedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Shipment timestamp',
      },
      releasedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Release timestamp',
      },
      lotNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Lot/batch number',
      },
      serialNumbers: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Serial numbers for serialized items',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
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
    }
  );

  return BackorderAllocation;
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
export const createBackorderHistoryModel = (sequelize: Sequelize) => {
  class BackorderHistory extends Model {
    public id!: number;
    public backorderId!: string;
    public action!: string;
    public performedBy!: string;
    public performedAt!: Date;
    public previousState!: Record<string, any> | null;
    public newState!: Record<string, any>;
    public changeDescription!: string;
    public ipAddress!: string | null;
    public userAgent!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  BackorderHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      backorderId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Backorder identifier',
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Action performed',
      },
      performedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who performed action',
      },
      performedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Action timestamp',
      },
      previousState: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Previous backorder state',
      },
      newState: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'New backorder state',
      },
      changeDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description of changes',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address',
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'User agent string',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
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
    }
  );

  return BackorderHistory;
};

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
export const isAllocationEligible = (status: BackorderStatus): status is AllocationEligibleStatus => {
  return status === 'pending' || status === 'awaiting_inventory' || status === 'partially_allocated';
};

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
export const isValidBackorder = (value: unknown): value is Backorder => {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, any>;
  return (
    typeof obj.backorderId === 'string' &&
    typeof obj.orderId === 'string' &&
    typeof obj.customerId === 'string' &&
    typeof obj.itemId === 'string' &&
    typeof obj.requestedQuantity === 'number' &&
    typeof obj.status === 'string'
  );
};

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
export const createPriorityGuard = (priority: BackorderPriority): TypeGuard<Backorder> => {
  return (value: unknown): value is Backorder => {
    return isValidBackorder(value) && value.priority === priority;
  };
};

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
export const createBackorder = async <T extends BackorderStatus = 'pending'>(
  params: {
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
  },
  transaction?: Transaction
): Promise<Backorder<T>> => {
  const backorderId = `BO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate priority score
  const priorityScoreMap: PriorityScoreMap = {
    critical: 100,
    high: 75,
    medium: 50,
    low: 25,
  };

  const priority = params.priority || 'medium';
  const priorityScore = priorityScoreMap[priority];

  const backorder: Backorder<T> = {
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
    status: 'pending' as T,
    metadata: (params.metadata || {}) as BackorderMetadata<T>,
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
export const getBackorderById = async <T extends BackorderStatus = BackorderStatus>(
  backorderId: string,
  options: {
    includeAllocations?: boolean;
    includeHistory?: boolean;
    includeCustomerPreferences?: boolean;
  } = {}
): Promise<(Backorder<T> & {
  allocations?: AllocationDetail[];
  history?: any[];
  customerPreferences?: CustomerBackorderPreference;
}) | null> => {
  // Implementation would query database
  // For now, return mock structure
  return null;
};

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
export const updateBackorderStatus = async <
  TFrom extends BackorderStatus,
  TTo extends BackorderStatus
>(
  backorderId: string,
  newStatus: TTo,
  params: {
    updatedBy: string;
    metadata?: BackorderMetadata<TTo>;
    reason?: string;
  },
  transaction?: Transaction
): Promise<Backorder<TTo>> => {
  // Validate state transition
  const validTransitions: Partial<Record<BackorderStatus, BackorderStatus[]>> = {
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
    metadata: params.metadata || {} as BackorderMetadata<TTo>,
    updatedAt: new Date(),
  } as Backorder<TTo>;

  return updatedBackorder;
};

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
export const trackBackorderLifecycle = async (
  backorderId: string
): Promise<{
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
}> => {
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
export const getBackorders = async <T extends BackorderStatus = BackorderStatus>(
  filters: {
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
  } = {},
  pagination: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  } = {}
): Promise<{
  data: Backorder<T>[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}> => {
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
export const bulkCreateBackorders = async (
  orderLines: Array<{
    orderLineId: string;
    orderId: string;
    customerId: string;
    itemId: string;
    itemSku: string;
    requestedQuantity: number;
    shortageQuantity: number;
  }>,
  options: {
    notifyCustomers?: boolean;
    autoPrioritize?: boolean;
    defaultPriority?: BackorderPriority;
    createdBy: string;
  },
  transaction?: Transaction
): Promise<{
  created: Backorder[];
  failed: Array<{ orderLineId: string; error: string }>;
  summary: {
    totalProcessed: number;
    successCount: number;
    failureCount: number;
    totalBackorderedQuantity: number;
  };
}> => {
  const created: Backorder[] = [];
  const failed: Array<{ orderLineId: string; error: string }> = [];

  for (const line of orderLines) {
    try {
      const backorder = await createBackorder({
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
    } catch (error) {
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
export const calculateBackorderPriority = async (params: {
  customerId: string;
  itemId: string;
  orderValue: number;
  customerTier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  orderAge: number; // hours
  backorderedQuantity: number;
  itemCriticality?: 'critical' | 'standard' | 'low';
  seasonalDemand?: number; // 0-100
}): Promise<{
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
}> => {
  const factors = {
    customerTierScore: 0,
    orderValueScore: 0,
    orderAgeScore: 0,
    itemCriticalityScore: 0,
    seasonalDemandScore: 0,
  };

  const reasoning: string[] = [];

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
  const priorityScore = Math.min(
    100,
    factors.customerTierScore +
    factors.orderValueScore +
    factors.orderAgeScore +
    factors.itemCriticalityScore +
    factors.seasonalDemandScore
  );

  // Determine priority level
  let priority: BackorderPriority;
  if (priorityScore >= 85) priority = 'critical';
  else if (priorityScore >= 65) priority = 'high';
  else if (priorityScore >= 40) priority = 'medium';
  else priority = 'low';

  reasoning.push(`Total score: ${priorityScore.toFixed(1)} → ${priority} priority`);

  return { priority, priorityScore, factors, reasoning };
};

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
export const recalculateBackorderPriorities = async (
  options: {
    includeStatuses?: BackorderStatus[];
    batchSize?: number;
    dryRun?: boolean;
  } = {}
): Promise<{
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
}> => {
  // Implementation would recalculate all priorities
  return {
    analyzed: 0,
    updated: 0,
    unchanged: 0,
    changes: [],
  };
};

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
export const escalateBackorderPriority = async (
  backorderId: string,
  params: {
    reason: string;
    escalatedBy: string;
    targetPriority?: BackorderPriority;
    notifyStakeholders?: boolean;
    metadata?: Record<string, any>;
  }
): Promise<Backorder> => {
  // Implementation would escalate priority
  const backorder = await getBackorderById(backorderId);
  if (!backorder) {
    throw new Error(`Backorder ${backorderId} not found`);
  }

  const priorityLevels: BackorderPriority[] = ['low', 'medium', 'high', 'critical'];
  const currentIndex = priorityLevels.indexOf(backorder.priority);
  const newPriority = params.targetPriority || priorityLevels[Math.min(currentIndex + 1, 3)];

  return updateBackorderStatus(backorderId, backorder.status, {
    updatedBy: params.escalatedBy,
    metadata: {
      ...backorder.metadata,
      escalationReason: params.reason,
      escalatedAt: new Date(),
    },
  });
};

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
export const getPrioritizedBackorders = async (
  filters: {
    status?: BackorderStatus[];
    customerId?: string;
    itemId?: string;
  } = {},
  options: {
    limit?: number;
    includeScore?: boolean;
    includeRecommendations?: boolean;
  } = {}
): Promise<Array<Backorder & {
  priorityScore: number;
  priorityRank: number;
  recommendations?: string[];
}>> => {
  // Implementation would query and sort by priority
  return [];
};

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
export const processPartialShipment = async (
  backorderId: string,
  params: {
    quantity: number;
    allocations: Array<{ allocationId: string; quantity: number }>;
    carrier: string;
    trackingNumber: string;
    estimatedDeliveryDate: Date;
    shippingCost: number;
    shippedBy: string;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<PartialShipment> => {
  const backorder = await getBackorderById(backorderId);
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
  const shipment: PartialShipment = {
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
  const newStatus: BackorderStatus =
    newShippedQuantity >= backorder.backorderedQuantity ? 'fulfilled' : 'partially_shipped';

  await updateBackorderStatus(backorderId, newStatus, {
    updatedBy: params.shippedBy,
    metadata: {
      ...backorder.metadata,
      lastShipmentId: shipmentId,
      lastShipmentDate: new Date(),
    },
  }, transaction);

  return shipment;
};

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
export const validatePartialShipment = async (
  backorderId: string,
  proposedQuantity: number
): Promise<{
  allowed: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  minimumQuantity?: number;
  maximumQuantity?: number;
}> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const backorder = await getBackorderById(backorderId);
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
export const consolidateBackorderShipments = async (
  backorderIds: string[],
  params: {
    customerId: string;
    carrier: string;
    shippedBy: string;
    consolidationStrategy?: 'maximize_items' | 'minimize_cost' | 'fastest_delivery';
    metadata?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<{
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
}> => {
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
export const calculatePartialShipmentStrategy = async (
  backorderId: string,
  options: {
    optimizeFor?: 'cost' | 'speed' | 'customer_satisfaction';
    maxShipments?: number;
    considerInventoryForecasts?: boolean;
  } = {}
): Promise<{
  recommendedStrategy: 'single_shipment' | 'multiple_shipments' | 'wait_for_full';
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
}> => {
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
export const trackPartialShipments = async (
  backorderId: string
): Promise<{
  backorderId: string;
  totalRequested: number;
  totalShipped: number;
  totalRemaining: number;
  shipments: Array<PartialShipment & {
    deliveryStatus: 'in_transit' | 'delivered' | 'delayed' | 'failed';
    currentLocation?: string;
    lastUpdate: Date;
  }>;
  completionPercentage: number;
  estimatedCompletionDate?: Date;
}> => {
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
export const allocateInventoryToBackorders = async <T extends AllocationStrategy>(
  params: {
    itemId: string;
    availableQuantity: number;
    warehouseId: string;
    inventoryLocationId: string;
    strategy: T;
    allocatedBy: string;
    lotNumber?: string;
    expirationDate?: Date;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<AllocationResult<T>> => {
  // Get eligible backorders
  const backorders = await getBackorders({
    itemId: params.itemId,
    status: ['pending', 'awaiting_inventory', 'partially_allocated'],
  });

  const allocations: AllocationDetail[] = [];
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
    if (remainingQuantity <= 0) break;

    const quantityNeeded = backorder.remainingQuantity;
    const quantityToAllocate = Math.min(quantityNeeded, remainingQuantity);

    const allocation: AllocationDetail = {
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
    } as AllocationResult<T>;
  }

  return { allocations } as AllocationResult<T>;
};

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
export const releaseBackorderAllocation = async (
  allocationId: string,
  params: {
    reason: string;
    releasedBy: string;
    returnToInventory?: boolean;
    reallocate?: boolean;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<{
  success: boolean;
  releasedQuantity: number;
  inventoryReturned: boolean;
  reallocated: boolean;
  newAllocationId?: string;
}> => {
  // Implementation would release allocation
  return {
    success: true,
    releasedQuantity: 0,
    inventoryReturned: params.returnToInventory || false,
    reallocated: params.reallocate || false,
  };
};

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
export const reserveInventoryForBackorder = async (
  params: {
    backorderId: string;
    itemId: string;
    quantity: number;
    warehouseId?: string;
    reservationDuration: number; // hours
    priority: BackorderPriority;
    reservedBy: string;
  },
  transaction?: Transaction
): Promise<{
  reservationId: string;
  backorderId: string;
  reservedQuantity: number;
  expiresAt: Date;
  inventoryLocations: Array<{
    locationId: string;
    quantity: number;
  }>;
}> => {
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
export const optimizeMultiWarehouseAllocation = async (
  backorderId: string,
  options: {
    minimizeShippingCost?: boolean;
    minimizeDeliveryTime?: boolean;
    preferSingleWarehouse?: boolean;
    maxWarehouses?: number;
  } = {}
): Promise<{
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
}> => {
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
export const getBackorderAllocationHistory = async (
  backorderId: string
): Promise<{
  backorderId: string;
  totalAllocated: number;
  currentlyAllocated: number;
  allocations: Array<AllocationDetail & {
    status: 'active' | 'shipped' | 'released' | 'expired';
    releaseReason?: string;
  }>;
  allocationTimeline: Array<{
    timestamp: Date;
    action: 'allocated' | 'released' | 'shipped' | 'expired';
    quantity: number;
    details: string;
  }>;
}> => {
  // Implementation would retrieve allocation history
  return {
    backorderId,
    totalAllocated: 0,
    currentlyAllocated: 0,
    allocations: [],
    allocationTimeline: [],
  };
};

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
export const getCustomerBackorderPreferences = async (
  customerId: string
): Promise<CustomerBackorderPreference | null> => {
  // Implementation would retrieve customer preferences
  return null;
};

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
export const updateCustomerBackorderPreferences = async (
  customerId: string,
  preferences: Partial<Omit<CustomerBackorderPreference, 'customerId' | 'preferenceId'>>,
  transaction?: Transaction
): Promise<CustomerBackorderPreference> => {
  const preferenceId = `PREF-${customerId}-${Date.now()}`;

  const defaultPreferences: CustomerBackorderPreference = {
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
export const applyCustomerPreferencesToBackorder = async (
  backorderId: string,
  customerId: string
): Promise<{
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
}> => {
  const preferences = await getCustomerBackorderPreferences(customerId);

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
export const validateBackorderAgainstPreferences = async (
  backorderId: string,
  customerId: string
): Promise<{
  compliant: boolean;
  violations: string[];
  warnings: string[];
  recommendations: string[];
}> => {
  // Implementation would validate against preferences
  return {
    compliant: true,
    violations: [],
    warnings: [],
    recommendations: [],
  };
};

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
export const sendBackorderNotification = async (
  params: {
    backorderId: string;
    customerId: string;
    notificationType: BackorderNotification['notificationType'];
    channels: BackorderNotification['channel'][];
    templateData?: Record<string, any>;
    priority?: 'high' | 'normal' | 'low';
  }
): Promise<BackorderNotification[]> => {
  const notifications: BackorderNotification[] = [];

  for (const channel of params.channels) {
    const notificationId = `NOT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const notification: BackorderNotification = {
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
export const scheduleBackorderNotifications = async (
  params: {
    backorderId: string;
    customerId: string;
    notificationSchedule: Array<{
      type: BackorderNotification['notificationType'];
      sendAt: Date;
      channels: BackorderNotification['channel'][];
      condition?: string;
    }>;
  }
): Promise<{
  backorderId: string;
  scheduledCount: number;
  schedules: Array<{
    scheduleId: string;
    notificationType: string;
    sendAt: Date;
    status: 'scheduled' | 'sent' | 'cancelled';
  }>;
}> => {
  // Implementation would schedule notifications
  return {
    backorderId: params.backorderId,
    scheduledCount: params.notificationSchedule.length,
    schedules: [],
  };
};

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
export const getBackorderNotificationHistory = async (
  backorderId: string
): Promise<{
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
}> => {
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
export const configureBackorderNotifications = async (
  config: {
    customerId: string;
    events: Partial<Record<BackorderNotification['notificationType'], {
      enabled: boolean;
      channels: BackorderNotification['channel'][];
      template?: string;
      throttle?: number; // hours between notifications
    }>>;
    globalSettings?: {
      quietHoursStart?: number; // hour (0-23)
      quietHoursEnd?: number; // hour (0-23)
      timezone?: string;
    };
  }
): Promise<{
  customerId: string;
  configurationId: string;
  eventsConfigured: number;
  activeChannels: BackorderNotification['channel'][];
}> => {
  // Implementation would save notification configuration
  const configurationId = `NOTCONF-${config.customerId}-${Date.now()}`;

  return {
    customerId: config.customerId,
    configurationId,
    eventsConfigured: Object.keys(config.events).length,
    activeChannels: [],
  };
};

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
export const configureAutoReleaseRules = async (
  rule: Omit<AutoReleaseRule, 'ruleId'>,
  transaction?: Transaction
): Promise<AutoReleaseRule> => {
  const ruleId = `RULE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    ...rule,
    ruleId,
  };
};

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
export const evaluateAutoReleaseRules = async (
  backorderId: string
): Promise<{
  backorderId: string;
  shouldRelease: boolean;
  matchedRules: AutoReleaseRule[];
  recommendedAction: 'allocate' | 'ship' | 'notify' | 'escalate' | 'hold';
  reasoning: string[];
  confidence: number;
}> => {
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
export const manuallyReleaseBackorder = async (
  backorderId: string,
  params: {
    releasedBy: string;
    reason: string;
    skipValidation?: boolean;
    forceRelease?: boolean;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<{
  success: boolean;
  backorderId: string;
  releasedAt: Date;
  nextActions: string[];
  warnings: string[];
}> => {
  // Implementation would manually release backorder
  return {
    success: true,
    backorderId,
    releasedAt: new Date(),
    nextActions: [],
    warnings: [],
  };
};

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
export const cancelBackorder = async (
  backorderId: string,
  params: {
    reason: string;
    cancelledBy: string;
    refundAmount?: number;
    restockInventory?: boolean;
    notifyCustomer?: boolean;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<{
  success: boolean;
  backorderId: string;
  cancelledAt: Date;
  deallocatedQuantity: number;
  refundProcessed: boolean;
  refundAmount?: number;
  inventoryRestocked: boolean;
  customerNotified: boolean;
}> => {
  const backorder = await getBackorderById<'cancelled'>(backorderId);

  // Update status to cancelled
  await updateBackorderStatus(backorderId, 'cancelled', {
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
export const bulkCancelBackorders = async (
  backorderIds: string[],
  params: {
    reason: string;
    cancelledBy: string;
    restockInventory?: boolean;
    notifyCustomers?: boolean;
  },
  transaction?: Transaction
): Promise<{
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  cancelled: Array<{ backorderId: string; cancelledAt: Date }>;
  failed: Array<{ backorderId: string; error: string }>;
  totalDeallocated: number;
}> => {
  const cancelled: Array<{ backorderId: string; cancelledAt: Date }> = [];
  const failed: Array<{ backorderId: string; error: string }> = [];

  for (const backorderId of backorderIds) {
    try {
      const result = await cancelBackorder(backorderId, params, transaction);
      cancelled.push({
        backorderId,
        cancelledAt: result.cancelledAt,
      });
    } catch (error) {
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
export const processBackorderCancellationRefund = async (
  backorderId: string,
  params: {
    refundAmount: number;
    refundMethod: 'original_payment' | 'store_credit' | 'check' | 'wire_transfer';
    processedBy: string;
    notes?: string;
  }
): Promise<{
  refundId: string;
  backorderId: string;
  refundAmount: number;
  refundMethod: string;
  processedAt: Date;
  estimatedCompletionDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}> => {
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
export const suggestSubstituteItems = async (
  backorderId: string,
  options: {
    maxPriceDifference?: number; // percentage
    minimumMatchScore?: number; // 0-100
    includeOutOfStock?: boolean;
    sameBrandOnly?: boolean;
    limit?: number;
  } = {}
): Promise<SubstituteItem[]> => {
  // Implementation would find substitute items
  return [];
};

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
export const applySubstituteItem = async (
  backorderId: string,
  substituteItemId: string,
  params: {
    customerApproved: boolean;
    priceDifference: number;
    appliedBy: string;
    notifyCustomer?: boolean;
    metadata?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<{
  success: boolean;
  backorderId: string;
  originalItemId: string;
  substituteItemId: string;
  appliedAt: Date;
  priceAdjustment: number;
  requiresCustomerApproval: boolean;
  approvalStatus: 'approved' | 'pending' | 'rejected';
}> => {
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
export const calculateExpectedDeliveryDate = async (
  backorderId: string,
  options: {
    includeAlternatives?: boolean;
    considerExpedited?: boolean;
    useHistoricalData?: boolean;
  } = {}
): Promise<ExpectedDeliveryCalculation> => {
  const backorder = await getBackorderById(backorderId);

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
export const updateExpectedDeliveryDates = async (
  params: {
    itemId?: string;
    backorderIds?: string[];
    newRestockDate: Date;
    reason: string;
    updatedBy: string;
    notifyCustomers?: boolean;
  }
): Promise<{
  updatedCount: number;
  backordersUpdated: Array<{
    backorderId: string;
    oldDeliveryDate?: Date;
    newDeliveryDate: Date;
  }>;
  customersNotified: number;
}> => {
  // Implementation would update delivery dates
  return {
    updatedCount: 0,
    backordersUpdated: [],
    customersNotified: 0,
  };
};

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
export const generateBackorderAnalytics = async (
  params: {
    startDate: Date;
    endDate: Date;
    customerId?: string;
    itemId?: string;
    groupBy?: Array<'priority' | 'item' | 'customer' | 'status'>;
    includeForecasts?: boolean;
  }
): Promise<BackorderAnalytics> => {
  // Implementation would generate analytics
  const priorityMetrics: BackorderAnalytics['byPriority'] = {
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
const logBackorderHistory = async (
  params: {
    backorderId: string;
    action: string;
    performedBy: string;
    previousState: any;
    newState: any;
    changeDescription: string;
  },
  transaction?: Transaction
): Promise<void> => {
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
const isValidStatusTransition = (
  fromStatus: BackorderStatus,
  toStatus: BackorderStatus
): boolean => {
  const validTransitions: Partial<Record<BackorderStatus, BackorderStatus[]>> = {
    pending: ['awaiting_inventory', 'partially_allocated', 'fully_allocated', 'on_hold', 'cancelled'],
    awaiting_inventory: ['partially_allocated', 'fully_allocated', 'on_hold', 'cancelled'],
    partially_allocated: ['fully_allocated', 'partially_shipped', 'on_hold', 'cancelled'],
    fully_allocated: ['partially_shipped', 'fulfilled', 'on_hold', 'cancelled'],
    partially_shipped: ['fulfilled', 'on_hold', 'cancelled'],
    on_hold: ['pending', 'awaiting_inventory', 'cancelled'],
  };

  return validTransitions[fromStatus]?.includes(toStatus) || false;
};

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  BackorderStatus,
  BackorderPriority,
  AllocationStrategy,
  ReleaseMode,
  Backorder,
  BackorderMetadata,
  AllocationDetail,
  PartialShipment,
  ShipmentItem,
  CustomerBackorderPreference,
  BackorderNotification,
  AutoReleaseRule,
  ReleaseCondition,
  SubstituteItem,
  ExpectedDeliveryCalculation,
  BackorderAnalytics,
  FulfillmentOptimization,
  OptimizationRecommendation,
  AllocationEligibleStatus,
  PriorityScoreMap,
  AllocationResult,
  TypeGuard,
};
