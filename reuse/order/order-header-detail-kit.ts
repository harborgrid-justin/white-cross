/**
 * LOC: ORDHDR001
 * File: /reuse/order/order-header-detail-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/validator (v13.x)
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *
 * DOWNSTREAM (imported by):
 *   - Order management modules
 *   - Inventory management
 *   - Billing and invoicing
 *   - Supply chain integration
 */

/**
 * File: /reuse/order/order-header-detail-kit.ts
 * Locator: WC-ORD-HDRDTL-001
 * Purpose: Order Header & Detail Management - Complete header/line item operations
 *
 * Upstream: sequelize v6.x, @nestjs/common v10.x, @nestjs/swagger v7.x, @types/validator v13.x
 * Downstream: Order processing, inventory management, billing systems, supply chain
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, NestJS 10.x
 * Exports: 40+ functions for order header CRUD, line item management, pricing, bundling, multi-currency, UOM conversions
 *
 * LLM Context: Production-grade Sequelize v6.x order management toolkit for White Cross healthcare platform.
 * Provides comprehensive order header and line item management including CRUD operations, pricing calculations,
 * bundling/kitting, multi-currency support, unit of measure conversions, item substitutions, and back-order handling.
 * HIPAA-compliant with audit trails, temporal tracking, and comprehensive validation for healthcare supply ordering.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  InitOptions,
  IndexOptions,
  ValidationOptions,
  Hooks,
  CreateOptions,
  FindOptions,
  WhereOptions,
  UpdateOptions,
  DestroyOptions,
  Op,
  Association,
  ScopeOptions,
  QueryInterface,
  Transaction,
  Identifier,
  Utils,
  ModelAttributeColumnOptions,
  HasManyOptions,
  BelongsToOptions,
  HasOneOptions,
} from 'sequelize';
import { isEmail, isUUID, isURL, isPostalCode, isISO8601, isDecimal, isNumeric } from 'validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsArray, IsDate, IsUUID as ClassIsUUID, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Order status enumeration
 */
export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'processing' | 'partially_fulfilled' | 'fulfilled' | 'cancelled' | 'on_hold' | 'backordered';

/**
 * Order type enumeration
 */
export type OrderType = 'standard' | 'rush' | 'emergency' | 'consignment' | 'drop_ship' | 'standing' | 'blanket';

/**
 * Line item status enumeration
 */
export type LineItemStatus = 'pending' | 'confirmed' | 'allocated' | 'picked' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'backordered' | 'substituted';

/**
 * Currency code (ISO 4217)
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'INR' | 'MXN';

/**
 * Unit of measure type
 */
export type UnitOfMeasure = 'EA' | 'BX' | 'CS' | 'PK' | 'DZ' | 'KG' | 'LB' | 'L' | 'GAL' | 'M' | 'FT' | 'SET';

/**
 * Price type
 */
export type PriceType = 'list' | 'contract' | 'promotional' | 'discount' | 'wholesale' | 'retail';

/**
 * Tax calculation method
 */
export type TaxCalculationMethod = 'none' | 'sales_tax' | 'vat' | 'gst' | 'hst' | 'custom';

/**
 * Substitution reason
 */
export type SubstitutionReason = 'out_of_stock' | 'discontinued' | 'upgrade' | 'downgrade' | 'customer_request' | 'quality_issue';

/**
 * Order header attributes interface
 */
