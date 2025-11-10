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
import { ModelStatic, Sequelize, ModelOptions, FindOptions, Transaction } from 'sequelize';
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
export declare function createOrderHeaderModel(sequelize: Sequelize, modelName?: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
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
export declare function createOrderLineItemModel(sequelize: Sequelize, modelName?: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
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
export declare function associateOrderHeaderAndLineItems(OrderHeader: ModelStatic<any>, OrderLineItem: ModelStatic<any>): void;
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
export declare function createOrderHeader(OrderHeaderModel: ModelStatic<any>, orderData: Partial<OrderHeaderAttributes>, transaction?: Transaction): Promise<any>;
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
export declare function getOrderHeaderById(OrderHeaderModel: ModelStatic<any>, orderId: string, includeLineItems?: boolean, transaction?: Transaction): Promise<any>;
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
export declare function getOrderHeaderByNumber(OrderHeaderModel: ModelStatic<any>, orderNumber: string, includeLineItems?: boolean, transaction?: Transaction): Promise<any>;
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
export declare function updateOrderHeader(OrderHeaderModel: ModelStatic<any>, orderId: string, updates: Partial<OrderHeaderAttributes>, userId: string, transaction?: Transaction): Promise<any>;
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
export declare function cancelOrderHeader(OrderHeaderModel: ModelStatic<any>, orderId: string, userId: string, reason: string, transaction?: Transaction): Promise<any>;
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
export declare function getOrdersByCustomer(OrderHeaderModel: ModelStatic<any>, customerId: string, options?: FindOptions): Promise<any[]>;
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
export declare function getOrdersByStatus(OrderHeaderModel: ModelStatic<any>, status: OrderStatus, options?: FindOptions): Promise<any[]>;
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
export declare function addLineItem(OrderLineItemModel: ModelStatic<any>, orderId: string, lineItemData: Partial<OrderLineItemAttributes>, transaction?: Transaction): Promise<any>;
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
export declare function updateLineItem(OrderLineItemModel: ModelStatic<any>, lineItemId: string, updates: Partial<OrderLineItemAttributes>, userId: string, transaction?: Transaction): Promise<any>;
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
export declare function removeLineItem(OrderLineItemModel: ModelStatic<any>, lineItemId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function reorderLineItems(OrderLineItemModel: ModelStatic<any>, orderId: string, lineOrder: Array<{
    id: string;
    lineNumber: number;
}>, transaction?: Transaction): Promise<void>;
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
export declare function getOrderLineItems(OrderLineItemModel: ModelStatic<any>, orderId: string, options?: FindOptions): Promise<any[]>;
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
export declare function addLineItemConfiguration(OrderLineItemModel: ModelStatic<any>, lineItemId: string, configuration: LineItemConfiguration, transaction?: Transaction): Promise<any>;
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
export declare function getLineItemConfigurations(OrderLineItemModel: ModelStatic<any>, lineItemId: string): Promise<LineItemConfiguration[]>;
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
export declare function calculateLineItemPrice(quantity: number, listPrice: number, discountPercent?: number, taxPercent?: number): PriceCalculationResult;
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
export declare function applyVolumeDiscount(quantity: number, listPrice: number, volumeTiers: Array<{
    minQty: number;
    discountPercent: number;
}>): PriceCalculationResult;
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
export declare function calculateOrderTotals(lineItems: any[], shippingAmount?: number, currencyCode?: CurrencyCode): OrderTotalsSummary;
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
export declare function updateOrderHeaderTotals(OrderHeaderModel: ModelStatic<any>, OrderLineItemModel: ModelStatic<any>, orderId: string, shippingAmount?: number, transaction?: Transaction): Promise<any>;
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
export declare function createKitLineItem(OrderLineItemModel: ModelStatic<any>, orderId: string, kitData: Partial<OrderLineItemAttributes>, components: KitComponent[], transaction?: Transaction): Promise<{
    kit: any;
    components: any[];
}>;
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
export declare function getKitComponents(OrderLineItemModel: ModelStatic<any>, kitLineItemId: string): Promise<any[]>;
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
export declare function explodeKit(OrderLineItemModel: ModelStatic<any>, kitLineItemId: string, transaction?: Transaction): Promise<any[]>;
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
export declare function setOrderHeaderCustomField(OrderHeaderModel: ModelStatic<any>, orderId: string, fieldName: string, fieldValue: any, transaction?: Transaction): Promise<any>;
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
export declare function getOrderHeaderCustomField(OrderHeaderModel: ModelStatic<any>, orderId: string, fieldName: string): Promise<any>;
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
export declare function setLineItemCustomField(OrderLineItemModel: ModelStatic<any>, lineItemId: string, fieldName: string, fieldValue: any, transaction?: Transaction): Promise<any>;
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
export declare function getLineItemCustomField(OrderLineItemModel: ModelStatic<any>, lineItemId: string, fieldName: string): Promise<any>;
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
export declare function convertCurrency(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode, exchangeRate: number): CurrencyConversionResult;
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
export declare function updateOrderCurrency(OrderHeaderModel: ModelStatic<any>, orderId: string, newCurrency: CurrencyCode, exchangeRate: number, transaction?: Transaction): Promise<any>;
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
export declare function convertUOM(quantity: number, fromUOM: UnitOfMeasure, toUOM: UnitOfMeasure, conversionFactor: number): UOMConversionResult;
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
export declare function updateLineItemUOM(OrderLineItemModel: ModelStatic<any>, lineItemId: string, newUOM: UnitOfMeasure, conversionFactor: number, transaction?: Transaction): Promise<any>;
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
export declare function createItemSubstitutionProposal(originalItemId: string, originalSKU: string, substitutedItemId: string, substitutedSKU: string, reason: SubstitutionReason, priceDifference: number, requiresApproval?: boolean): ItemSubstitutionProposal;
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
export declare function applyItemSubstitution(OrderLineItemModel: ModelStatic<any>, lineItemId: string, substitution: ItemSubstitutionProposal, transaction?: Transaction): Promise<any>;
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
export declare function approveItemSubstitution(substitution: ItemSubstitutionProposal, approvedBy: string): ItemSubstitutionProposal;
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
export declare function createBackOrderInfo(lineItemId: string, itemSKU: string, quantityBackordered: number, reason: string, expectedAvailabilityDate?: Date, alternativeItems?: Array<{
    itemId: string;
    itemSKU: string;
    description: string;
    quantityAvailable: number;
    unitPrice: number;
}>): BackOrderInfo;
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
export declare function markLineItemBackordered(OrderLineItemModel: ModelStatic<any>, lineItemId: string, quantityBackordered: number, reason: string, expectedDate?: Date, transaction?: Transaction): Promise<any>;
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
export declare function getBackorderedLineItems(OrderLineItemModel: ModelStatic<any>, orderId: string): Promise<any[]>;
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
export declare function clearBackorderStatus(OrderLineItemModel: ModelStatic<any>, lineItemId: string, transaction?: Transaction): Promise<any>;
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
export declare function generateBackOrderSummary(OrderLineItemModel: ModelStatic<any>, orderId: string): Promise<BackOrderInfo[]>;
declare const _default: {
    createOrderHeaderModel: typeof createOrderHeaderModel;
    createOrderLineItemModel: typeof createOrderLineItemModel;
    associateOrderHeaderAndLineItems: typeof associateOrderHeaderAndLineItems;
    createOrderHeader: typeof createOrderHeader;
    getOrderHeaderById: typeof getOrderHeaderById;
    getOrderHeaderByNumber: typeof getOrderHeaderByNumber;
    updateOrderHeader: typeof updateOrderHeader;
    cancelOrderHeader: typeof cancelOrderHeader;
    getOrdersByCustomer: typeof getOrdersByCustomer;
    getOrdersByStatus: typeof getOrdersByStatus;
    addLineItem: typeof addLineItem;
    updateLineItem: typeof updateLineItem;
    removeLineItem: typeof removeLineItem;
    reorderLineItems: typeof reorderLineItems;
    getOrderLineItems: typeof getOrderLineItems;
    addLineItemConfiguration: typeof addLineItemConfiguration;
    getLineItemConfigurations: typeof getLineItemConfigurations;
    calculateLineItemPrice: typeof calculateLineItemPrice;
    applyVolumeDiscount: typeof applyVolumeDiscount;
    calculateOrderTotals: typeof calculateOrderTotals;
    updateOrderHeaderTotals: typeof updateOrderHeaderTotals;
    createKitLineItem: typeof createKitLineItem;
    getKitComponents: typeof getKitComponents;
    explodeKit: typeof explodeKit;
    setOrderHeaderCustomField: typeof setOrderHeaderCustomField;
    getOrderHeaderCustomField: typeof getOrderHeaderCustomField;
    setLineItemCustomField: typeof setLineItemCustomField;
    getLineItemCustomField: typeof getLineItemCustomField;
    convertCurrency: typeof convertCurrency;
    updateOrderCurrency: typeof updateOrderCurrency;
    convertUOM: typeof convertUOM;
    updateLineItemUOM: typeof updateLineItemUOM;
    createItemSubstitutionProposal: typeof createItemSubstitutionProposal;
    applyItemSubstitution: typeof applyItemSubstitution;
    approveItemSubstitution: typeof approveItemSubstitution;
    createBackOrderInfo: typeof createBackOrderInfo;
    markLineItemBackordered: typeof markLineItemBackordered;
    getBackorderedLineItems: typeof getBackorderedLineItems;
    clearBackorderStatus: typeof clearBackorderStatus;
    generateBackOrderSummary: typeof generateBackOrderSummary;
};
export default _default;
//# sourceMappingURL=order-header-detail-kit.d.ts.map