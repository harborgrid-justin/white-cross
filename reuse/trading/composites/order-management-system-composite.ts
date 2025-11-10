/**
 * LOC: TRDCOMP-OMS-001
 * File: /reuse/trading/composites/order-management-system-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *   - sequelize-typescript (v2.x)
 *   - ../trading-order-models-kit
 *   - ../trading-execution-service-kit
 *
 * DOWNSTREAM (imported by):
 *   - Order management controllers
 *   - Trading execution services
 *   - Market connectivity gateways
 *   - Compliance and surveillance systems
 *   - Risk management modules
 *   - Settlement and clearing services
 */

/**
 * File: /reuse/trading/composites/order-management-system-composite.ts
 * Locator: WC-COMP-TRADING-OMS-001
 * Purpose: Bloomberg Terminal-Level Order Management System - Comprehensive order lifecycle, routing, execution, compliance
 *
 * Upstream: @nestjs/common, sequelize, trading-order-models-kit, trading-execution-service-kit
 * Downstream: Trading controllers, execution services, OMS systems, EMS platforms, compliance modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, PostgreSQL 14+
 * Exports: 44 composed functions for institutional-grade order management and execution
 *
 * LLM Context: Enterprise Bloomberg Terminal-competing order management system for institutional trading.
 * Provides comprehensive order lifecycle management, smart order routing (SOR), algorithmic execution
 * (TWAP, VWAP, POV, IS), direct market access (DMA), multi-venue routing, basket orders, parent/child
 * relationships, order allocation, fill management, pre/post-trade compliance, order audit trail,
 * execution quality analysis, best execution reporting, and regulatory compliance (MiFID II, Reg NMS).
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
  Optional,
} from 'sequelize';

// Import from trading kits
import {
  createOrder,
  validateOrderParameters,
  validateOrderCompliance,
  enrichOrderWithDefaults,
  calculateOrderValue,
  validateOrderRiskLimits,
  generateClientOrderId,
  submitOrder,
  amendOrder,
  cancelOrder,
  getOrderStatus,
  trackOrderLifecycle,
  getOrderFills,
  replaceOrder,
  processExecution,
  recordFill,
  calculateAveragePrice,
  updateOrderQuantities,
  finalizeOrder,
  calculateExecutionSlippage,
  generateExecutionQualityMetrics,
  routeOrder,
  selectBestVenue,
  applyRoutingRules,
  validateVenueConnectivity,
  handleRoutingFailure,
  getRoutingStatistics,
  optimizeMultiVenueSplitting,
  createTWAPOrder,
  createVWAPOrder,
  createIcebergOrder,
  executeAlgorithmicSlice,
  monitorAlgorithmicProgress,
  adjustAlgorithmicParameters,
  pauseAlgorithmicOrder,
  allocateFills,
  calculateAllocationShares,
  validateAllocation,
  processAllocationAmendment,
  generateAllocationReport,
  autoAllocateFills,
  confirmAllocation,
  auditOrderLifecycle,
  validatePreTradeCompliance,
  validatePostTradeCompliance,
  generateOrderAuditTrail,
  exportOrdersForRegulatory,
  detectWashSales,
} from '../trading-order-models-kit';

import {
  placeOrder,
  placeBasketOrder,
  placeAlgorithmicOrder,
  placeDMAOrder,
  modifyOrder,
  cancelAllOrders,
  smartRouteOrder,
  executeSmartRoutedOrder,
  calculateBestVenue,
  optimizeRoutingStrategy,
  executeTWAP,
  executeVWAP,
  executePOV,
  executeImplementationShortfall,
  monitorAlgorithmicExecution,
  performPreTradeCompliance,
  checkPositionLimits,
  checkTradingLimits,
  checkRestrictedSecurities,
  checkConcentrationLimits,
  checkRegulatoryRestrictions,
  checkShortSaleRestrictions,
  checkMarketHours,
  processExecutionReport,
  allocateTrade,
  generateSettlementInstructions,
  analyzeExecutionQuality,
  generateBestExecutionReport,
  estimateMarketImpact,
} from '../trading-execution-service-kit';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Order types following FIX Protocol and Bloomberg Terminal standards
 */
export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT',
  MARKET_ON_CLOSE = 'MOC',
  LIMIT_ON_CLOSE = 'LOC',
  ICEBERG = 'ICEBERG',
  TWAP = 'TWAP',
  VWAP = 'VWAP',
  POV = 'POV',
  PEG = 'PEGGED',
  TRAILING_STOP = 'TRAILING_STOP',
}

/**
 * Order side enumeration
 */
export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
  SELL_SHORT = 'SELL_SHORT',
  SELL_SHORT_EXEMPT = 'SELL_SHORT_EXEMPT',
}

/**
 * Order status following FIX Protocol lifecycle
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  NEW = 'NEW',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FILLED = 'FILLED',
  PENDING_CANCEL = 'PENDING_CANCEL',
  CANCELLED = 'CANCELLED',
  PENDING_REPLACE = 'PENDING_REPLACE',
  REPLACED = 'REPLACED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Time in force instructions
 */
export enum TimeInForce {
  DAY = 'DAY',
  GTC = 'GTC',
  IOC = 'IOC',
  FOK = 'FOK',
  GTD = 'GTD',
  ATO = 'ATO',
  ATC = 'ATC',
}

/**
 * Execution venue types
 */
export enum ExecutionVenue {
  NYSE = 'NYSE',
  NASDAQ = 'NASDAQ',
  BATS = 'BATS',
  IEX = 'IEX',
  ARCA = 'ARCA',
  DARK_POOL = 'DARK_POOL',
  OTC = 'OTC',
  INTERNAL = 'INTERNAL',
}

/**
 * Algorithmic execution strategies
 */
export enum AlgorithmType {
  TWAP = 'TWAP',
  VWAP = 'VWAP',
  POV = 'POV',
  IS = 'IS',
  ARRIVAL_PRICE = 'ARRIVAL_PRICE',
  TARGET_CLOSE = 'TARGET_CLOSE',
  SMART_DARK = 'SMART_DARK',
  LIQUIDITY_SEEKING = 'LIQUIDITY_SEEKING',
}

/**
 * Order routing strategy types
 */
export enum RoutingStrategy {
  BEST_EXECUTION = 'BEST_EXECUTION',
  LOWEST_COST = 'LOWEST_COST',
  FASTEST = 'FASTEST',
  DARK_POOL = 'DARK_POOL',
  CUSTOM = 'CUSTOM',
}

/**
 * Fill allocation methods
 */
export enum AllocationMethod {
  PRO_RATA = 'PRO_RATA',
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  AVERAGE_PRICE = 'AVERAGE_PRICE',
  MANUAL = 'MANUAL',
}

// ============================================================================
// SEQUELIZE MODEL: TradingOrder
// ============================================================================

/**
 * TypeScript interface for TradingOrder attributes
 */