export interface OrderHeaderAttributes {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  orderDate: Date;
  requestedDeliveryDate?: Date;
  promisedDeliveryDate?: Date;
  customerId: string;
  customerPO?: string;
  billToAddressId: string;
  shipToAddressId: string;
  paymentTerms?: string;
  shippingMethod?: string;
  currencyCode: CurrencyCode;
  exchangeRate: number;
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  internalNotes?: string;
  source?: string;
  sourceReferenceId?: string;
  salesRepId?: string;
  departmentId?: string;
  costCenterId?: string;
  customFields?: Record<string, any>;
  createdBy: string;
  updatedBy?: string;
  approvedBy?: string;
  approvedAt?: Date;
  cancelledBy?: string;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Order line item attributes interface
 */
export interface OrderLineItemAttributes {
  id: string;
  orderId: string;
  lineNumber: number;
  itemId: string;
  itemSKU: string;
  itemDescription: string;
  itemCategory?: string;
  quantityOrdered: number;
  quantityConfirmed: number;
  quantityShipped: number;
  quantityDelivered: number;
  quantityCancelled: number;
  quantityBackordered: number;
  unitOfMeasure: UnitOfMeasure;
  unitPrice: number;
  listPrice: number;
  priceType: PriceType;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  lineTotal: number;
  lineStatus: LineItemStatus;
  requestedDeliveryDate?: Date;
  promisedDeliveryDate?: Date;
  lotNumber?: string;
  serialNumber?: string;
  expirationDate?: Date;
  warehouseId?: string;
  locationId?: string;
  isKit: boolean;
  parentLineId?: string;
  substitutedItemId?: string;
  substitutionReason?: SubstitutionReason;
  backorderedReason?: string;
  customFields?: Record<string, any>;
  notes?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Line item configuration options
 */
export interface LineItemConfiguration {
  configurationKey: string;
  configurationType: 'option' | 'attribute' | 'customization';
  configurationValue: string | number | boolean;
  displayName?: string;
  priceImpact?: number;
}

/**
 * Bundle/Kit component
 */
export interface KitComponent {
  componentItemId: string;
  componentSKU: string;
  componentDescription: string;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  isOptional: boolean;
  canSubstitute: boolean;
}

/**
 * Price calculation result
 */
export interface PriceCalculationResult {
  listPrice: number;
  unitPrice: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  taxPercent: number;
  lineTotal: number;
  breakdown: {
    basePrice: number;
    volumeDiscount: number;
    promotionalDiscount: number;
    contractDiscount: number;
    tax: number;
  };
}

/**
 * Currency conversion result
 */
export interface CurrencyConversionResult {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  exchangeRate: number;
  originalAmount: number;
  convertedAmount: number;
  conversionDate: Date;
}

/**
 * UOM conversion result
 */
export interface UOMConversionResult {
  fromUOM: UnitOfMeasure;
  toUOM: UnitOfMeasure;
  conversionFactor: number;
  originalQuantity: number;
  convertedQuantity: number;
}

/**
 * Order totals summary
 */
export interface OrderTotalsSummary {
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  shippingCost: number;
  totalAmount: number;
  lineItemCount: number;
  totalQuantity: number;
  currencyCode: CurrencyCode;
}

/**
 * Back order information
 */
export interface BackOrderInfo {
  lineItemId: string;
  itemSKU: string;
  quantityBackordered: number;
  expectedAvailabilityDate?: Date;
  alternativeItems: Array<{
    itemId: string;
    itemSKU: string;
    description: string;
    quantityAvailable: number;
    unitPrice: number;
  }>;
  reason: string;
}

/**
 * Item substitution proposal
 */
export interface ItemSubstitutionProposal {
  originalItemId: string;
  originalSKU: string;
  substitutedItemId: string;
  substitutedSKU: string;
  reason: SubstitutionReason;
  priceDifference: number;
  requiresApproval: boolean;
  approved?: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

// ============================================================================
// ORDER HEADER MODEL BUILDERS
// ============================================================================

/**
 * 1. Creates a comprehensive Order Header model.
 * Tracks order metadata, customer info, totals, and status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Order Header model
 *
 * @example
 * ```typescript
 * const OrderHeader = createOrderHeaderModel(sequelize, 'OrderHeader', {
 *   paranoid: true,
 *   indexes: [
 *     { fields: ['orderNumber'], unique: true },
 *     { fields: ['customerId'] },
 *     { fields: ['orderStatus'] },
 *     { fields: ['orderDate'] }
 *   ]
 * });
 *
 * const order = await OrderHeader.create({
 *   orderNumber: 'ORD-2025-001',
 *   orderType: 'standard',
 *   orderStatus: 'pending',
 *   orderDate: new Date(),
 *   customerId: 'cust-123',
 *   billToAddressId: 'addr-456',
 *   shipToAddressId: 'addr-789',
 *   currencyCode: 'USD',
 *   exchangeRate: 1.0,
 *   createdBy: 'user-001'
 * });
 * ```
 */
export function createOrderHeaderModel(
  sequelize: Sequelize,
  modelName: string = 'OrderHeader',
  options: Partial<ModelOptions<any>> = {},
): ModelStatic<any> {
  const attributes: ModelAttributes<any> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'Primary key',
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Unique order number',
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    orderType: {
      type: DataTypes.ENUM('standard', 'rush', 'emergency', 'consignment', 'drop_ship', 'standing', 'blanket'),
      allowNull: false,
      defaultValue: 'standard',
      comment: 'Type of order',
    },
    orderStatus: {
      type: DataTypes.ENUM('draft', 'pending', 'confirmed', 'processing', 'partially_fulfilled', 'fulfilled', 'cancelled', 'on_hold', 'backordered'),
      allowNull: false,
      defaultValue: 'draft',
      comment: 'Current order status',
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Order creation date',
      validate: {
        isDate: true,
      },
    },
    requestedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Customer requested delivery date',
      validate: {
        isDate: true,
      },
    },
    promisedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Promised delivery date to customer',
      validate: {
        isDate: true,
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Customer reference',
      validate: {
        isUUID: 4,
      },
    },
    customerPO: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Customer purchase order number',
    },
    billToAddressId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Billing address reference',
      validate: {
        isUUID: 4,
      },
    },
    shipToAddressId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Shipping address reference',
      validate: {
        isUUID: 4,
      },
    },
    paymentTerms: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Payment terms (e.g., Net 30)',
    },
    shippingMethod: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Shipping method/carrier',
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      comment: 'ISO 4217 currency code',
      validate: {
        len: [3, 3],
      },
    },
    exchangeRate: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: false,
      defaultValue: 1.0,
      comment: 'Exchange rate to base currency',
      validate: {
        min: 0.000001,
      },
    },
    subtotalAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Order subtotal before tax/shipping',
      validate: {
        min: 0,
      },
    },
    taxAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Total tax amount',
      validate: {
        min: 0,
      },
    },
    shippingAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Shipping and handling charges',
      validate: {
        min: 0,
      },
    },
    discountAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Total discount amount',
      validate: {
        min: 0,
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Final order total',
      validate: {
        min: 0,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Customer-visible notes',
    },
    internalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Internal notes (not visible to customer)',
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Order source (e.g., web, phone, EDI)',
    },
    sourceReferenceId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'External system reference ID',
    },
    salesRepId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Sales representative reference',
      validate: {
        isUUID: 4,
      },
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Department reference',
      validate: {
        isUUID: 4,
      },
    },
    costCenterId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Cost center reference',
      validate: {
        isUUID: 4,
      },
    },
    customFields: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Custom field values as JSON',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who created the order',
      validate: {
        isUUID: 4,
      },
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who last updated the order',
      validate: {
        isUUID: 4,
      },
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who approved the order',
      validate: {
        isUUID: 4,
      },
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Order approval timestamp',
    },
    cancelledBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who cancelled the order',
      validate: {
        isUUID: 4,
      },
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Order cancellation timestamp',
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for order cancellation',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const defaultOptions: ModelOptions<any> = {
    sequelize,
    modelName,
    tableName: options.tableName || 'order_headers',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { fields: ['order_number'], unique: true },
      { fields: ['customer_id'] },
      { fields: ['order_status'] },
      { fields: ['order_date'] },
      { fields: ['created_by'] },
      { fields: ['order_type', 'order_status'] },
    ],
    hooks: {
      beforeValidate: (instance: any) => {
        // Ensure totalAmount is calculated correctly
        instance.totalAmount = (
          parseFloat(instance.subtotalAmount || 0) +
          parseFloat(instance.taxAmount || 0) +
          parseFloat(instance.shippingAmount || 0) -
          parseFloat(instance.discountAmount || 0)
        );
      },
      beforeUpdate: (instance: any) => {
        // Track who updated the order
        if (instance.changed()) {
          instance.updatedAt = new Date();
        }
      },
    },
    scopes: {
      active: {
        where: {
          orderStatus: { [Op.notIn]: ['cancelled', 'fulfilled'] },
          deletedAt: null,
        },
      },
      pending: {
        where: {
          orderStatus: 'pending',
        },
      },
      processing: {
        where: {
          orderStatus: { [Op.in]: ['confirmed', 'processing', 'partially_fulfilled'] },
        },
      },
      byCustomer: (customerId: string) => ({
        where: { customerId },
      }),
      byDateRange: (startDate: Date, endDate: Date) => ({
        where: {
          orderDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      }),
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  class OrderHeader extends Model<OrderHeaderAttributes> implements OrderHeaderAttributes {
    public id!: string;
    public orderNumber!: string;
    public orderType!: OrderType;
    public orderStatus!: OrderStatus;
    public orderDate!: Date;
    public requestedDeliveryDate?: Date;
    public promisedDeliveryDate?: Date;
    public customerId!: string;
    public customerPO?: string;
    public billToAddressId!: string;
    public shipToAddressId!: string;
    public paymentTerms?: string;
    public shippingMethod?: string;
    public currencyCode!: CurrencyCode;
    public exchangeRate!: number;
    public subtotalAmount!: number;
    public taxAmount!: number;
    public shippingAmount!: number;
    public discountAmount!: number;
    public totalAmount!: number;
    public notes?: string;
    public internalNotes?: string;
    public source?: string;
    public sourceReferenceId?: string;
    public salesRepId?: string;
    public departmentId?: string;
    public costCenterId?: string;
    public customFields?: Record<string, any>;
    public createdBy!: string;
    public updatedBy?: string;
    public approvedBy?: string;
    public approvedAt?: Date;
    public cancelledBy?: string;
    public cancelledAt?: Date;
    public cancellationReason?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt?: Date;
  }

  OrderHeader.init(attributes, mergedOptions);

  return OrderHeader;
}

/**
 * 2. Creates a comprehensive Order Line Item model.
 * Tracks individual line items with quantities, pricing, and status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Order Line Item model
 *
 * @example
 * ```typescript
 * const OrderLineItem = createOrderLineItemModel(sequelize, 'OrderLineItem', {
 *   paranoid: true,
 *   indexes: [
 *     { fields: ['orderId', 'lineNumber'], unique: true },
 *     { fields: ['itemId'] },
 *     { fields: ['lineStatus'] }
 *   ]
 * });
 *
 * const lineItem = await OrderLineItem.create({
 *   orderId: 'order-uuid',
 *   lineNumber: 1,
 *   itemId: 'item-123',
 *   itemSKU: 'MED-SUPPLY-001',
 *   itemDescription: 'Surgical Gloves, Size L',
 *   quantityOrdered: 100,
 *   unitOfMeasure: 'BX',
 *   unitPrice: 15.99,
 *   createdBy: 'user-001'
 * });
 * ```
 */
export function createOrderLineItemModel(
  sequelize: Sequelize,
  modelName: string = 'OrderLineItem',
  options: Partial<ModelOptions<any>> = {},
): ModelStatic<any> {
  const attributes: ModelAttributes<any> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'Primary key',
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to order header',
      validate: {
        isUUID: 4,
      },
    },
    lineNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Line item sequence number',
      validate: {
        min: 1,
      },
    },
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Item/product reference',
      validate: {
        isUUID: 4,
      },
    },
    itemSKU: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Item SKU/part number',
      validate: {
        notEmpty: true,
      },
    },
    itemDescription: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Item description',
      validate: {
        notEmpty: true,
      },
    },
    itemCategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Item category classification',
    },
    quantityOrdered: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
      comment: 'Quantity ordered',
      validate: {
        min: 0,
      },
    },
    quantityConfirmed: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
      comment: 'Quantity confirmed for fulfillment',
      validate: {
        min: 0,
      },
    },
    quantityShipped: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
      comment: 'Quantity shipped',
      validate: {
        min: 0,
      },
    },
    quantityDelivered: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
      comment: 'Quantity delivered',
      validate: {
        min: 0,
      },
    },
    quantityCancelled: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
      comment: 'Quantity cancelled',
      validate: {
        min: 0,
      },
    },
    quantityBackordered: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
      comment: 'Quantity backordered',
      validate: {
        min: 0,
      },
    },
    unitOfMeasure: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'EA',
      comment: 'Unit of measure code',
    },
    unitPrice: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: false,
      defaultValue: 0,
      comment: 'Unit price (after discounts)',
      validate: {
        min: 0,
      },
    },
    listPrice: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: false,
      defaultValue: 0,
      comment: 'List price before discounts',
      validate: {
        min: 0,
      },
    },
    priceType: {
      type: DataTypes.ENUM('list', 'contract', 'promotional', 'discount', 'wholesale', 'retail'),
      allowNull: false,
      defaultValue: 'list',
      comment: 'Price type classification',
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Discount percentage',
      validate: {
        min: 0,
        max: 100,
      },
    },
    discountAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Total discount amount for line',
      validate: {
        min: 0,
      },
    },
    taxPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Tax percentage',
      validate: {
        min: 0,
        max: 100,
      },
    },
    taxAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Tax amount for line',
      validate: {
        min: 0,
      },
    },
    lineTotal: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Line total (quantity * unitPrice + tax)',
      validate: {
        min: 0,
      },
    },
    lineStatus: {
      type: DataTypes.ENUM('pending', 'confirmed', 'allocated', 'picked', 'packed', 'shipped', 'delivered', 'cancelled', 'backordered', 'substituted'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Line item status',
    },
    requestedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Requested delivery date for this line',
    },
    promisedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Promised delivery date for this line',
    },
    lotNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Lot/batch number',
    },
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Serial number',
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Product expiration date',
    },
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Warehouse/facility reference',
      validate: {
        isUUID: 4,
      },
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Storage location reference',
      validate: {
        isUUID: 4,
      },
    },
    isKit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indicates if this is a kit/bundle',
    },
    parentLineId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Parent line for kit components',
      validate: {
        isUUID: 4,
      },
    },
    substitutedItemId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Substituted item reference',
      validate: {
        isUUID: 4,
      },
    },
    substitutionReason: {
      type: DataTypes.ENUM('out_of_stock', 'discontinued', 'upgrade', 'downgrade', 'customer_request', 'quality_issue'),
      allowNull: true,
      comment: 'Reason for item substitution',
    },
    backorderedReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for backorder',
    },
    customFields: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Custom field values as JSON',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Line item notes',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who created the line item',
      validate: {
        isUUID: 4,
      },
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who last updated the line item',
      validate: {
        isUUID: 4,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const defaultOptions: ModelOptions<any> = {
    sequelize,
    modelName,
    tableName: options.tableName || 'order_line_items',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { fields: ['order_id', 'line_number'], unique: true },
      { fields: ['order_id'] },
      { fields: ['item_id'] },
      { fields: ['item_sku'] },
      { fields: ['line_status'] },
      { fields: ['parent_line_id'] },
      { fields: ['warehouse_id'] },
    ],
    hooks: {
      beforeValidate: (instance: any) => {
        // Calculate line total
        const quantity = parseFloat(instance.quantityOrdered || 0);
        const unitPrice = parseFloat(instance.unitPrice || 0);
        const taxAmount = parseFloat(instance.taxAmount || 0);
        instance.lineTotal = (quantity * unitPrice) + taxAmount;
      },
      beforeCreate: (instance: any) => {
        // Set quantityConfirmed to quantityOrdered by default
        if (!instance.quantityConfirmed) {
          instance.quantityConfirmed = instance.quantityOrdered;
        }
      },
    },
    scopes: {
      active: {
        where: {
          lineStatus: { [Op.notIn]: ['cancelled', 'delivered'] },
          deletedAt: null,
        },
      },
      pending: {
        where: {
          lineStatus: 'pending',
        },
      },
      backordered: {
        where: {
          lineStatus: 'backordered',
        },
      },
      kits: {
        where: {
          isKit: true,
        },
      },
      kitComponents: {
        where: {
          parentLineId: { [Op.ne]: null },
        },
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  class OrderLineItem extends Model<OrderLineItemAttributes> implements OrderLineItemAttributes {
    public id!: string;
    public orderId!: string;
    public lineNumber!: number;
    public itemId!: string;
    public itemSKU!: string;
    public itemDescription!: string;
    public itemCategory?: string;
    public quantityOrdered!: number;
    public quantityConfirmed!: number;
    public quantityShipped!: number;
    public quantityDelivered!: number;
    public quantityCancelled!: number;
    public quantityBackordered!: number;
    public unitOfMeasure!: UnitOfMeasure;
    public unitPrice!: number;
    public listPrice!: number;
    public priceType!: PriceType;
    public discountPercent!: number;
    public discountAmount!: number;
    public taxPercent!: number;
    public taxAmount!: number;
    public lineTotal!: number;
    public lineStatus!: LineItemStatus;
    public requestedDeliveryDate?: Date;
    public promisedDeliveryDate?: Date;
    public lotNumber?: string;
    public serialNumber?: string;
    public expirationDate?: Date;
    public warehouseId?: string;
    public locationId?: string;
    public isKit!: boolean;
    public parentLineId?: string;
    public substitutedItemId?: string;
    public substitutionReason?: SubstitutionReason;
    public backorderedReason?: string;
    public customFields?: Record<string, any>;
    public notes?: string;
    public createdBy!: string;
    public updatedBy?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt?: Date;
  }

  OrderLineItem.init(attributes, mergedOptions);

  return OrderLineItem;
}

/**
 * 3. Establishes associations between OrderHeader and OrderLineItem models.
 *
 * @param {ModelStatic<any>} OrderHeader - Order header model
 * @param {ModelStatic<any>} OrderLineItem - Order line item model
 * @returns {void}
 *
 * @example
 * ```typescript
 * const OrderHeader = createOrderHeaderModel(sequelize);
 * const OrderLineItem = createOrderLineItemModel(sequelize);
 * associateOrderHeaderAndLineItems(OrderHeader, OrderLineItem);
 *
 * // Now you can use includes
 * const order = await OrderHeader.findOne({
 *   where: { orderNumber: 'ORD-001' },
 *   include: [{ model: OrderLineItem, as: 'lineItems' }]
 * });
 * ```
 */
export function associateOrderHeaderAndLineItems(
  OrderHeader: ModelStatic<any>,
  OrderLineItem: ModelStatic<any>,
): void {
  OrderHeader.hasMany(OrderLineItem, {
    foreignKey: 'orderId',
    as: 'lineItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  OrderLineItem.belongsTo(OrderHeader, {
    foreignKey: 'orderId',
    as: 'order',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // Self-referential association for kit components
  OrderLineItem.hasMany(OrderLineItem, {
    foreignKey: 'parentLineId',
    as: 'kitComponents',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  OrderLineItem.belongsTo(OrderLineItem, {
    foreignKey: 'parentLineId',
    as: 'parentLine',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

// ============================================================================
// ORDER HEADER CRUD OPERATIONS
// ============================================================================

/**
 * 4. Creates a new order header.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {Partial<OrderHeaderAttributes>} orderData - Order data
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Created order
 *
 * @example
 * ```typescript
 * const order = await createOrderHeader(OrderHeader, {
 *   orderNumber: 'ORD-2025-001',
 *   orderType: 'standard',
 *   customerId: 'cust-123',
 *   billToAddressId: 'addr-456',
 *   shipToAddressId: 'addr-789',
 *   currencyCode: 'USD',
 *   createdBy: 'user-001'
 * }, transaction);
 * ```
 */
export async function createOrderHeader(
  OrderHeaderModel: ModelStatic<any>,
  orderData: Partial<OrderHeaderAttributes>,
  transaction?: Transaction,
): Promise<any> {
  try {
    const order = await OrderHeaderModel.create(orderData, { transaction });
    return order;
  } catch (error: any) {
    throw new Error(`Failed to create order header: ${error.message}`);
  }
}

/**
 * 5. Retrieves an order header by ID with optional line items.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {string} orderId - Order ID
 * @param {boolean} includeLineItems - Whether to include line items
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Order header
 *
 * @example
 * ```typescript
 * const order = await getOrderHeaderById(OrderHeader, 'order-uuid', true, transaction);
 * console.log(order.lineItems);
 * ```
 */
export async function getOrderHeaderById(
  OrderHeaderModel: ModelStatic<any>,
  orderId: string,
  includeLineItems: boolean = false,
  transaction?: Transaction,
): Promise<any> {
  try {
    const include = includeLineItems ? [{ association: 'lineItems' }] : [];

    const order = await OrderHeaderModel.findByPk(orderId, {
      include,
      transaction,
    });

    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    return order;
  } catch (error: any) {
    throw new Error(`Failed to retrieve order header: ${error.message}`);
  }
}

/**
 * 6. Retrieves an order header by order number.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {string} orderNumber - Order number
 * @param {boolean} includeLineItems - Whether to include line items
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Order header
 *
 * @example
 * ```typescript
 * const order = await getOrderHeaderByNumber(OrderHeader, 'ORD-2025-001', true);
 * ```
 */
export async function getOrderHeaderByNumber(
  OrderHeaderModel: ModelStatic<any>,
  orderNumber: string,
  includeLineItems: boolean = false,
  transaction?: Transaction,
): Promise<any> {
  try {
    const include = includeLineItems ? [{ association: 'lineItems' }] : [];

    const order = await OrderHeaderModel.findOne({
      where: { orderNumber },
      include,
      transaction,
    });

    if (!order) {
      throw new Error(`Order not found with number: ${orderNumber}`);
    }

    return order;
  } catch (error: any) {
    throw new Error(`Failed to retrieve order by number: ${error.message}`);
  }
}

/**
 * 7. Updates an order header.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {string} orderId - Order ID
 * @param {Partial<OrderHeaderAttributes>} updates - Fields to update
 * @param {string} userId - User making the update
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated order
 *
 * @example
 * ```typescript
 * const updated = await updateOrderHeader(OrderHeader, 'order-uuid', {
 *   orderStatus: 'confirmed',
 *   approvedBy: 'user-002',
 *   approvedAt: new Date()
 * }, 'user-002', transaction);
 * ```
 */
export async function updateOrderHeader(
  OrderHeaderModel: ModelStatic<any>,
  orderId: string,
  updates: Partial<OrderHeaderAttributes>,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  try {
    const order = await OrderHeaderModel.findByPk(orderId, { transaction });

    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    await order.update({ ...updates, updatedBy: userId }, { transaction });

    return order;
  } catch (error: any) {
    throw new Error(`Failed to update order header: ${error.message}`);
  }
}

/**
 * 8. Cancels an order header.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {string} orderId - Order ID
 * @param {string} userId - User cancelling the order
 * @param {string} reason - Cancellation reason
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Cancelled order
 *
 * @example
 * ```typescript
 * const cancelled = await cancelOrderHeader(
 *   OrderHeader,
 *   'order-uuid',
 *   'user-003',
 *   'Customer requested cancellation',
 *   transaction
 * );
 * ```
 */
export async function cancelOrderHeader(
  OrderHeaderModel: ModelStatic<any>,
  orderId: string,
  userId: string,
  reason: string,
  transaction?: Transaction,
): Promise<any> {
  try {
    const order = await OrderHeaderModel.findByPk(orderId, { transaction });

    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    if (order.orderStatus === 'cancelled') {
      throw new Error('Order is already cancelled');
    }

    if (order.orderStatus === 'fulfilled') {
      throw new Error('Cannot cancel fulfilled order');
    }

    await order.update({
      orderStatus: 'cancelled',
      cancelledBy: userId,
      cancelledAt: new Date(),
      cancellationReason: reason,
      updatedBy: userId,
    }, { transaction });

    return order;
  } catch (error: any) {
    throw new Error(`Failed to cancel order: ${error.message}`);
  }
}

/**
 * 9. Retrieves orders by customer ID.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {string} customerId - Customer ID
 * @param {FindOptions} options - Additional query options
 * @returns {Promise<any[]>} Array of orders
 *
 * @example
 * ```typescript
 * const customerOrders = await getOrdersByCustomer(OrderHeader, 'cust-123', {
 *   limit: 10,
 *   order: [['orderDate', 'DESC']]
 * });
 * ```
 */
export async function getOrdersByCustomer(
  OrderHeaderModel: ModelStatic<any>,
  customerId: string,
  options: FindOptions = {},
): Promise<any[]> {
  try {
    const orders = await OrderHeaderModel.findAll({
      where: { customerId },
      ...options,
    });

    return orders;
  } catch (error: any) {
    throw new Error(`Failed to retrieve orders by customer: ${error.message}`);
  }
}

/**
 * 10. Retrieves orders by status.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {OrderStatus} status - Order status
 * @param {FindOptions} options - Additional query options
 * @returns {Promise<any[]>} Array of orders
 *
 * @example
 * ```typescript
 * const pendingOrders = await getOrdersByStatus(OrderHeader, 'pending', {
 *   limit: 50,
 *   include: [{ association: 'lineItems' }]
 * });
 * ```
 */
export async function getOrdersByStatus(
  OrderHeaderModel: ModelStatic<any>,
  status: OrderStatus,
  options: FindOptions = {},
): Promise<any[]> {
  try {
    const orders = await OrderHeaderModel.findAll({
      where: { orderStatus: status },
      ...options,
    });

    return orders;
  } catch (error: any) {
    throw new Error(`Failed to retrieve orders by status: ${error.message}`);
  }
}

// ============================================================================
// LINE ITEM MANAGEMENT
// ============================================================================

/**
 * 11. Adds a line item to an order.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} orderId - Order ID
 * @param {Partial<OrderLineItemAttributes>} lineItemData - Line item data
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Created line item
 *
 * @example
 * ```typescript
 * const lineItem = await addLineItem(OrderLineItem, 'order-uuid', {
 *   lineNumber: 1,
 *   itemId: 'item-123',
 *   itemSKU: 'MED-001',
 *   itemDescription: 'Medical Supply',
 *   quantityOrdered: 50,
 *   unitOfMeasure: 'EA',
 *   unitPrice: 10.50,
 *   createdBy: 'user-001'
 * }, transaction);
 * ```
 */
export async function addLineItem(
  OrderLineItemModel: ModelStatic<any>,
  orderId: string,
  lineItemData: Partial<OrderLineItemAttributes>,
  transaction?: Transaction,
): Promise<any> {
  try {
    const lineItem = await OrderLineItemModel.create({
      ...lineItemData,
      orderId,
    }, { transaction });

    return lineItem;
  } catch (error: any) {
    throw new Error(`Failed to add line item: ${error.message}`);
  }
}

/**
 * 12. Updates a line item.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @param {Partial<OrderLineItemAttributes>} updates - Fields to update
 * @param {string} userId - User making the update
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated line item
 *
 * @example
 * ```typescript
 * const updated = await updateLineItem(OrderLineItem, 'line-uuid', {
 *   quantityOrdered: 75,
 *   lineStatus: 'confirmed'
 * }, 'user-002', transaction);
 * ```
 */
export async function updateLineItem(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
  updates: Partial<OrderLineItemAttributes>,
  userId: string,
  transaction?: Transaction,
): Promise<any> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId, { transaction });

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    await lineItem.update({ ...updates, updatedBy: userId }, { transaction });

    return lineItem;
  } catch (error: any) {
    throw new Error(`Failed to update line item: ${error.message}`);
  }
}

/**
 * 13. Removes a line item from an order.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<boolean>} True if deleted successfully
 *
 * @example
 * ```typescript
 * const deleted = await removeLineItem(OrderLineItem, 'line-uuid', transaction);
 * ```
 */
export async function removeLineItem(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
  transaction?: Transaction,
): Promise<boolean> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId, { transaction });

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    await lineItem.destroy({ transaction });

    return true;
  } catch (error: any) {
    throw new Error(`Failed to remove line item: ${error.message}`);
  }
}

/**
 * 14. Reorders line items by updating line numbers.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} orderId - Order ID
 * @param {Array<{id: string, lineNumber: number}>} lineOrder - New line order
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reorderLineItems(OrderLineItem, 'order-uuid', [
 *   { id: 'line-1', lineNumber: 2 },
 *   { id: 'line-2', lineNumber: 1 }
 * ], transaction);
 * ```
 */
export async function reorderLineItems(
  OrderLineItemModel: ModelStatic<any>,
  orderId: string,
  lineOrder: Array<{ id: string; lineNumber: number }>,
  transaction?: Transaction,
): Promise<void> {
  try {
    for (const line of lineOrder) {
      await OrderLineItemModel.update(
        { lineNumber: line.lineNumber },
        {
          where: { id: line.id, orderId },
          transaction,
        }
      );
    }
  } catch (error: any) {
    throw new Error(`Failed to reorder line items: ${error.message}`);
  }
}

/**
 * 15. Retrieves all line items for an order.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} orderId - Order ID
 * @param {FindOptions} options - Additional query options
 * @returns {Promise<any[]>} Array of line items
 *
 * @example
 * ```typescript
 * const lineItems = await getOrderLineItems(OrderLineItem, 'order-uuid', {
 *   order: [['lineNumber', 'ASC']]
 * });
 * ```
 */
export async function getOrderLineItems(
  OrderLineItemModel: ModelStatic<any>,
  orderId: string,
  options: FindOptions = {},
): Promise<any[]> {
  try {
    const lineItems = await OrderLineItemModel.findAll({
      where: { orderId },
      order: [['lineNumber', 'ASC']],
      ...options,
    });

    return lineItems;
  } catch (error: any) {
    throw new Error(`Failed to retrieve line items: ${error.message}`);
  }
}

// ============================================================================
// LINE ITEM CONFIGURATIONS AND OPTIONS
// ============================================================================

/**
 * 16. Adds configuration to a line item.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @param {LineItemConfiguration} configuration - Configuration to add
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated line item
 *
 * @example
 * ```typescript
 * const updated = await addLineItemConfiguration(OrderLineItem, 'line-uuid', {
 *   configurationKey: 'color',
 *   configurationType: 'option',
 *   configurationValue: 'blue',
 *   displayName: 'Color: Blue',
 *   priceImpact: 5.00
 * }, transaction);
 * ```
 */
export async function addLineItemConfiguration(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
  configuration: LineItemConfiguration,
  transaction?: Transaction,
): Promise<any> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId, { transaction });

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    const customFields = lineItem.customFields || {};
    const configurations = customFields.configurations || [];
    configurations.push(configuration);
    customFields.configurations = configurations;

    await lineItem.update({ customFields }, { transaction });

    return lineItem;
  } catch (error: any) {
    throw new Error(`Failed to add line item configuration: ${error.message}`);
  }
}