export interface TradingOrderAttributes {
  id: string;
  orderId: string;
  clientOrderId: string;
  parentOrderId: string | null;
  basketOrderId: string | null;
  securityId: string;
  symbol: string;
  securityType: string;
  orderType: OrderType;
  side: OrderSide;
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  price: number | null;
  stopPrice: number | null;
  limitPrice: number | null;
  averagePrice: number | null;
  timeInForce: TimeInForce;
  orderStatus: OrderStatus;
  executionInstructions: string[];
  account: string;
  portfolio: string;
  strategy: string | null;
  trader: string;
  traderId: string;
  desk: string | null;
  submittedAt: Date;
  submittedAtMicros: number;
  acknowledgedAt: Date | null;
  lastUpdatedAt: Date;
  completedAt: Date | null;
  venue: string | null;
  broker: string | null;
  commission: number;
  fees: number;
  settlementDate: Date | null;
  currency: string;
  exchangeOrderId: string | null;
  fixMessageId: string | null;
  routingStrategy: RoutingStrategy | null;
  algorithmType: AlgorithmType | null;
  algorithmParams: Record<string, any> | null;
  complianceChecks: Record<string, any>;
  riskLimits: Record<string, any>;
  text: string | null;
  metadata: Record<string, any>;
  isActive: boolean;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface TradingOrderCreationAttributes
  extends Optional<TradingOrderAttributes, 'id' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: TradingOrder
 * Main order entity for Bloomberg Terminal-level order management
 */
export class TradingOrder
  extends Model<TradingOrderAttributes, TradingOrderCreationAttributes>
  implements TradingOrderAttributes
{
  declare id: string;
  declare orderId: string;
  declare clientOrderId: string;
  declare parentOrderId: string | null;
  declare basketOrderId: string | null;
  declare securityId: string;
  declare symbol: string;
  declare securityType: string;
  declare orderType: OrderType;
  declare side: OrderSide;
  declare quantity: number;
  declare filledQuantity: number;
  declare remainingQuantity: number;
  declare price: number | null;
  declare stopPrice: number | null;
  declare limitPrice: number | null;
  declare averagePrice: number | null;
  declare timeInForce: TimeInForce;
  declare orderStatus: OrderStatus;
  declare executionInstructions: string[];
  declare account: string;
  declare portfolio: string;
  declare strategy: string | null;
  declare trader: string;
  declare traderId: string;
  declare desk: string | null;
  declare submittedAt: Date;
  declare submittedAtMicros: number;
  declare acknowledgedAt: Date | null;
  declare lastUpdatedAt: Date;
  declare completedAt: Date | null;
  declare venue: string | null;
  declare broker: string | null;
  declare commission: number;
  declare fees: number;
  declare settlementDate: Date | null;
  declare currency: string;
  declare exchangeOrderId: string | null;
  declare fixMessageId: string | null;
  declare routingStrategy: RoutingStrategy | null;
  declare algorithmType: AlgorithmType | null;
  declare algorithmParams: Record<string, any> | null;
  declare complianceChecks: Record<string, any>;
  declare riskLimits: Record<string, any>;
  declare text: string | null;
  declare metadata: Record<string, any>;
  declare isActive: boolean;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getExecutions: HasManyGetAssociationsMixin<OrderExecution>;
  declare addExecution: HasManyAddAssociationMixin<OrderExecution, string>;
  declare getFills: HasManyGetAssociationsMixin<OrderFill>;
  declare getAudits: HasManyGetAssociationsMixin<OrderAudit>;
  declare getAllocations: HasManyGetAssociationsMixin<OrderAllocation>;
  declare getChildOrders: HasManyGetAssociationsMixin<TradingOrder>;

  declare static associations: {
    executions: Association<TradingOrder, OrderExecution>;
    fills: Association<TradingOrder, OrderFill>;
    audits: Association<TradingOrder, OrderAudit>;
    allocations: Association<TradingOrder, OrderAllocation>;
    childOrders: Association<TradingOrder, TradingOrder>;
    parentOrder: Association<TradingOrder, TradingOrder>;
  };

  /**
   * Initialize TradingOrder with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof TradingOrder {
    TradingOrder.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        orderId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'order_id',
          comment: 'Internal order identifier',
        },
        clientOrderId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'client_order_id',
          comment: 'Client-provided order identifier',
        },
        parentOrderId: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'parent_order_id',
          references: {
            model: 'trading_orders',
            key: 'order_id',
          },
          comment: 'Parent order for child/slice orders',
        },
        basketOrderId: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'basket_order_id',
          comment: 'Basket order identifier',
        },
        securityId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'security_id',
          comment: 'Security identifier',
        },
        symbol: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'symbol',
          comment: 'Trading symbol',
        },
        securityType: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'security_type',
          comment: 'Security type (EQUITY, OPTION, FUTURE, etc.)',
        },
        orderType: {
          type: DataTypes.ENUM(...Object.values(OrderType)),
          allowNull: false,
          field: 'order_type',
          comment: 'Order type',
        },
        side: {
          type: DataTypes.ENUM(...Object.values(OrderSide)),
          allowNull: false,
          field: 'side',
          comment: 'Order side',
        },
        quantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'quantity',
          comment: 'Total order quantity',
        },
        filledQuantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          field: 'filled_quantity',
          comment: 'Filled quantity',
        },
        remainingQuantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'remaining_quantity',
          comment: 'Remaining quantity',
        },
        price: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: true,
          field: 'price',
          comment: 'Order price',
        },
        stopPrice: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: true,
          field: 'stop_price',
          comment: 'Stop price for stop orders',
        },
        limitPrice: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: true,
          field: 'limit_price',
          comment: 'Limit price for limit orders',
        },
        averagePrice: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: true,
          field: 'average_price',
          comment: 'Average fill price',
        },
        timeInForce: {
          type: DataTypes.ENUM(...Object.values(TimeInForce)),
          allowNull: false,
          defaultValue: TimeInForce.DAY,
          field: 'time_in_force',
          comment: 'Time in force',
        },
        orderStatus: {
          type: DataTypes.ENUM(...Object.values(OrderStatus)),
          allowNull: false,
          defaultValue: OrderStatus.PENDING,
          field: 'order_status',
          comment: 'Order status',
        },
        executionInstructions: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'execution_instructions',
          comment: 'Execution instructions',
        },
        account: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'account',
          comment: 'Trading account',
        },
        portfolio: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'portfolio',
          comment: 'Portfolio identifier',
        },
        strategy: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'strategy',
          comment: 'Trading strategy',
        },
        trader: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'trader',
          comment: 'Trader name',
        },
        traderId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'trader_id',
          comment: 'Trader identifier',
        },
        desk: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'desk',
          comment: 'Trading desk',
        },
        submittedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'submitted_at',
          comment: 'Submission timestamp',
        },
        submittedAtMicros: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'submitted_at_micros',
          comment: 'Submission timestamp (microseconds)',
        },
        acknowledgedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'acknowledged_at',
          comment: 'Acknowledgment timestamp',
        },
        lastUpdatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'last_updated_at',
          comment: 'Last update timestamp',
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'completed_at',
          comment: 'Completion timestamp',
        },
        venue: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'venue',
          comment: 'Execution venue',
        },
        broker: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'broker',
          comment: 'Executing broker',
        },
        commission: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          defaultValue: 0,
          field: 'commission',
          comment: 'Commission amount',
        },
        fees: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          defaultValue: 0,
          field: 'fees',
          comment: 'Fees and charges',
        },
        settlementDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'settlement_date',
          comment: 'Settlement date',
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
          field: 'currency',
          comment: 'Currency (ISO 4217)',
        },
        exchangeOrderId: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'exchange_order_id',
          comment: 'Exchange order ID',
        },
        fixMessageId: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'fix_message_id',
          comment: 'FIX message ID',
        },
        routingStrategy: {
          type: DataTypes.ENUM(...Object.values(RoutingStrategy)),
          allowNull: true,
          field: 'routing_strategy',
          comment: 'Routing strategy',
        },
        algorithmType: {
          type: DataTypes.ENUM(...Object.values(AlgorithmType)),
          allowNull: true,
          field: 'algorithm_type',
          comment: 'Algorithm type for algo orders',
        },
        algorithmParams: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'algorithm_params',
          comment: 'Algorithm parameters',
        },
        complianceChecks: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'compliance_checks',
          comment: 'Compliance check results',
        },
        riskLimits: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'risk_limits',
          comment: 'Risk limit validation',
        },
        text: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'text',
          comment: 'Order text/notes',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
          comment: 'Additional order metadata',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'trading_orders',
        modelName: 'TradingOrder',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['order_id'], unique: true },
          { fields: ['client_order_id'], unique: true },
          { fields: ['parent_order_id'] },
          { fields: ['basket_order_id'] },
          { fields: ['security_id'] },
          { fields: ['symbol'] },
          { fields: ['order_status'] },
          { fields: ['order_type'] },
          { fields: ['side'] },
          { fields: ['account'] },
          { fields: ['portfolio'] },
          { fields: ['trader_id'] },
          { fields: ['submitted_at'] },
          { fields: ['venue'] },
          { fields: ['broker'] },
          { fields: ['algorithm_type'] },
          { fields: ['symbol', 'order_status'] },
          { fields: ['account', 'submitted_at'] },
          { fields: ['trader_id', 'submitted_at'] },
        ],
      }
    );

    return TradingOrder;
  }
}

// ============================================================================
// SEQUELIZE MODEL: OrderExecution
// ============================================================================

/**
 * TypeScript interface for OrderExecution attributes
 */
export interface OrderExecutionAttributes {
  id: string;
  executionId: string;
  orderId: string;
  fillId: string;
  securityId: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  notional: number;
  executionTime: Date;
  executionTimeMicros: number;
  venue: string;
  exchange: string;
  broker: string;
  commission: number;
  fees: number;
  liquidity: string;
  settlementDate: Date;
  contraparty: string | null;
  tradeId: string | null;
  executionReport: Record<string, any>;
  currency: string;
  exchangeRate: number;
  notionalUSD: number;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
}

export interface OrderExecutionCreationAttributes
  extends Optional<OrderExecutionAttributes, 'id'> {}

/**
 * Sequelize Model: OrderExecution
 * Execution and fill tracking
 */
export class OrderExecution
  extends Model<OrderExecutionAttributes, OrderExecutionCreationAttributes>
  implements OrderExecutionAttributes
{
  declare id: string;
  declare executionId: string;
  declare orderId: string;
  declare fillId: string;
  declare securityId: string;
  declare symbol: string;
  declare side: OrderSide;
  declare quantity: number;
  declare price: number;
  declare notional: number;
  declare executionTime: Date;
  declare executionTimeMicros: number;
  declare venue: string;
  declare exchange: string;
  declare broker: string;
  declare commission: number;
  declare fees: number;
  declare liquidity: string;
  declare settlementDate: Date;
  declare contraparty: string | null;
  declare tradeId: string | null;
  declare executionReport: Record<string, any>;
  declare currency: string;
  declare exchangeRate: number;
  declare notionalUSD: number;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare readonly createdAt: Date;

  declare getOrder: BelongsToGetAssociationMixin<TradingOrder>;

  static initModel(sequelize: Sequelize): typeof OrderExecution {
    OrderExecution.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        executionId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'execution_id',
        },
        orderId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'order_id',
          references: {
            model: 'trading_orders',
            key: 'order_id',
          },
        },
        fillId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'fill_id',
        },
        securityId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'security_id',
        },
        symbol: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'symbol',
        },
        side: {
          type: DataTypes.ENUM(...Object.values(OrderSide)),
          allowNull: false,
          field: 'side',
        },
        quantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'quantity',
        },
        price: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'price',
        },
        notional: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'notional',
        },
        executionTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'execution_time',
        },
        executionTimeMicros: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'execution_time_micros',
        },
        venue: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'venue',
        },
        exchange: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'exchange',
        },
        broker: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'broker',
        },
        commission: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          defaultValue: 0,
          field: 'commission',
        },
        fees: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          defaultValue: 0,
          field: 'fees',
        },
        liquidity: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'liquidity',
        },
        settlementDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'settlement_date',
        },
        contraparty: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'contraparty',
        },
        tradeId: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'trade_id',
        },
        executionReport: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'execution_report',
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
          field: 'currency',
        },
        exchangeRate: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          defaultValue: 1,
          field: 'exchange_rate',
        },
        notionalUSD: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'notional_usd',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'order_executions',
        modelName: 'OrderExecution',
        timestamps: true,
        updatedAt: false,
        underscored: true,
        indexes: [
          { fields: ['execution_id'], unique: true },
          { fields: ['order_id'] },
          { fields: ['fill_id'] },
          { fields: ['symbol'] },
          { fields: ['execution_time'] },
          { fields: ['venue'] },
          { fields: ['broker'] },
        ],
      }
    );

    return OrderExecution;
  }
}

// ============================================================================
// SEQUELIZE MODEL: OrderFill
// ============================================================================

/**
 * TypeScript interface for OrderFill attributes
 */
export interface OrderFillAttributes {
  id: string;
  fillId: string;
  orderId: string;
  executionId: string;
  quantity: number;
  price: number;
  notional: number;
  fillTime: Date;
  fillTimeMicros: number;
  cumulativeQuantity: number;
  averagePrice: number;
  leavesQuantity: number;
  fillStatus: string;
  venue: string;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
}

export interface OrderFillCreationAttributes extends Optional<OrderFillAttributes, 'id'> {}

/**
 * Sequelize Model: OrderFill
 * Fill management and tracking
 */
export class OrderFill
  extends Model<OrderFillAttributes, OrderFillCreationAttributes>
  implements OrderFillAttributes
{
  declare id: string;
  declare fillId: string;
  declare orderId: string;
  declare executionId: string;
  declare quantity: number;
  declare price: number;
  declare notional: number;
  declare fillTime: Date;
  declare fillTimeMicros: number;
  declare cumulativeQuantity: number;
  declare averagePrice: number;
  declare leavesQuantity: number;
  declare fillStatus: string;
  declare venue: string;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare readonly createdAt: Date;

  static initModel(sequelize: Sequelize): typeof OrderFill {
    OrderFill.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        fillId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'fill_id',
        },
        orderId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'order_id',
          references: {
            model: 'trading_orders',
            key: 'order_id',
          },
        },
        executionId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'execution_id',
        },
        quantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'quantity',
        },
        price: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'price',
        },
        notional: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'notional',
        },
        fillTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'fill_time',
        },
        fillTimeMicros: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'fill_time_micros',
        },
        cumulativeQuantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'cumulative_quantity',
        },
        averagePrice: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'average_price',
        },
        leavesQuantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'leaves_quantity',
        },
        fillStatus: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'fill_status',
        },
        venue: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'venue',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'order_fills',
        modelName: 'OrderFill',
        timestamps: true,
        updatedAt: false,
        underscored: true,
        indexes: [
          { fields: ['fill_id'], unique: true },
          { fields: ['order_id'] },
          { fields: ['execution_id'] },
          { fields: ['fill_time'] },
        ],
      }
    );

    return OrderFill;
  }
}

// ============================================================================
// SEQUELIZE MODEL: OrderAllocation
// ============================================================================

/**
 * TypeScript interface for OrderAllocation attributes
 */
export interface OrderAllocationAttributes {
  id: string;
  allocationId: string;
  orderId: string;
  executionId: string;
  account: string;
  portfolio: string;
  quantity: number;
  price: number;
  notional: number;
  allocationPercent: number;
  allocationMethod: AllocationMethod;
  allocationStatus: string;
  settlementDate: Date;
  allocatedAt: Date;
  confirmedAt: Date | null;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderAllocationCreationAttributes
  extends Optional<OrderAllocationAttributes, 'id' | 'updatedBy'> {}

/**
 * Sequelize Model: OrderAllocation
 * Fill allocation to accounts/portfolios
 */
export class OrderAllocation
  extends Model<OrderAllocationAttributes, OrderAllocationCreationAttributes>
  implements OrderAllocationAttributes
{
  declare id: string;
  declare allocationId: string;
  declare orderId: string;
  declare executionId: string;
  declare account: string;
  declare portfolio: string;
  declare quantity: number;
  declare price: number;
  declare notional: number;
  declare allocationPercent: number;
  declare allocationMethod: AllocationMethod;
  declare allocationStatus: string;
  declare settlementDate: Date;
  declare allocatedAt: Date;
  declare confirmedAt: Date | null;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof OrderAllocation {
    OrderAllocation.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        allocationId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'allocation_id',
        },
        orderId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'order_id',
          references: {
            model: 'trading_orders',
            key: 'order_id',
          },
        },
        executionId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'execution_id',
        },
        account: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'account',
        },
        portfolio: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'portfolio',
        },
        quantity: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'quantity',
        },
        price: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'price',
        },
        notional: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'notional',
        },
        allocationPercent: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          field: 'allocation_percent',
        },
        allocationMethod: {
          type: DataTypes.ENUM(...Object.values(AllocationMethod)),
          allowNull: false,
          field: 'allocation_method',
        },
        allocationStatus: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'allocation_status',
        },
        settlementDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'settlement_date',
        },
        allocatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'allocated_at',
        },
        confirmedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'confirmed_at',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'order_allocations',
        modelName: 'OrderAllocation',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['allocation_id'], unique: true },
          { fields: ['order_id'] },
          { fields: ['execution_id'] },
          { fields: ['account'] },
          { fields: ['portfolio'] },
        ],
      }
    );

    return OrderAllocation;
  }
}

// ============================================================================
// SEQUELIZE MODEL: OrderAudit
// ============================================================================

/**
 * TypeScript interface for OrderAudit attributes
 */
export interface OrderAuditAttributes {
  id: string;
  auditId: string;
  orderId: string;
  eventType: string;
  eventTime: Date;
  eventTimeMicros: number;
  userId: string | null;
  userName: string | null;
  orderStatus: string;
  previousStatus: string | null;
  changes: Record<string, any>;
  fixMessage: string | null;
  ipAddress: string | null;
  description: string | null;
  metadata: Record<string, any>;
  createdAt?: Date;
}

export interface OrderAuditCreationAttributes extends Optional<OrderAuditAttributes, 'id'> {}

/**
 * Sequelize Model: OrderAudit
 * Complete order audit trail for compliance
 */