/**
 * 17. Retrieves configurations for a line item.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @returns {Promise<LineItemConfiguration[]>} Array of configurations
 *
 * @example
 * ```typescript
 * const configs = await getLineItemConfigurations(OrderLineItem, 'line-uuid');
 * ```
 */
export async function getLineItemConfigurations(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
): Promise<LineItemConfiguration[]> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId);

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    return lineItem.customFields?.configurations || [];
  } catch (error: any) {
    throw new Error(`Failed to retrieve line item configurations: ${error.message}`);
  }
}

// ============================================================================
// LINE ITEM PRICING AND CALCULATIONS
// ============================================================================

/**
 * 18. Calculates line item price with discounts and taxes.
 *
 * @param {number} quantity - Quantity ordered
 * @param {number} listPrice - List price per unit
 * @param {number} discountPercent - Discount percentage
 * @param {number} taxPercent - Tax percentage
 * @returns {PriceCalculationResult} Price calculation breakdown
 *
 * @example
 * ```typescript
 * const pricing = calculateLineItemPrice(100, 15.99, 10, 8.5);
 * // Returns detailed breakdown with discounts and tax
 * ```
 */
export function calculateLineItemPrice(
  quantity: number,
  listPrice: number,
  discountPercent: number = 0,
  taxPercent: number = 0,
): PriceCalculationResult {
  try {
    const basePrice = quantity * listPrice;
    const discountAmount = (basePrice * discountPercent) / 100;
    const unitPrice = listPrice * (1 - discountPercent / 100);
    const subtotal = basePrice - discountAmount;
    const taxAmount = (subtotal * taxPercent) / 100;
    const lineTotal = subtotal + taxAmount;

    return {
      listPrice,
      unitPrice,
      discountAmount,
      discountPercent,
      taxAmount,
      taxPercent,
      lineTotal,
      breakdown: {
        basePrice,
        volumeDiscount: 0,
        promotionalDiscount: discountAmount,
        contractDiscount: 0,
        tax: taxAmount,
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to calculate line item price: ${error.message}`);
  }
}

/**
 * 19. Applies volume discount to line item pricing.
 *
 * @param {number} quantity - Quantity ordered
 * @param {number} listPrice - List price per unit
 * @param {Array<{minQty: number, discountPercent: number}>} volumeTiers - Volume discount tiers
 * @returns {PriceCalculationResult} Price calculation with volume discount
 *
 * @example
 * ```typescript
 * const pricing = applyVolumeDiscount(150, 10.00, [
 *   { minQty: 50, discountPercent: 5 },
 *   { minQty: 100, discountPercent: 10 },
 *   { minQty: 200, discountPercent: 15 }
 * ]);
 * ```
 */
export function applyVolumeDiscount(
  quantity: number,
  listPrice: number,
  volumeTiers: Array<{ minQty: number; discountPercent: number }>,
): PriceCalculationResult {
  try {
    // Sort tiers by minQty descending to find highest applicable tier
    const sortedTiers = volumeTiers.sort((a, b) => b.minQty - a.minQty);

    let discountPercent = 0;
    for (const tier of sortedTiers) {
      if (quantity >= tier.minQty) {
        discountPercent = tier.discountPercent;
        break;
      }
    }

    return calculateLineItemPrice(quantity, listPrice, discountPercent, 0);
  } catch (error: any) {
    throw new Error(`Failed to apply volume discount: ${error.message}`);
  }
}

/**
 * 20. Calculates order totals from line items.
 *
 * @param {any[]} lineItems - Array of line items
 * @param {number} shippingAmount - Shipping cost
 * @param {CurrencyCode} currencyCode - Currency code
 * @returns {OrderTotalsSummary} Order totals summary
 *
 * @example
 * ```typescript
 * const totals = calculateOrderTotals(lineItems, 25.00, 'USD');
 * console.log(totals.totalAmount);
 * ```
 */
export function calculateOrderTotals(
  lineItems: any[],
  shippingAmount: number = 0,
  currencyCode: CurrencyCode = 'USD',
): OrderTotalsSummary {
  try {
    const subtotal = lineItems.reduce((sum, item) => {
      const quantity = parseFloat(item.quantityOrdered || 0);
      const unitPrice = parseFloat(item.unitPrice || 0);
      return sum + (quantity * unitPrice);
    }, 0);

    const totalDiscount = lineItems.reduce((sum, item) => {
      return sum + parseFloat(item.discountAmount || 0);
    }, 0);

    const totalTax = lineItems.reduce((sum, item) => {
      return sum + parseFloat(item.taxAmount || 0);
    }, 0);

    const totalQuantity = lineItems.reduce((sum, item) => {
      return sum + parseFloat(item.quantityOrdered || 0);
    }, 0);

    const totalAmount = subtotal - totalDiscount + totalTax + shippingAmount;

    return {
      subtotal,
      totalDiscount,
      totalTax,
      shippingCost: shippingAmount,
      totalAmount,
      lineItemCount: lineItems.length,
      totalQuantity,
      currencyCode,
    };
  } catch (error: any) {
    throw new Error(`Failed to calculate order totals: ${error.message}`);
  }
}

/**
 * 21. Updates order header totals from line items.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} orderId - Order ID
 * @param {number} shippingAmount - Shipping cost
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated order header
 *
 * @example
 * ```typescript
 * const updated = await updateOrderHeaderTotals(
 *   OrderHeader,
 *   OrderLineItem,
 *   'order-uuid',
 *   25.00,
 *   transaction
 * );
 * ```
 */
export async function updateOrderHeaderTotals(
  OrderHeaderModel: ModelStatic<any>,
  OrderLineItemModel: ModelStatic<any>,
  orderId: string,
  shippingAmount: number = 0,
  transaction?: Transaction,
): Promise<any> {
  try {
    const order = await OrderHeaderModel.findByPk(orderId, { transaction });

    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    const lineItems = await OrderLineItemModel.findAll({
      where: { orderId },
      transaction,
    });

    const totals = calculateOrderTotals(lineItems, shippingAmount, order.currencyCode);

    await order.update({
      subtotalAmount: totals.subtotal,
      discountAmount: totals.totalDiscount,
      taxAmount: totals.totalTax,
      shippingAmount: totals.shippingCost,
      totalAmount: totals.totalAmount,
    }, { transaction });

    return order;
  } catch (error: any) {
    throw new Error(`Failed to update order header totals: ${error.message}`);
  }
}

// ============================================================================
// LINE ITEM BUNDLING AND KITTING
// ============================================================================

/**
 * 22. Creates a kit/bundle line item with components.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} orderId - Order ID
 * @param {Partial<OrderLineItemAttributes>} kitData - Kit line item data
 * @param {KitComponent[]} components - Kit component items
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<{kit: any, components: any[]}>} Created kit and components
 *
 * @example
 * ```typescript
 * const kit = await createKitLineItem(OrderLineItem, 'order-uuid', {
 *   lineNumber: 1,
 *   itemId: 'kit-001',
 *   itemSKU: 'KIT-SURGERY-01',
 *   itemDescription: 'Surgical Kit',
 *   quantityOrdered: 10,
 *   unitPrice: 299.99,
 *   isKit: true,
 *   createdBy: 'user-001'
 * }, [
 *   { componentItemId: 'item-1', componentSKU: 'GLOVE-L', componentDescription: 'Gloves Large', quantity: 2, unitOfMeasure: 'BX', isOptional: false, canSubstitute: true },
 *   { componentItemId: 'item-2', componentSKU: 'MASK-N95', componentDescription: 'N95 Mask', quantity: 5, unitOfMeasure: 'EA', isOptional: false, canSubstitute: false }
 * ], transaction);
 * ```
 */
export async function createKitLineItem(
  OrderLineItemModel: ModelStatic<any>,
  orderId: string,
  kitData: Partial<OrderLineItemAttributes>,
  components: KitComponent[],
  transaction?: Transaction,
): Promise<{ kit: any; components: any[] }> {
  try {
    // Create the kit parent line item
    const kit = await OrderLineItemModel.create({
      ...kitData,
      orderId,
      isKit: true,
    }, { transaction });

    // Create component line items
    const componentLineItems = [];
    let componentLineNumber = 1;

    for (const component of components) {
      const componentLine = await OrderLineItemModel.create({
        orderId,
        lineNumber: kitData.lineNumber! + (componentLineNumber / 100), // e.g., 1.01, 1.02
        itemId: component.componentItemId,
        itemSKU: component.componentSKU,
        itemDescription: component.componentDescription,
        quantityOrdered: component.quantity * (kitData.quantityOrdered || 1),
        unitOfMeasure: component.unitOfMeasure,
        unitPrice: 0, // Component pricing included in kit price
        listPrice: 0,
        priceType: 'list',
        lineStatus: 'pending',
        isKit: false,
        parentLineId: kit.id,
        customFields: {
          isOptional: component.isOptional,
          canSubstitute: component.canSubstitute,
        },
        createdBy: kitData.createdBy!,
      }, { transaction });

      componentLineItems.push(componentLine);
      componentLineNumber++;
    }

    return { kit, components: componentLineItems };
  } catch (error: any) {
    throw new Error(`Failed to create kit line item: ${error.message}`);
  }
}

/**
 * 23. Retrieves kit components for a kit line item.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} kitLineItemId - Kit line item ID
 * @returns {Promise<any[]>} Array of component line items
 *
 * @example
 * ```typescript
 * const components = await getKitComponents(OrderLineItem, 'kit-line-uuid');
 * ```
 */
export async function getKitComponents(
  OrderLineItemModel: ModelStatic<any>,
  kitLineItemId: string,
): Promise<any[]> {
  try {
    const components = await OrderLineItemModel.findAll({
      where: { parentLineId: kitLineItemId },
      order: [['lineNumber', 'ASC']],
    });

    return components;
  } catch (error: any) {
    throw new Error(`Failed to retrieve kit components: ${error.message}`);
  }
}

/**
 * 24. Explodes a kit into individual line items.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} kitLineItemId - Kit line item ID
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any[]>} Array of individual line items
 *
 * @example
 * ```typescript
 * const exploded = await explodeKit(OrderLineItem, 'kit-line-uuid', transaction);
 * ```
 */
export async function explodeKit(
  OrderLineItemModel: ModelStatic<any>,
  kitLineItemId: string,
  transaction?: Transaction,
): Promise<any[]> {
  try {
    const kitLineItem = await OrderLineItemModel.findByPk(kitLineItemId, { transaction });

    if (!kitLineItem || !kitLineItem.isKit) {
      throw new Error('Line item is not a kit');
    }

    const components = await OrderLineItemModel.findAll({
      where: { parentLineId: kitLineItemId },
      transaction,
    });

    // Remove parent relationship and update component line items as standalone
    const explodedItems = [];
    for (const component of components) {
      await component.update({
        parentLineId: null,
        lineStatus: kitLineItem.lineStatus,
      }, { transaction });
      explodedItems.push(component);
    }

    // Mark the kit line item as cancelled
    await kitLineItem.update({
      lineStatus: 'cancelled',
      notes: 'Kit exploded into individual components',
    }, { transaction });

    return explodedItems;
  } catch (error: any) {
    throw new Error(`Failed to explode kit: ${error.message}`);
  }
}

// ============================================================================
// HEADER-LEVEL ATTRIBUTES AND CUSTOM FIELDS
// ============================================================================

/**
 * 25. Sets custom field on order header.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {string} orderId - Order ID
 * @param {string} fieldName - Custom field name
 * @param {any} fieldValue - Custom field value
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated order header
 *
 * @example
 * ```typescript
 * const updated = await setOrderHeaderCustomField(
 *   OrderHeader,
 *   'order-uuid',
 *   'deliveryInstructions',
 *   'Leave at loading dock',
 *   transaction
 * );
 * ```
 */
export async function setOrderHeaderCustomField(
  OrderHeaderModel: ModelStatic<any>,
  orderId: string,
  fieldName: string,
  fieldValue: any,
  transaction?: Transaction,
): Promise<any> {
  try {
    const order = await OrderHeaderModel.findByPk(orderId, { transaction });

    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    const customFields = order.customFields || {};
    customFields[fieldName] = fieldValue;

    await order.update({ customFields }, { transaction });

    return order;
  } catch (error: any) {
    throw new Error(`Failed to set custom field: ${error.message}`);
  }
}

/**
 * 26. Gets custom field from order header.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {string} orderId - Order ID
 * @param {string} fieldName - Custom field name
 * @returns {Promise<any>} Custom field value
 *
 * @example
 * ```typescript
 * const value = await getOrderHeaderCustomField(OrderHeader, 'order-uuid', 'deliveryInstructions');
 * ```
 */
export async function getOrderHeaderCustomField(
  OrderHeaderModel: ModelStatic<any>,
  orderId: string,
  fieldName: string,
): Promise<any> {
  try {
    const order = await OrderHeaderModel.findByPk(orderId);

    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    return order.customFields?.[fieldName];
  } catch (error: any) {
    throw new Error(`Failed to get custom field: ${error.message}`);
  }
}

// ============================================================================
// LINE-LEVEL ATTRIBUTES AND CUSTOM FIELDS
// ============================================================================

/**
 * 27. Sets custom field on line item.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @param {string} fieldName - Custom field name
 * @param {any} fieldValue - Custom field value
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated line item
 *
 * @example
 * ```typescript
 * const updated = await setLineItemCustomField(
 *   OrderLineItem,
 *   'line-uuid',
 *   'specialHandling',
 *   true,
 *   transaction
 * );
 * ```
 */
export async function setLineItemCustomField(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
  fieldName: string,
  fieldValue: any,
  transaction?: Transaction,
): Promise<any> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId, { transaction });

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    const customFields = lineItem.customFields || {};
    customFields[fieldName] = fieldValue;

    await lineItem.update({ customFields }, { transaction });

    return lineItem;
  } catch (error: any) {
    throw new Error(`Failed to set line item custom field: ${error.message}`);
  }
}

/**
 * 28. Gets custom field from line item.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @param {string} fieldName - Custom field name
 * @returns {Promise<any>} Custom field value
 *
 * @example
 * ```typescript
 * const value = await getLineItemCustomField(OrderLineItem, 'line-uuid', 'specialHandling');
 * ```
 */
export async function getLineItemCustomField(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
  fieldName: string,
): Promise<any> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId);

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    return lineItem.customFields?.[fieldName];
  } catch (error: any) {
    throw new Error(`Failed to get line item custom field: ${error.message}`);
  }
}

// ============================================================================
// MULTI-CURRENCY SUPPORT
// ============================================================================

/**
 * 29. Converts amount between currencies.
 *
 * @param {number} amount - Amount to convert
 * @param {CurrencyCode} fromCurrency - Source currency
 * @param {CurrencyCode} toCurrency - Target currency
 * @param {number} exchangeRate - Exchange rate
 * @returns {CurrencyConversionResult} Conversion result
 *
 * @example
 * ```typescript
 * const converted = convertCurrency(1000, 'USD', 'EUR', 0.85);
 * console.log(converted.convertedAmount); // 850
 * ```
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  exchangeRate: number,
): CurrencyConversionResult {
  try {
    if (fromCurrency === toCurrency) {
      return {
        fromCurrency,
        toCurrency,
        exchangeRate: 1.0,
        originalAmount: amount,
        convertedAmount: amount,
        conversionDate: new Date(),
      };
    }

    const convertedAmount = amount * exchangeRate;

    return {
      fromCurrency,
      toCurrency,
      exchangeRate,
      originalAmount: amount,
      convertedAmount: parseFloat(convertedAmount.toFixed(2)),
      conversionDate: new Date(),
    };
  } catch (error: any) {
    throw new Error(`Failed to convert currency: ${error.message}`);
  }
}

/**
 * 30. Updates order currency and recalculates totals.
 *
 * @param {ModelStatic<any>} OrderHeaderModel - Order header model
 * @param {string} orderId - Order ID
 * @param {CurrencyCode} newCurrency - New currency code
 * @param {number} exchangeRate - Exchange rate to new currency
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated order header
 *
 * @example
 * ```typescript
 * const updated = await updateOrderCurrency(
 *   OrderHeader,
 *   'order-uuid',
 *   'EUR',
 *   0.85,
 *   transaction
 * );
 * ```
 */
export async function updateOrderCurrency(
  OrderHeaderModel: ModelStatic<any>,
  orderId: string,
  newCurrency: CurrencyCode,
  exchangeRate: number,
  transaction?: Transaction,
): Promise<any> {
  try {
    const order = await OrderHeaderModel.findByPk(orderId, { transaction });

    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    const oldCurrency = order.currencyCode;

    // Convert all monetary amounts
    const subtotalConverted = convertCurrency(order.subtotalAmount, oldCurrency, newCurrency, exchangeRate);
    const taxConverted = convertCurrency(order.taxAmount, oldCurrency, newCurrency, exchangeRate);
    const shippingConverted = convertCurrency(order.shippingAmount, oldCurrency, newCurrency, exchangeRate);
    const discountConverted = convertCurrency(order.discountAmount, oldCurrency, newCurrency, exchangeRate);

    await order.update({
      currencyCode: newCurrency,
      exchangeRate,
      subtotalAmount: subtotalConverted.convertedAmount,
      taxAmount: taxConverted.convertedAmount,
      shippingAmount: shippingConverted.convertedAmount,
      discountAmount: discountConverted.convertedAmount,
      totalAmount: subtotalConverted.convertedAmount + taxConverted.convertedAmount + shippingConverted.convertedAmount - discountConverted.convertedAmount,
    }, { transaction });

    return order;
  } catch (error: any) {
    throw new Error(`Failed to update order currency: ${error.message}`);
  }
}

// ============================================================================
// UNIT OF MEASURE CONVERSIONS
// ============================================================================

/**
 * 31. Converts quantity between units of measure.
 *
 * @param {number} quantity - Quantity to convert
 * @param {UnitOfMeasure} fromUOM - Source unit of measure
 * @param {UnitOfMeasure} toUOM - Target unit of measure
 * @param {number} conversionFactor - Conversion factor
 * @returns {UOMConversionResult} Conversion result
 *
 * @example
 * ```typescript
 * const converted = convertUOM(10, 'CS', 'EA', 12); // 10 cases = 120 each
 * console.log(converted.convertedQuantity); // 120
 * ```
 */
export function convertUOM(
  quantity: number,
  fromUOM: UnitOfMeasure,
  toUOM: UnitOfMeasure,
  conversionFactor: number,
): UOMConversionResult {
  try {
    if (fromUOM === toUOM) {
      return {
        fromUOM,
        toUOM,
        conversionFactor: 1.0,
        originalQuantity: quantity,
        convertedQuantity: quantity,
      };
    }

    const convertedQuantity = quantity * conversionFactor;

    return {
      fromUOM,
      toUOM,
      conversionFactor,
      originalQuantity: quantity,
      convertedQuantity: parseFloat(convertedQuantity.toFixed(4)),
    };
  } catch (error: any) {
    throw new Error(`Failed to convert UOM: ${error.message}`);
  }
}

/**
 * 32. Updates line item unit of measure with conversion.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @param {UnitOfMeasure} newUOM - New unit of measure
 * @param {number} conversionFactor - Conversion factor
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated line item
 *
 * @example
 * ```typescript
 * const updated = await updateLineItemUOM(
 *   OrderLineItem,
 *   'line-uuid',
 *   'EA',
 *   12, // 1 CS = 12 EA
 *   transaction
 * );
 * ```
 */
export async function updateLineItemUOM(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
  newUOM: UnitOfMeasure,
  conversionFactor: number,
  transaction?: Transaction,
): Promise<any> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId, { transaction });

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    const conversion = convertUOM(
      lineItem.quantityOrdered,
      lineItem.unitOfMeasure,
      newUOM,
      conversionFactor
    );

    // Convert unit price inversely
    const newUnitPrice = lineItem.unitPrice / conversionFactor;

    await lineItem.update({
      unitOfMeasure: newUOM,
      quantityOrdered: conversion.convertedQuantity,
      unitPrice: parseFloat(newUnitPrice.toFixed(6)),
    }, { transaction });

    return lineItem;
  } catch (error: any) {
    throw new Error(`Failed to update line item UOM: ${error.message}`);
  }
}

// ============================================================================
// ITEM SUBSTITUTIONS
// ============================================================================

/**
 * 33. Creates item substitution proposal.
 *
 * @param {string} originalItemId - Original item ID
 * @param {string} originalSKU - Original SKU
 * @param {string} substitutedItemId - Substituted item ID
 * @param {string} substitutedSKU - Substituted SKU
 * @param {SubstitutionReason} reason - Substitution reason
 * @param {number} priceDifference - Price difference
 * @param {boolean} requiresApproval - Whether approval is required
 * @returns {ItemSubstitutionProposal} Substitution proposal
 *
 * @example
 * ```typescript
 * const proposal = createItemSubstitutionProposal(
 *   'item-123',
 *   'MED-001',
 *   'item-456',
 *   'MED-001-ALT',
 *   'out_of_stock',
 *   5.00,
 *   true
 * );
 * ```
 */
export function createItemSubstitutionProposal(
  originalItemId: string,
  originalSKU: string,
  substitutedItemId: string,
  substitutedSKU: string,
  reason: SubstitutionReason,
  priceDifference: number,
  requiresApproval: boolean = true,
): ItemSubstitutionProposal {
  return {
    originalItemId,
    originalSKU,
    substitutedItemId,
    substitutedSKU,
    reason,
    priceDifference,
    requiresApproval,
    approved: false,
  };
}

/**
 * 34. Applies item substitution to line item.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @param {ItemSubstitutionProposal} substitution - Substitution proposal
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated line item
 *
 * @example
 * ```typescript
 * const updated = await applyItemSubstitution(
 *   OrderLineItem,
 *   'line-uuid',
 *   substitutionProposal,
 *   transaction
 * );
 * ```
 */
export async function applyItemSubstitution(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
  substitution: ItemSubstitutionProposal,
  transaction?: Transaction,
): Promise<any> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId, { transaction });

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    if (substitution.requiresApproval && !substitution.approved) {
      throw new Error('Substitution requires approval before application');
    }

    const newUnitPrice = lineItem.unitPrice + substitution.priceDifference;

    await lineItem.update({
      itemId: substitution.substitutedItemId,
      itemSKU: substitution.substitutedSKU,
      substitutedItemId: substitution.originalItemId,
      substitutionReason: substitution.reason,
      unitPrice: newUnitPrice,
      lineStatus: 'substituted',
      notes: `Substituted from ${substitution.originalSKU} - Reason: ${substitution.reason}`,
    }, { transaction });

    return lineItem;
  } catch (error: any) {
    throw new Error(`Failed to apply item substitution: ${error.message}`);
  }
}

/**
 * 35. Approves item substitution.
 *
 * @param {ItemSubstitutionProposal} substitution - Substitution proposal
 * @param {string} approvedBy - User approving the substitution
 * @returns {ItemSubstitutionProposal} Approved substitution
 *
 * @example
 * ```typescript
 * const approved = approveItemSubstitution(substitutionProposal, 'user-002');
 * ```
 */
export function approveItemSubstitution(
  substitution: ItemSubstitutionProposal,
  approvedBy: string,
): ItemSubstitutionProposal {
  return {
    ...substitution,
    approved: true,
    approvedBy,
    approvedAt: new Date(),
  };
}

// ============================================================================
// BACK-ORDERED ITEM HANDLING
// ============================================================================

/**
 * 36. Creates back order information.
 *
 * @param {string} lineItemId - Line item ID
 * @param {string} itemSKU - Item SKU
 * @param {number} quantityBackordered - Quantity backordered
 * @param {string} reason - Back order reason
 * @param {Date} expectedAvailabilityDate - Expected availability date
 * @param {Array<any>} alternativeItems - Alternative item options
 * @returns {BackOrderInfo} Back order information
 *
 * @example
 * ```typescript
 * const backOrder = createBackOrderInfo(
 *   'line-uuid',
 *   'MED-001',
 *   50,
 *   'Out of stock - awaiting shipment',
 *   new Date('2025-12-01'),
 *   [
 *     { itemId: 'item-alt', itemSKU: 'MED-001-ALT', description: 'Alternative', quantityAvailable: 100, unitPrice: 15.99 }
 *   ]
 * );
 * ```
 */
export function createBackOrderInfo(
  lineItemId: string,
  itemSKU: string,
  quantityBackordered: number,
  reason: string,
  expectedAvailabilityDate?: Date,
  alternativeItems: Array<{
    itemId: string;
    itemSKU: string;
    description: string;
    quantityAvailable: number;
    unitPrice: number;
  }> = [],
): BackOrderInfo {
  return {
    lineItemId,
    itemSKU,
    quantityBackordered,
    expectedAvailabilityDate,
    alternativeItems,
    reason,
  };
}

/**
 * 37. Marks line item as backordered.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @param {number} quantityBackordered - Quantity to backorder
 * @param {string} reason - Back order reason
 * @param {Date} expectedDate - Expected availability date
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated line item
 *
 * @example
 * ```typescript
 * const backordered = await markLineItemBackordered(
 *   OrderLineItem,
 *   'line-uuid',
 *   25,
 *   'Insufficient inventory',
 *   new Date('2025-12-15'),
 *   transaction
 * );
 * ```
 */
export async function markLineItemBackordered(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
  quantityBackordered: number,
  reason: string,
  expectedDate?: Date,
  transaction?: Transaction,
): Promise<any> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId, { transaction });

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    if (quantityBackordered > lineItem.quantityOrdered) {
      throw new Error('Backordered quantity cannot exceed ordered quantity');
    }

    await lineItem.update({
      quantityBackordered,
      lineStatus: 'backordered',
      backorderedReason: reason,
      promisedDeliveryDate: expectedDate,
    }, { transaction });

    return lineItem;
  } catch (error: any) {
    throw new Error(`Failed to mark line item as backordered: ${error.message}`);
  }
}

/**
 * 38. Retrieves all backordered line items for an order.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} orderId - Order ID
 * @returns {Promise<any[]>} Array of backordered line items
 *
 * @example
 * ```typescript
 * const backordered = await getBackorderedLineItems(OrderLineItem, 'order-uuid');
 * ```
 */
export async function getBackorderedLineItems(
  OrderLineItemModel: ModelStatic<any>,
  orderId: string,
): Promise<any[]> {
  try {
    const backorderedItems = await OrderLineItemModel.findAll({
      where: {
        orderId,
        lineStatus: 'backordered',
        quantityBackordered: { [Op.gt]: 0 },
      },
      order: [['lineNumber', 'ASC']],
    });

    return backorderedItems;
  } catch (error: any) {
    throw new Error(`Failed to retrieve backordered line items: ${error.message}`);
  }
}

/**
 * 39. Clears backorder status when inventory becomes available.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} lineItemId - Line item ID
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Updated line item
 *
 * @example
 * ```typescript
 * const cleared = await clearBackorderStatus(OrderLineItem, 'line-uuid', transaction);
 * ```
 */
export async function clearBackorderStatus(
  OrderLineItemModel: ModelStatic<any>,
  lineItemId: string,
  transaction?: Transaction,
): Promise<any> {
  try {
    const lineItem = await OrderLineItemModel.findByPk(lineItemId, { transaction });

    if (!lineItem) {
      throw new Error(`Line item not found with ID: ${lineItemId}`);
    }

    await lineItem.update({
      quantityBackordered: 0,
      lineStatus: 'confirmed',
      backorderedReason: null,
    }, { transaction });

    return lineItem;
  } catch (error: any) {
    throw new Error(`Failed to clear backorder status: ${error.message}`);
  }
}

/**
 * 40. Generates back order summary for an order.
 *
 * @param {ModelStatic<any>} OrderLineItemModel - Line item model
 * @param {string} orderId - Order ID
 * @returns {Promise<BackOrderInfo[]>} Array of back order information
 *
 * @example
 * ```typescript
 * const summary = await generateBackOrderSummary(OrderLineItem, 'order-uuid');
 * console.log(summary);
 * ```
 */
export async function generateBackOrderSummary(
  OrderLineItemModel: ModelStatic<any>,
  orderId: string,
): Promise<BackOrderInfo[]> {
  try {
    const backorderedItems = await getBackorderedLineItems(OrderLineItemModel, orderId);

    const summary: BackOrderInfo[] = backorderedItems.map((item) => ({
      lineItemId: item.id,
      itemSKU: item.itemSKU,
      quantityBackordered: item.quantityBackordered,
      expectedAvailabilityDate: item.promisedDeliveryDate,
      alternativeItems: [],
      reason: item.backorderedReason || 'No reason provided',
    }));

    return summary;
  } catch (error: any) {
    throw new Error(`Failed to generate back order summary: ${error.message}`);
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Model builders
  createOrderHeaderModel,
  createOrderLineItemModel,
  associateOrderHeaderAndLineItems,

  // Order header CRUD
  createOrderHeader,
  getOrderHeaderById,
  getOrderHeaderByNumber,
  updateOrderHeader,
  cancelOrderHeader,
  getOrdersByCustomer,
  getOrdersByStatus,

  // Line item management
  addLineItem,
  updateLineItem,
  removeLineItem,
  reorderLineItems,
  getOrderLineItems,

  // Line item configurations
  addLineItemConfiguration,
  getLineItemConfigurations,

  // Pricing and calculations
  calculateLineItemPrice,
  applyVolumeDiscount,
  calculateOrderTotals,
  updateOrderHeaderTotals,

  // Bundling and kitting
  createKitLineItem,
  getKitComponents,
  explodeKit,

  // Custom fields
  setOrderHeaderCustomField,
  getOrderHeaderCustomField,
  setLineItemCustomField,
  getLineItemCustomField,

  // Multi-currency
  convertCurrency,
  updateOrderCurrency,

  // UOM conversions
  convertUOM,
  updateLineItemUOM,

  // Item substitutions
  createItemSubstitutionProposal,
  applyItemSubstitution,
  approveItemSubstitution,

  // Back order handling
  createBackOrderInfo,
  markLineItemBackordered,
  getBackorderedLineItems,
  clearBackorderStatus,
  generateBackOrderSummary,
};