export class OrderAudit
  extends Model<OrderAuditAttributes, OrderAuditCreationAttributes>
  implements OrderAuditAttributes
{
  declare id: string;
  declare auditId: string;
  declare orderId: string;
  declare eventType: string;
  declare eventTime: Date;
  declare eventTimeMicros: number;
  declare userId: string | null;
  declare userName: string | null;
  declare orderStatus: string;
  declare previousStatus: string | null;
  declare changes: Record<string, any>;
  declare fixMessage: string | null;
  declare ipAddress: string | null;
  declare description: string | null;
  declare metadata: Record<string, any>;
  declare readonly createdAt: Date;

  static initModel(sequelize: Sequelize): typeof OrderAudit {
    OrderAudit.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        auditId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'audit_id',
        },
        orderId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'order_id',
          references: {
            model: 'trading_orders',
            key: 'order_id',
          },
        },
        eventType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'event_type',
        },
        eventTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'event_time',
        },
        eventTimeMicros: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'event_time_micros',
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'user_id',
        },
        userName: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'user_name',
        },
        orderStatus: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'order_status',
        },
        previousStatus: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'previous_status',
        },
        changes: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'changes',
        },
        fixMessage: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'fix_message',
        },
        ipAddress: {
          type: DataTypes.STRING(45),
          allowNull: true,
          field: 'ip_address',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'order_audits',
        modelName: 'OrderAudit',
        timestamps: true,
        updatedAt: false,
        underscored: true,
        indexes: [
          { fields: ['audit_id'], unique: true },
          { fields: ['order_id'] },
          { fields: ['event_type'] },
          { fields: ['event_time'] },
          { fields: ['user_id'] },
        ],
      }
    );

    return OrderAudit;
  }
}

// ============================================================================
// SEQUELIZE MODEL: SmartRoute
// ============================================================================

/**
 * TypeScript interface for SmartRoute attributes
 */
export interface SmartRouteAttributes {
  id: string;
  routeId: string;
  orderId: string;
  routingStrategy: RoutingStrategy;
  primaryVenue: string;
  venueRoutes: Record<string, any>[];
  estimatedCost: number;
  estimatedSlippage: number;
  routeStatus: string;
  executionResults: Record<string, any>;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SmartRouteCreationAttributes extends Optional<SmartRouteAttributes, 'id'> {}

/**
 * Sequelize Model: SmartRoute
 * Smart order routing configuration and results
 */
export class SmartRoute
  extends Model<SmartRouteAttributes, SmartRouteCreationAttributes>
  implements SmartRouteAttributes
{
  declare id: string;
  declare routeId: string;
  declare orderId: string;
  declare routingStrategy: RoutingStrategy;
  declare primaryVenue: string;
  declare venueRoutes: Record<string, any>[];
  declare estimatedCost: number;
  declare estimatedSlippage: number;
  declare routeStatus: string;
  declare executionResults: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof SmartRoute {
    SmartRoute.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        routeId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          field: 'route_id',
        },
        orderId: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'order_id',
          references: {
            model: 'trading_orders',
            key: 'order_id',
          },
        },
        routingStrategy: {
          type: DataTypes.ENUM(...Object.values(RoutingStrategy)),
          allowNull: false,
          field: 'routing_strategy',
        },
        primaryVenue: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'primary_venue',
        },
        venueRoutes: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'venue_routes',
        },
        estimatedCost: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'estimated_cost',
        },
        estimatedSlippage: {
          type: DataTypes.DECIMAL(19, 8),
          allowNull: false,
          field: 'estimated_slippage',
        },
        routeStatus: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'route_status',
        },
        executionResults: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'execution_results',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'smart_routes',
        modelName: 'SmartRoute',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['route_id'], unique: true },
          { fields: ['order_id'] },
          { fields: ['routing_strategy'] },
        ],
      }
    );

    return SmartRoute;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineOrderManagementAssociations(): void {
  // TradingOrder -> OrderExecution (1:N)
  TradingOrder.hasMany(OrderExecution, {
    foreignKey: 'orderId',
    sourceKey: 'orderId',
    as: 'executions',
    onDelete: 'CASCADE',
  });

  OrderExecution.belongsTo(TradingOrder, {
    foreignKey: 'orderId',
    targetKey: 'orderId',
    as: 'order',
  });

  // TradingOrder -> OrderFill (1:N)
  TradingOrder.hasMany(OrderFill, {
    foreignKey: 'orderId',
    sourceKey: 'orderId',
    as: 'fills',
    onDelete: 'CASCADE',
  });

  OrderFill.belongsTo(TradingOrder, {
    foreignKey: 'orderId',
    targetKey: 'orderId',
    as: 'order',
  });

  // TradingOrder -> OrderAllocation (1:N)
  TradingOrder.hasMany(OrderAllocation, {
    foreignKey: 'orderId',
    sourceKey: 'orderId',
    as: 'allocations',
    onDelete: 'CASCADE',
  });

  OrderAllocation.belongsTo(TradingOrder, {
    foreignKey: 'orderId',
    targetKey: 'orderId',
    as: 'order',
  });

  // TradingOrder -> OrderAudit (1:N)
  TradingOrder.hasMany(OrderAudit, {
    foreignKey: 'orderId',
    sourceKey: 'orderId',
    as: 'audits',
    onDelete: 'CASCADE',
  });

  OrderAudit.belongsTo(TradingOrder, {
    foreignKey: 'orderId',
    targetKey: 'orderId',
    as: 'order',
  });

  // TradingOrder -> SmartRoute (1:1)
  TradingOrder.hasOne(SmartRoute, {
    foreignKey: 'orderId',
    sourceKey: 'orderId',
    as: 'route',
    onDelete: 'CASCADE',
  });

  SmartRoute.belongsTo(TradingOrder, {
    foreignKey: 'orderId',
    targetKey: 'orderId',
    as: 'order',
  });

  // TradingOrder -> TradingOrder (Parent/Child) (1:N)
  TradingOrder.hasMany(TradingOrder, {
    foreignKey: 'parentOrderId',
    sourceKey: 'orderId',
    as: 'childOrders',
    onDelete: 'CASCADE',
  });

  TradingOrder.belongsTo(TradingOrder, {
    foreignKey: 'parentOrderId',
    targetKey: 'orderId',
    as: 'parentOrder',
  });
}

// ============================================================================
// ORDER CREATION AND VALIDATION FUNCTIONS
// ============================================================================

/**
 * Create Bloomberg-style order with full validation and compliance
 */
export async function createBloombergOrder(
  orderData: Partial<TradingOrderAttributes>,
  userId: string,
  transaction?: Transaction
): Promise<TradingOrder> {
  const orderId = await generateClientOrderId('BBG');
  const submittedAt = new Date();

  // Perform pre-trade compliance
  const compliance = await validateOrderCompliance(orderData as any);
  if (!compliance.compliant) {
    throw new Error(`Compliance check failed: ${compliance.violations.join(', ')}`);
  }

  // Validate risk limits
  const riskCheck = await validateOrderRiskLimits(orderData as any, orderData.account!);
  if (!riskCheck.withinLimits) {
    throw new Error(`Risk limits exceeded: exposure ${riskCheck.exposure}`);
  }

  const order = await TradingOrder.create(
    {
      ...orderData,
      orderId,
      clientOrderId: orderData.clientOrderId || orderId,
      submittedAt,
      submittedAtMicros: submittedAt.getTime() * 1000,
      lastUpdatedAt: submittedAt,
      remainingQuantity: orderData.quantity!,
      filledQuantity: 0,
      orderStatus: OrderStatus.PENDING,
      complianceChecks: compliance,
      riskLimits: riskCheck,
      isActive: true,
      createdBy: userId,
    } as TradingOrderCreationAttributes,
    { transaction }
  );

  return order;
}

/**
 * Validate order against comprehensive risk limits
 */
export async function validateOrderAgainstRiskLimits(
  orderId: string,
  transaction?: Transaction
): Promise<{ compliant: boolean; violations: string[]; limits: Record<string, any> }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const riskCheck = await validateOrderRiskLimits(order as any, order.account);
  const violations: string[] = [];

  if (!riskCheck.withinLimits) {
    violations.push(`Exposure limit exceeded: ${riskCheck.exposure} > ${riskCheck.availableLimit}`);
  }

  return {
    compliant: violations.length === 0,
    violations,
    limits: riskCheck,
  };
}

/**
 * Enrich order with market data and default values
 */
export async function enrichOrderWithMarketData(
  orderId: string,
  marketData: Record<string, any>,
  transaction?: Transaction
): Promise<TradingOrder> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const enriched = await enrichOrderWithDefaults(order as any);

  await order.update(
    {
      metadata: {
        ...order.metadata,
        marketData,
        enrichedAt: new Date(),
      },
    },
    { transaction }
  );

  return order;
}

/**
 * Calculate comprehensive order value with fees and commissions
 */
export async function calculateOrderTotalValue(
  orderId: string,
  transaction?: Transaction
): Promise<{ notional: number; commission: number; fees: number; total: number }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const price = order.averagePrice || order.limitPrice || order.price || 0;
  const notional = order.quantity * price;
  const commission = order.commission;
  const fees = order.fees;
  const total = notional + commission + fees;

  return { notional, commission, fees, total };
}

// ============================================================================
// ORDER ROUTING AND EXECUTION FUNCTIONS
// ============================================================================

/**
 * Route order to optimal venue using smart routing
 */
export async function routeOrderToOptimalVenue(
  orderId: string,
  routingConfig: Record<string, any>,
  userId: string,
  transaction?: Transaction
): Promise<SmartRoute> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const routing = await smartRouteOrder(order as any, routingConfig);

  const route = await SmartRoute.create(
    {
      routeId: `ROUTE-${Date.now()}`,
      orderId: order.orderId,
      routingStrategy: routingConfig.routingStrategy || RoutingStrategy.BEST_EXECUTION,
      primaryVenue: routing.primaryVenue,
      venueRoutes: routing.routes,
      estimatedCost: 0,
      estimatedSlippage: 0,
      routeStatus: 'ACTIVE',
      executionResults: {},
      metadata: {},
      createdBy: userId,
    },
    { transaction }
  );

  await order.update({ routingStrategy: route.routingStrategy }, { transaction });

  return route;
}

/**
 * Execute smart routed order across multiple venues
 */
export async function executeMultiVenueOrder(
  orderId: string,
  userId: string,
  transaction?: Transaction
): Promise<{ executionReports: OrderExecution[]; totalFilled: number }> {
  const order = await TradingOrder.findOne({
    where: { orderId },
    include: [{ model: SmartRoute, as: 'route' }],
    transaction,
  });

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const route = await SmartRoute.findOne({ where: { orderId }, transaction });
  if (!route) {
    throw new Error(`No routing found for order: ${orderId}`);
  }

  const executions = await executeSmartRoutedOrder(order as any, route.venueRoutes as any);

  const executionRecords: OrderExecution[] = [];
  for (const execReport of executions.executionReports) {
    const execution = await OrderExecution.create(
      {
        executionId: `EXEC-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        orderId: order.orderId,
        fillId: `FILL-${Date.now()}`,
        securityId: order.securityId,
        symbol: order.symbol,
        side: execReport.side,
        quantity: execReport.executedQuantity,
        price: execReport.price,
        notional: execReport.executedQuantity * execReport.price,
        executionTime: new Date(),
        executionTimeMicros: Date.now() * 1000,
        venue: execReport.venue,
        exchange: execReport.venue,
        broker: order.broker || 'INTERNAL',
        commission: execReport.commission,
        fees: execReport.fees,
        liquidity: execReport.liquidityFlag,
        settlementDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        contraparty: null,
        tradeId: null,
        executionReport: execReport as any,
        currency: order.currency,
        exchangeRate: 1,
        notionalUSD: execReport.executedQuantity * execReport.price,
        metadata: {},
        createdBy: userId,
      },
      { transaction }
    );

    executionRecords.push(execution);
  }

  return { executionReports: executionRecords, totalFilled: executions.totalFilled };
}

/**
 * Calculate and select best execution venue
 */
export async function selectBestExecutionVenue(
  symbol: string,
  side: OrderSide,
  quantity: number,
  venuePreferences?: string[]
): Promise<{ venue: string; expectedPrice: number; confidence: number }> {
  const venueQuotes = new Map(); // In production, fetch real market data

  const best = calculateBestVenue(symbol, side, quantity, venueQuotes);

  return best;
}

/**
 * Optimize routing strategy based on historical performance
 */
export async function optimizeOrderRoutingStrategy(
  symbol: string,
  orderSize: number,
  lookbackDays: number = 30
): Promise<{ strategy: RoutingStrategy; venues: string[]; confidence: number }> {
  const historicalData: any[] = []; // In production, fetch historical execution data

  const optimized = await optimizeRoutingStrategy(symbol, orderSize, historicalData);

  return {
    strategy: optimized.routingStrategy as RoutingStrategy,
    venues: optimized.venues as string[],
    confidence: 85,
  };
}

// ============================================================================
// ORDER BOOK MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Update order book with new order
 */
export async function updateOrderBookWithOrder(
  orderId: string,
  transaction?: Transaction
): Promise<{ updated: boolean; bookDepth: number }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  // In production, update order book in real-time system
  return { updated: true, bookDepth: 10 };
}

/**
 * Get order book depth and liquidity
 */
export async function getOrderBookDepth(
  symbol: string,
  venue: string
): Promise<{ bids: any[]; asks: any[]; depth: number; spread: number }> {
  // In production, fetch real-time order book data
  return {
    bids: [],
    asks: [],
    depth: 10,
    spread: 0.01,
  };
}

// ============================================================================
// ORDER STATUS TRACKING FUNCTIONS
// ============================================================================

/**
 * Track complete order status with lifecycle events
 */
export async function trackOrderStatusWithEvents(
  orderId: string,
  transaction?: Transaction
): Promise<{
  order: TradingOrder;
  lifecycle: any;
  latestEvents: OrderAudit[];
}> {
  const order = await TradingOrder.findOne({
    where: { orderId },
    include: [
      { model: OrderAudit, as: 'audits', limit: 10, order: [['eventTime', 'DESC']] },
    ],
    transaction,
  });

  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const lifecycle = await trackOrderLifecycle(orderId);

  return {
    order,
    lifecycle,
    latestEvents: (order as any).audits || [],
  };
}

/**
 * Get comprehensive order lifecycle history
 */
export async function getOrderLifecycleHistory(
  orderId: string,
  transaction?: Transaction
): Promise<{ events: OrderAudit[]; duration: number; statusChanges: number }> {
  const audits = await OrderAudit.findAll({
    where: { orderId },
    order: [['eventTime', 'ASC']],
    transaction,
  });

  const statusChanges = audits.filter((a) => a.eventType === 'STATUS_CHANGE').length;

  const duration =
    audits.length > 1
      ? audits[audits.length - 1].eventTime.getTime() - audits[0].eventTime.getTime()
      : 0;

  return { events: audits, duration, statusChanges };
}

// ============================================================================
// ORDER AMENDMENT AND CANCELLATION FUNCTIONS
// ============================================================================

/**
 * Amend order price with validation
 */
export async function amendOrderPrice(
  orderId: string,
  newPrice: number,
  userId: string,
  reason: string,
  transaction?: Transaction
): Promise<TradingOrder> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (order.orderStatus === OrderStatus.FILLED || order.orderStatus === OrderStatus.CANCELLED) {
    throw new Error(`Cannot amend order in ${order.orderStatus} status`);
  }

  const previousPrice = order.price;

  await order.update(
    {
      price: newPrice,
      limitPrice: newPrice,
      orderStatus: OrderStatus.PENDING_REPLACE,
      lastUpdatedAt: new Date(),
      updatedBy: userId,
    },
    { transaction }
  );

  await OrderAudit.create(
    {
      auditId: `AUD-${Date.now()}`,
      orderId,
      eventType: 'AMENDED',
      eventTime: new Date(),
      eventTimeMicros: Date.now() * 1000,
      userId,
      userName: null,
      orderStatus: OrderStatus.PENDING_REPLACE,
      previousStatus: order.orderStatus,
      changes: { price: { from: previousPrice, to: newPrice } },
      fixMessage: null,
      ipAddress: null,
      description: reason,
      metadata: {},
    },
    { transaction }
  );

  return order;
}

/**
 * Amend order quantity with validation
 */
export async function amendOrderQuantity(
  orderId: string,
  newQuantity: number,
  userId: string,
  reason: string,
  transaction?: Transaction
): Promise<TradingOrder> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (order.orderStatus === OrderStatus.FILLED || order.orderStatus === OrderStatus.CANCELLED) {
    throw new Error(`Cannot amend order in ${order.orderStatus} status`);
  }

  const previousQuantity = order.quantity;

  await order.update(
    {
      quantity: newQuantity,
      remainingQuantity: newQuantity - order.filledQuantity,
      orderStatus: OrderStatus.PENDING_REPLACE,
      lastUpdatedAt: new Date(),
      updatedBy: userId,
    },
    { transaction }
  );

  await OrderAudit.create(
    {
      auditId: `AUD-${Date.now()}`,
      orderId,
      eventType: 'AMENDED',
      eventTime: new Date(),
      eventTimeMicros: Date.now() * 1000,
      userId,
      userName: null,
      orderStatus: OrderStatus.PENDING_REPLACE,
      previousStatus: order.orderStatus,
      changes: { quantity: { from: previousQuantity, to: newQuantity } },
      fixMessage: null,
      ipAddress: null,
      description: reason,
      metadata: {},
    },
    { transaction }
  );

  return order;
}

/**
 * Cancel order request with audit trail
 */
export async function cancelOrderRequest(
  orderId: string,
  userId: string,
  reason: string,
  transaction?: Transaction
): Promise<{ order: TradingOrder; cancelled: boolean }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (order.orderStatus === OrderStatus.FILLED || order.orderStatus === OrderStatus.CANCELLED) {
    return { order, cancelled: false };
  }

  const previousStatus = order.orderStatus;

  await order.update(
    {
      orderStatus: OrderStatus.PENDING_CANCEL,
      lastUpdatedAt: new Date(),
      updatedBy: userId,
    },
    { transaction }
  );

  await OrderAudit.create(
    {
      auditId: `AUD-${Date.now()}`,
      orderId,
      eventType: 'CANCELLED',
      eventTime: new Date(),
      eventTimeMicros: Date.now() * 1000,
      userId,
      userName: null,
      orderStatus: OrderStatus.PENDING_CANCEL,
      previousStatus,
      changes: {},
      fixMessage: null,
      ipAddress: null,
      description: reason,
      metadata: {},
    },
    { transaction }
  );

  return { order, cancelled: true };
}

/**
 * Cancel all orders for a symbol
 */
export async function cancelAllOrdersForSymbol(
  symbol: string,
  userId: string,
  reason: string,
  transaction?: Transaction
): Promise<{ cancelledCount: number; failedCount: number }> {
  const orders = await TradingOrder.findAll({
    where: {
      symbol,
      orderStatus: {
        [Op.in]: [
          OrderStatus.PENDING,
          OrderStatus.NEW,
          OrderStatus.PARTIALLY_FILLED,
        ],
      },
    },
    transaction,
  });

  let cancelledCount = 0;
  let failedCount = 0;

  for (const order of orders) {
    try {
      await cancelOrderRequest(order.orderId, userId, reason, transaction);
      cancelledCount++;
    } catch (error) {
      failedCount++;
    }
  }

  return { cancelledCount, failedCount };
}

// ============================================================================
// PARENT/CHILD ORDER RELATIONSHIPS FUNCTIONS
// ============================================================================

/**
 * Create parent order for algorithmic or basket execution
 */
export async function createParentOrder(
  orderData: Partial<TradingOrderAttributes>,
  userId: string,
  transaction?: Transaction
): Promise<TradingOrder> {
  const parentOrder = await createBloombergOrder(
    {
      ...orderData,
      parentOrderId: null,
      metadata: {
        ...orderData.metadata,
        isParent: true,
        childCount: 0,
      },
    },
    userId,
    transaction
  );

  return parentOrder;
}

/**
 * Split order into child orders
 */
export async function splitOrderToChildren(
  parentOrderId: string,
  splits: Array<{ quantity: number; venue?: string; price?: number }>,
  userId: string,
  transaction?: Transaction
): Promise<TradingOrder[]> {
  const parentOrder = await TradingOrder.findOne({ where: { orderId: parentOrderId }, transaction });
  if (!parentOrder) {
    throw new Error(`Parent order not found: ${parentOrderId}`);
  }

  const totalSplitQuantity = splits.reduce((sum, split) => sum + split.quantity, 0);
  if (totalSplitQuantity !== parentOrder.quantity) {
    throw new Error(
      `Split quantities (${totalSplitQuantity}) do not match parent quantity (${parentOrder.quantity})`
    );
  }

  const childOrders: TradingOrder[] = [];

  for (let i = 0; i < splits.length; i++) {
    const split = splits[i];
    const childOrder = await createBloombergOrder(
      {
        parentOrderId: parentOrder.orderId,
        securityId: parentOrder.securityId,
        symbol: parentOrder.symbol,
        securityType: parentOrder.securityType,
        orderType: parentOrder.orderType,
        side: parentOrder.side,
        quantity: split.quantity,
        price: split.price || parentOrder.price,
        limitPrice: split.price || parentOrder.limitPrice,
        timeInForce: parentOrder.timeInForce,
        account: parentOrder.account,
        portfolio: parentOrder.portfolio,
        trader: parentOrder.trader,
        traderId: parentOrder.traderId,
        desk: parentOrder.desk,
        venue: split.venue,
        currency: parentOrder.currency,
        metadata: {
          parentOrderId: parentOrder.orderId,
          childIndex: i,
          splitType: 'QUANTITY',
        },
      },
      userId,
      transaction
    );

    childOrders.push(childOrder);
  }

  await parentOrder.update(
    {
      metadata: {
        ...parentOrder.metadata,
        childCount: splits.length,
      },
    },
    { transaction }
  );

  return childOrders;
}

/**
 * Link child orders to parent order
 */
export async function linkChildToParentOrder(
  childOrderId: string,
  parentOrderId: string,
  transaction?: Transaction
): Promise<{ parent: TradingOrder; child: TradingOrder }> {
  const parentOrder = await TradingOrder.findOne({ where: { orderId: parentOrderId }, transaction });
  const childOrder = await TradingOrder.findOne({ where: { orderId: childOrderId }, transaction });

  if (!parentOrder || !childOrder) {
    throw new Error('Parent or child order not found');
  }

  await childOrder.update({ parentOrderId: parentOrder.orderId }, { transaction });

  return { parent: parentOrder, child: childOrder };
}

/**
 * Aggregate child order status to parent
 */
export async function aggregateChildOrderStatus(
  parentOrderId: string,
  transaction?: Transaction
): Promise<{
  totalFilled: number;
  totalRemaining: number;
  aggregateStatus: OrderStatus;
  children: TradingOrder[];
}> {
  const childOrders = await TradingOrder.findAll({
    where: { parentOrderId },
    transaction,
  });

  const totalFilled = childOrders.reduce((sum, child) => sum + child.filledQuantity, 0);
  const totalRemaining = childOrders.reduce((sum, child) => sum + child.remainingQuantity, 0);

  let aggregateStatus = OrderStatus.NEW;
  if (totalRemaining === 0) {
    aggregateStatus = OrderStatus.FILLED;
  } else if (totalFilled > 0) {
    aggregateStatus = OrderStatus.PARTIALLY_FILLED;
  }

  return { totalFilled, totalRemaining, aggregateStatus, children: childOrders };
}

// ============================================================================
// ORDER ALLOCATION AND SPLITTING FUNCTIONS
// ============================================================================

/**
 * Allocate order fills to multiple accounts
 */
export async function allocateOrderFillsToAccounts(
  orderId: string,
  allocations: Array<{ account: string; percentage: number }>,
  userId: string,
  transaction?: Transaction
): Promise<OrderAllocation[]> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error(`Allocation percentages must sum to 100, got ${totalPercentage}`);
  }

  const allocationRecords: OrderAllocation[] = [];

  for (const alloc of allocations) {
    const quantity = Math.floor((order.filledQuantity * alloc.percentage) / 100);
    const avgPrice = order.averagePrice || 0;

    const allocation = await OrderAllocation.create(
      {
        allocationId: `ALLOC-${Date.now()}-${alloc.account}`,
        orderId: order.orderId,
        executionId: 'EXEC-COMPOSITE',
        account: alloc.account,
        portfolio: order.portfolio,
        quantity,
        price: avgPrice,
        notional: quantity * avgPrice,
        allocationPercent: alloc.percentage,
        allocationMethod: AllocationMethod.PRO_RATA,
        allocationStatus: 'ALLOCATED',
        settlementDate: order.settlementDate || new Date(),
        allocatedAt: new Date(),
        confirmedAt: null,
        metadata: {},
        createdBy: userId,
        updatedBy: null,
      },
      { transaction }
    );

    allocationRecords.push(allocation);
  }

  return allocationRecords;
}

/**
 * Split order by account with custom allocation
 */
export async function splitOrderByAccount(
  orderId: string,
  accountSplits: Array<{ account: string; quantity: number }>,
  userId: string,
  transaction?: Transaction
): Promise<TradingOrder[]> {
  const parentOrder = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!parentOrder) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const totalQuantity = accountSplits.reduce((sum, split) => sum + split.quantity, 0);
  if (totalQuantity !== parentOrder.quantity) {
    throw new Error('Account split quantities do not match order quantity');
  }

  const childOrders: TradingOrder[] = [];

  for (const split of accountSplits) {
    const childOrder = await createBloombergOrder(
      {
        parentOrderId: parentOrder.orderId,
        securityId: parentOrder.securityId,
        symbol: parentOrder.symbol,
        securityType: parentOrder.securityType,
        orderType: parentOrder.orderType,
        side: parentOrder.side,
        quantity: split.quantity,
        price: parentOrder.price,
        limitPrice: parentOrder.limitPrice,
        timeInForce: parentOrder.timeInForce,
        account: split.account,
        portfolio: parentOrder.portfolio,
        trader: parentOrder.trader,
        traderId: parentOrder.traderId,
        currency: parentOrder.currency,
        metadata: {
          parentOrderId: parentOrder.orderId,
          splitType: 'ACCOUNT',
        },
      },
      userId,
      transaction
    );

    childOrders.push(childOrder);
  }

  return childOrders;
}

// ============================================================================
// SMART ORDER ROUTING FUNCTIONS
// ============================================================================

/**
 * Calculate best routing path for order
 */
export async function calculateBestRoutingPath(
  orderId: string,
  venues: string[],
  transaction?: Transaction
): Promise<{ primaryVenue: string; backupVenues: string[]; estimatedCost: number }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const routing = await applyRoutingRules(orderId, { venues });

  return {
    primaryVenue: routing.venues[0].venue,
    backupVenues: routing.venues.slice(1).map((v) => v.venue),
    estimatedCost: routing.estimatedCost,
  };
}

/**
 * Optimize venue selection based on liquidity and cost
 */
export async function optimizeVenueSelection(
  symbol: string,
  orderSize: number,
  strategy: RoutingStrategy
): Promise<{ venues: string[]; expectedSlippage: number; confidence: number }> {
  const bestVenue = await selectBestVenue(symbol, orderSize, OrderSide.BUY);

  return {
    venues: [bestVenue.venue],
    expectedSlippage: 0.02,
    confidence: bestVenue.confidence,
  };
}

// ============================================================================
// ALGORITHMIC EXECUTION FUNCTIONS
// ============================================================================

/**
 * Execute TWAP strategy for order
 */
export async function executeTWAPStrategy(
  orderId: string,
  startTime: Date,
  endTime: Date,
  sliceInterval: number,
  userId: string,
  transaction?: Transaction
): Promise<{ algoId: string; slices: any[] }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const twapResult = await executeTWAP(order as any, {
    algorithm: AlgorithmType.TWAP,
    startTime,
    endTime,
    sliceInterval,
  } as any);

  await order.update(
    {
      algorithmType: AlgorithmType.TWAP,
      algorithmParams: { startTime, endTime, sliceInterval },
    },
    { transaction }
  );

  return twapResult;
}

/**
 * Execute VWAP strategy for order
 */
export async function executeVWAPStrategy(
  orderId: string,
  startTime: Date,
  endTime: Date,
  participationRate: number,
  userId: string,
  transaction?: Transaction
): Promise<{ algoId: string; slices: any[] }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const historicalVolume: number[] = []; // In production, fetch real volume data

  const vwapResult = await executeVWAP(
    order as any,
    {
      algorithm: AlgorithmType.VWAP,
      startTime,
      endTime,
      participationRate,
    } as any,
    historicalVolume
  );

  await order.update(
    {
      algorithmType: AlgorithmType.VWAP,
      algorithmParams: { startTime, endTime, participationRate },
    },
    { transaction }
  );

  return vwapResult;
}

/**
 * Monitor algorithmic order execution progress
 */
export async function monitorAlgorithmicOrderProgress(
  orderId: string,
  transaction?: Transaction
): Promise<{ progress: number; performance: any; recommendations: string[] }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (!order.algorithmType) {
    throw new Error('Order is not an algorithmic order');
  }

  const algoId = `ALGO-${orderId}`;
  const monitoring = await monitorAlgorithmicExecution(algoId);

  return monitoring;
}

// ============================================================================
// FILL MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Process order fill and update order status
 */
export async function processOrderFillUpdate(
  orderId: string,
  fillQuantity: number,
  fillPrice: number,
  venue: string,
  userId: string,
  transaction?: Transaction
): Promise<{ order: TradingOrder; fill: OrderFill }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const newFilledQuantity = order.filledQuantity + fillQuantity;
  const newRemainingQuantity = order.quantity - newFilledQuantity;

  const fills = await OrderFill.findAll({ where: { orderId }, transaction });
  const totalNotional = fills.reduce((sum, f) => sum + f.notional, 0) + fillQuantity * fillPrice;
  const newAveragePrice = totalNotional / newFilledQuantity;

  let newStatus = order.orderStatus;
  if (newRemainingQuantity === 0) {
    newStatus = OrderStatus.FILLED;
  } else if (newFilledQuantity > 0) {
    newStatus = OrderStatus.PARTIALLY_FILLED;
  }

  await order.update(
    {
      filledQuantity: newFilledQuantity,
      remainingQuantity: newRemainingQuantity,
      averagePrice: newAveragePrice,
      orderStatus: newStatus,
      lastUpdatedAt: new Date(),
      updatedBy: userId,
    },
    { transaction }
  );

  const fill = await OrderFill.create(
    {
      fillId: `FILL-${Date.now()}`,
      orderId: order.orderId,
      executionId: `EXEC-${Date.now()}`,
      quantity: fillQuantity,
      price: fillPrice,
      notional: fillQuantity * fillPrice,
      fillTime: new Date(),
      fillTimeMicros: Date.now() * 1000,
      cumulativeQuantity: newFilledQuantity,
      averagePrice: newAveragePrice,
      leavesQuantity: newRemainingQuantity,
      fillStatus: newStatus === OrderStatus.FILLED ? 'COMPLETE' : 'PARTIAL',
      venue,
      metadata: {},
      createdBy: userId,
    },
    { transaction }
  );

  return { order, fill };
}

/**
 * Reconcile fills with executions
 */
export async function reconcileFillsWithExecutions(
  orderId: string,
  transaction?: Transaction
): Promise<{ matched: number; unmatched: number; discrepancies: any[] }> {
  const fills = await OrderFill.findAll({ where: { orderId }, transaction });
  const executions = await OrderExecution.findAll({ where: { orderId }, transaction });

  const totalFillQuantity = fills.reduce((sum, f) => sum + f.quantity, 0);
  const totalExecQuantity = executions.reduce((sum, e) => sum + e.quantity, 0);

  const discrepancies: any[] = [];
  if (totalFillQuantity !== totalExecQuantity) {
    discrepancies.push({
      type: 'QUANTITY_MISMATCH',
      fillQuantity: totalFillQuantity,
      executionQuantity: totalExecQuantity,
      difference: totalFillQuantity - totalExecQuantity,
    });
  }

  return {
    matched: Math.min(fills.length, executions.length),
    unmatched: Math.abs(fills.length - executions.length),
    discrepancies,
  };
}

// ============================================================================
// ORDER COMPLIANCE FUNCTIONS
// ============================================================================

/**
 * Check pre-trade compliance for order
 */
export async function checkPreTradeComplianceForOrder(
  orderId: string,
  transaction?: Transaction
): Promise<{ compliant: boolean; checks: any[]; timestamp: Date }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const compliance = await performPreTradeCompliance(order as any, {});

  await order.update(
    {
      complianceChecks: compliance,
    },
    { transaction }
  );

  return compliance;
}

/**
 * Validate order limits and restrictions
 */
export async function validateOrderLimitsAndRestrictions(
  orderId: string,
  transaction?: Transaction
): Promise<{ valid: boolean; violations: string[] }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const violations: string[] = [];

  const positionCheck = await checkPositionLimits(order as any);
  if (!positionCheck.passed) {
    violations.push(positionCheck.message);
  }

  const tradingCheck = await checkTradingLimits(order as any);
  if (!tradingCheck.passed) {
    violations.push(tradingCheck.message);
  }

  return { valid: violations.length === 0, violations };
}

// ============================================================================
// ORDER AUDIT TRAIL FUNCTIONS
// ============================================================================

/**
 * Create order audit event
 */
export async function createOrderAuditEvent(
  orderId: string,
  eventType: string,
  userId: string,
  changes: Record<string, any>,
  description: string,
  transaction?: Transaction
): Promise<OrderAudit> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const audit = await OrderAudit.create(
    {
      auditId: `AUD-${Date.now()}`,
      orderId,
      eventType,
      eventTime: new Date(),
      eventTimeMicros: Date.now() * 1000,
      userId,
      userName: null,
      orderStatus: order.orderStatus,
      previousStatus: null,
      changes,
      fixMessage: null,
      ipAddress: null,
      description,
      metadata: {},
    },
    { transaction }
  );

  return audit;
}

/**
 * Get compliance audit trail for order
 */
export async function getComplianceAuditTrail(
  orderId: string,
  transaction?: Transaction
): Promise<{ events: OrderAudit[]; complianceScore: number }> {
  const audits = await OrderAudit.findAll({
    where: { orderId },
    order: [['eventTime', 'DESC']],
    transaction,
  });

  const complianceScore = 95; // In production, calculate based on actual compliance metrics

  return { events: audits, complianceScore };
}

// ============================================================================
// ORDER LIFECYCLE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Finalize completed order
 */
export async function finalizeCompletedOrder(
  orderId: string,
  userId: string,
  transaction?: Transaction
): Promise<{ order: TradingOrder; finalized: boolean }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (order.orderStatus !== OrderStatus.FILLED) {
    throw new Error(`Order is not filled: ${order.orderStatus}`);
  }

  const result = await finalizeOrder(orderId, transaction);

  await order.update(
    {
      completedAt: result.completedAt,
      orderStatus: result.finalStatus as OrderStatus,
      isActive: false,
      updatedBy: userId,
    },
    { transaction }
  );

  return { order, finalized: result.finalized };
}

/**
 * Archive order after completion
 */
export async function archiveOrderAfterCompletion(
  orderId: string,
  userId: string,
  transaction?: Transaction
): Promise<{ archived: boolean; archiveDate: Date }> {
  const order = await TradingOrder.findOne({ where: { orderId }, transaction });
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  if (!order.completedAt) {
    throw new Error('Order is not completed');
  }

  await order.update(
    {
      isActive: false,
      metadata: {
        ...order.metadata,
        archived: true,
        archivedAt: new Date(),
        archivedBy: userId,
      },
    },
    { transaction }
  );

  return { archived: true, archiveDate: new Date() };
}

// ============================================================================
// BASKET ORDER PROCESSING FUNCTIONS
// ============================================================================

/**
 * Create basket order with multiple securities
 */
export async function createBasketOrderWithSecurities(
  basketId: string,
  orders: Partial<TradingOrderAttributes>[],
  userId: string,
  transaction?: Transaction
): Promise<{ basketId: string; orders: TradingOrder[] }> {
  const basketOrders: TradingOrder[] = [];

  for (const orderData of orders) {
    const order = await createBloombergOrder(
      {
        ...orderData,
        basketOrderId: basketId,
        metadata: {
          ...orderData.metadata,
          basketId,
        },
      },
      userId,
      transaction
    );

    basketOrders.push(order);
  }

  return { basketId, orders: basketOrders };
}

/**
 * Execute basket order across all securities
 */
export async function executeBasketOrderAcrossSecurities(
  basketId: string,
  userId: string,
  transaction?: Transaction
): Promise<{ executed: number; failed: number; results: any[] }> {
  const orders = await TradingOrder.findAll({
    where: { basketOrderId: basketId },
    transaction,
  });

  const results: any[] = [];
  let executed = 0;
  let failed = 0;

  for (const order of orders) {
    try {
      const result = await submitOrder(order.orderId, transaction);
      results.push({ orderId: order.orderId, status: result.status });
      executed++;
    } catch (error) {
      results.push({ orderId: order.orderId, error: (error as Error).message });
      failed++;
    }
  }

  return { executed, failed, results };
}

// ============================================================================
// MULTI-LEG ORDER MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create multi-leg order (e.g., option strategies)
 */
export async function createMultiLegOrder(
  legs: Array<Partial<TradingOrderAttributes>>,
  strategy: string,
  userId: string,
  transaction?: Transaction
): Promise<{ parentOrderId: string; legOrders: TradingOrder[] }> {
  const parentOrder = await createParentOrder(
    {
      ...legs[0],
      metadata: {
        strategy,
        legCount: legs.length,
      },
    },
    userId,
    transaction
  );

  const legOrders: TradingOrder[] = [];

  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    const legOrder = await createBloombergOrder(
      {
        ...leg,
        parentOrderId: parentOrder.orderId,
        metadata: {
          ...leg.metadata,
          legIndex: i,
          strategy,
        },
      },
      userId,
      transaction
    );

    legOrders.push(legOrder);
  }

  return { parentOrderId: parentOrder.orderId, legOrders };
}

/**
 * Execute option strategy with multiple legs
 */
export async function executeOptionStrategyWithLegs(
  parentOrderId: string,
  strategyType: string,
  userId: string,
  transaction?: Transaction
): Promise<{ executed: boolean; legs: any[] }> {
  const legOrders = await TradingOrder.findAll({
    where: { parentOrderId },
    transaction,
  });

  const legResults: any[] = [];

  for (const leg of legOrders) {
    try {
      const result = await submitOrder(leg.orderId, transaction);
      legResults.push({ orderId: leg.orderId, status: result.status });
    } catch (error) {
      legResults.push({ orderId: leg.orderId, error: (error as Error).message });
    }
  }

  return { executed: true, legs: legResults };
}

// ============================================================================
// INITIALIZATION FUNCTION
// ============================================================================

/**
 * Initialize all order management models
 */
export function initializeOrderManagementModels(sequelize: Sequelize): void {
  TradingOrder.initModel(sequelize);
  OrderExecution.initModel(sequelize);
  OrderFill.initModel(sequelize);
  OrderAllocation.initModel(sequelize);
  OrderAudit.initModel(sequelize);
  SmartRoute.initModel(sequelize);
  defineOrderManagementAssociations();
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Models
  TradingOrder,
  OrderExecution,
  OrderFill,
  OrderAllocation,
  OrderAudit,
  SmartRoute,

  // Initialization
  initializeOrderManagementModels,
  defineOrderManagementAssociations,

  // Order Creation and Validation
  createBloombergOrder,
  validateOrderAgainstRiskLimits,
  enrichOrderWithMarketData,
  calculateOrderTotalValue,

  // Order Routing and Execution
  routeOrderToOptimalVenue,
  executeMultiVenueOrder,
  selectBestExecutionVenue,
  optimizeOrderRoutingStrategy,

  // Order Book Management
  updateOrderBookWithOrder,
  getOrderBookDepth,

  // Order Status Tracking
  trackOrderStatusWithEvents,
  getOrderLifecycleHistory,

  // Order Amendment and Cancellation
  amendOrderPrice,
  amendOrderQuantity,
  cancelOrderRequest,
  cancelAllOrdersForSymbol,

  // Parent/Child Order Relationships
  createParentOrder,
  splitOrderToChildren,
  linkChildToParentOrder,
  aggregateChildOrderStatus,

  // Order Allocation and Splitting
  allocateOrderFillsToAccounts,
  splitOrderByAccount,

  // Smart Order Routing
  calculateBestRoutingPath,
  optimizeVenueSelection,

  // Algorithmic Execution
  executeTWAPStrategy,
  executeVWAPStrategy,
  monitorAlgorithmicOrderProgress,

  // Fill Management
  processOrderFillUpdate,
  reconcileFillsWithExecutions,

  // Order Compliance
  checkPreTradeComplianceForOrder,
  validateOrderLimitsAndRestrictions,

  // Order Audit Trail
  createOrderAuditEvent,
  getComplianceAuditTrail,

  // Order Lifecycle Management
  finalizeCompletedOrder,
  archiveOrderAfterCompletion,

  // Basket Order Processing
  createBasketOrderWithSecurities,
  executeBasketOrderAcrossSecurities,

  // Multi-Leg Order Management
  createMultiLegOrder,
  executeOptionStrategyWithLegs,
};
