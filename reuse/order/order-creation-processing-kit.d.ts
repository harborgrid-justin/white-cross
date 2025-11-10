/**
 * LOC: ORD-CRT-001
 * File: /reuse/order/order-creation-processing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Order services
 *   - Order processors
 */
import { Model } from 'sequelize-typescript';
/**
 * Order source channels for multi-channel order capture
 */
export declare enum OrderSource {
    WEB = "WEB",
    MOBILE = "MOBILE",
    PHONE = "PHONE",
    EMAIL = "EMAIL",
    FAX = "FAX",
    EDI = "EDI",
    API = "API",
    POS = "POS",
    SALES_REP = "SALES_REP",
    MARKETPLACE = "MARKETPLACE",
    SOCIAL_MEDIA = "SOCIAL_MEDIA",
    PARTNER = "PARTNER"
}
/**
 * Order status for workflow management
 */
export declare enum OrderStatus {
    DRAFT = "DRAFT",
    PENDING_VALIDATION = "PENDING_VALIDATION",
    VALIDATED = "VALIDATED",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
    PROCESSING = "PROCESSING",
    CONFIRMED = "CONFIRMED",
    ON_HOLD = "ON_HOLD",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
/**
 * Order type classifications
 */
export declare enum OrderType {
    STANDARD = "STANDARD",
    RUSH = "RUSH",
    BACKORDER = "BACKORDER",
    PREORDER = "PREORDER",
    SUBSCRIPTION = "SUBSCRIPTION",
    SAMPLE = "SAMPLE",
    WARRANTY = "WARRANTY",
    RETURN_EXCHANGE = "RETURN_EXCHANGE",
    QUOTE = "QUOTE",
    CONTRACT = "CONTRACT"
}
/**
 * Order priority levels
 */
export declare enum OrderPriority {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT",
    CRITICAL = "CRITICAL"
}
/**
 * Payment terms
 */
export declare enum PaymentTerms {
    NET_30 = "NET_30",
    NET_60 = "NET_60",
    NET_90 = "NET_90",
    COD = "COD",
    PREPAID = "PREPAID",
    DUE_ON_RECEIPT = "DUE_ON_RECEIPT",
    CREDIT_CARD = "CREDIT_CARD",
    INSTALLMENT = "INSTALLMENT"
}
/**
 * Shipping method types
 */
export declare enum ShippingMethod {
    STANDARD = "STANDARD",
    EXPRESS = "EXPRESS",
    OVERNIGHT = "OVERNIGHT",
    TWO_DAY = "TWO_DAY",
    GROUND = "GROUND",
    FREIGHT = "FREIGHT",
    PICKUP = "PICKUP",
    DROP_SHIP = "DROP_SHIP"
}
/**
 * Tax calculation methods
 */
export declare enum TaxCalculationMethod {
    ORIGIN_BASED = "ORIGIN_BASED",
    DESTINATION_BASED = "DESTINATION_BASED",
    HYBRID = "HYBRID",
    VAT = "VAT",
    GST = "GST",
    EXEMPT = "EXEMPT"
}
/**
 * Credit check status
 */
export declare enum CreditCheckStatus {
    NOT_REQUIRED = "NOT_REQUIRED",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    DECLINED = "DECLINED",
    MANUAL_REVIEW = "MANUAL_REVIEW",
    OVER_LIMIT = "OVER_LIMIT"
}
/**
 * Validation error severity
 */
export declare enum ValidationSeverity {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO"
}
/**
 * Address information
 */
export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    addressType?: 'BILLING' | 'SHIPPING' | 'BOTH';
    isValidated?: boolean;
    validationTimestamp?: Date;
}
/**
 * Customer information for order
 */
export interface CustomerInfo {
    customerId: string;
    customerNumber?: string;
    customerName: string;
    email?: string;
    phone?: string;
    billingAddress: Address;
    shippingAddress?: Address;
    taxExempt?: boolean;
    taxExemptNumber?: string;
    creditLimit?: number;
    currentBalance?: number;
    paymentTerms: PaymentTerms;
}
/**
 * Order line item
 */
export interface OrderLineItem {
    lineNumber: number;
    itemId: string;
    itemNumber: string;
    itemDescription: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    discount?: number;
    discountPercent?: number;
    taxAmount?: number;
    taxRate?: number;
    lineTotal: number;
    requestedDeliveryDate?: Date;
    warehouseId?: string;
    notes?: string;
    customFields?: Record<string, unknown>;
}
/**
 * Order pricing breakdown
 */
export interface OrderPricing {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    handlingAmount: number;
    totalAmount: number;
    currency: string;
}
/**
 * Order validation result
 */
export interface OrderValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    validatedAt: Date;
}
/**
 * Validation error detail
 */
export interface ValidationError {
    code: string;
    field?: string;
    message: string;
    severity: ValidationSeverity;
    details?: Record<string, unknown>;
}
/**
 * Credit check result
 */
export interface CreditCheckResult {
    status: CreditCheckStatus;
    creditLimit: number;
    currentBalance: number;
    availableCredit: number;
    orderAmount: number;
    approved: boolean;
    reason?: string;
    checkedAt: Date;
    checkedBy?: string;
}
/**
 * Inventory availability result
 */
export interface InventoryAvailability {
    itemId: string;
    warehouseId: string;
    quantityRequested: number;
    quantityAvailable: number;
    quantityOnHand: number;
    quantityReserved: number;
    quantityBackordered: number;
    isAvailable: boolean;
    expectedAvailabilityDate?: Date;
}
/**
 * Order creation request DTO
 */
export declare class CreateOrderDto {
    orderSource: OrderSource;
    orderType: OrderType;
    priority: OrderPriority;
    customer: CustomerInfo;
    lineItems: OrderLineItem[];
    shippingMethod?: ShippingMethod;
    requestedDeliveryDate?: Date;
    poNumber?: string;
    notes?: string;
    salesRepId?: string;
    customFields?: Record<string, unknown>;
}
/**
 * Order template for quick entry
 */
export interface OrderTemplate {
    templateId: string;
    templateName: string;
    description?: string;
    customerId?: string;
    orderType: OrderType;
    lineItems: Partial<OrderLineItem>[];
    shippingMethod?: ShippingMethod;
    createdBy: string;
    createdAt: Date;
    isActive: boolean;
}
/**
 * Bulk order import record
 */
export interface BulkOrderImportRecord {
    rowNumber: number;
    customerId: string;
    itemId: string;
    quantity: number;
    unitPrice?: number;
    requestedDeliveryDate?: Date;
    poNumber?: string;
    errors?: string[];
    isValid: boolean;
}
/**
 * Order split configuration
 */
export interface OrderSplitConfig {
    splitBy: 'WAREHOUSE' | 'SHIP_DATE' | 'CUSTOM';
    preserveOrderNumber: boolean;
    generateChildOrders: boolean;
}
/**
 * Order merge configuration
 */
export interface OrderMergeConfig {
    orderIds: string[];
    mergeShippingCharges: boolean;
    useLowestTaxRate: boolean;
    consolidateLineItems: boolean;
}
/**
 * Price calculation context
 */
export interface PriceCalculationContext {
    customerId: string;
    itemId: string;
    quantity: number;
    orderDate: Date;
    customerPriceGroup?: string;
    promotionCode?: string;
    contractId?: string;
}
/**
 * Tax calculation context
 */
export interface TaxCalculationContext {
    customerId: string;
    shipToAddress: Address;
    shipFromAddress: Address;
    lineItems: OrderLineItem[];
    orderDate: Date;
    taxExempt: boolean;
    taxExemptNumber?: string;
}
/**
 * Shipping calculation context
 */
export interface ShippingCalculationContext {
    shipToAddress: Address;
    shipFromAddress: Address;
    shippingMethod: ShippingMethod;
    totalWeight: number;
    totalVolume: number;
    declaredValue: number;
    lineItems: OrderLineItem[];
}
/**
 * Order header model
 */
export declare class OrderHeader extends Model {
    orderId: string;
    orderNumber: string;
    customerId: string;
    orderDate: Date;
    orderSource: OrderSource;
    orderType: OrderType;
    orderStatus: OrderStatus;
    priority: OrderPriority;
    customerInfo: CustomerInfo;
    billingAddress: Address;
    shippingAddress: Address;
    shippingMethod: ShippingMethod;
    paymentTerms: PaymentTerms;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    currency: string;
    poNumber: string;
    requestedDeliveryDate: Date;
    salesRepId: string;
    notes: string;
    creditCheckStatus: CreditCheckStatus;
    creditCheckResult: CreditCheckResult;
    validationResult: OrderValidationResult;
    parentOrderId: string;
    customFields: Record<string, unknown>;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    lines: OrderLine[];
}
/**
 * Order line model
 */
export declare class OrderLine extends Model {
    orderLineId: string;
    orderId: string;
    order: OrderHeader;
    lineNumber: number;
    itemId: string;
    itemNumber: string;
    itemDescription: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    discount: number;
    discountPercent: number;
    taxAmount: number;
    taxRate: number;
    lineTotal: number;
    requestedDeliveryDate: Date;
    warehouseId: string;
    notes: string;
    customFields: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Order template model
 */
export declare class OrderTemplateModel extends Model {
    templateId: string;
    templateName: string;
    description: string;
    customerId: string;
    orderType: OrderType;
    lineItems: Partial<OrderLineItem>[];
    shippingMethod: ShippingMethod;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Generate unique order number with prefix and sequence
 *
 * @param prefix - Order number prefix (e.g., 'SO', 'PO')
 * @param sequence - Sequence number
 * @param length - Total length of numeric portion
 * @returns Formatted order number
 *
 * @example
 * generateOrderNumber('SO', 12345, 8) // Returns: 'SO00012345'
 */
export declare function generateOrderNumber(prefix: string, sequence: number, length?: number): string;
/**
 * Create order from web channel
 *
 * @param orderData - Order creation data
 * @param userId - User ID creating the order
 * @returns Created order header
 *
 * @example
 * const order = await createWebOrder(orderDto, 'user-123');
 */
export declare function createWebOrder(orderData: CreateOrderDto, userId: string): Promise<OrderHeader>;
/**
 * Create order from mobile channel
 *
 * @param orderData - Order creation data
 * @param deviceInfo - Mobile device information
 * @param userId - User ID creating the order
 * @returns Created order header
 */
export declare function createMobileOrder(orderData: CreateOrderDto, deviceInfo: Record<string, unknown>, userId: string): Promise<OrderHeader>;
/**
 * Create order from EDI (Electronic Data Interchange)
 *
 * @param ediMessage - Parsed EDI 850 message
 * @param tradingPartnerId - Trading partner ID
 * @returns Created order header
 */
export declare function createEDIOrder(ediMessage: Record<string, unknown>, tradingPartnerId: string): Promise<OrderHeader>;
/**
 * Create order from API call
 *
 * @param orderData - Order creation data
 * @param apiKey - API key used
 * @param sourceSystem - Source system identifier
 * @returns Created order header
 */
export declare function createAPIOrder(orderData: CreateOrderDto, apiKey: string, sourceSystem: string): Promise<OrderHeader>;
/**
 * Create order from phone/call center
 *
 * @param orderData - Order creation data
 * @param callCenterRep - Call center representative ID
 * @param callId - Call tracking ID
 * @returns Created order header
 */
export declare function createPhoneOrder(orderData: CreateOrderDto, callCenterRep: string, callId: string): Promise<OrderHeader>;
/**
 * Validate complete order with all business rules
 *
 * @param orderId - Order ID to validate
 * @returns Validation result with errors and warnings
 */
export declare function validateOrder(orderId: string): Promise<OrderValidationResult>;
/**
 * Validate customer information and credit standing
 *
 * @param customerInfo - Customer information to validate
 * @returns Validation result
 */
export declare function validateCustomer(customerInfo: CustomerInfo): Promise<{
    errors: ValidationError[];
    warnings: ValidationError[];
}>;
/**
 * Validate individual order line item
 *
 * @param orderLine - Order line to validate
 * @returns Validation result
 */
export declare function validateOrderLine(orderLine: OrderLine): Promise<{
    errors: ValidationError[];
    warnings: ValidationError[];
}>;
/**
 * Validate inventory availability for all order lines
 *
 * @param orderLines - Order lines to check
 * @returns Validation result with availability details
 */
export declare function validateInventoryAvailability(orderLines: OrderLine[]): Promise<{
    errors: ValidationError[];
    warnings: ValidationError[];
}>;
/**
 * Validate order pricing and calculations
 *
 * @param order - Order to validate
 * @returns Validation result
 */
export declare function validateOrderPricing(order: OrderHeader): Promise<{
    errors: ValidationError[];
    warnings: ValidationError[];
}>;
/**
 * Validate billing and shipping addresses
 *
 * @param billingAddress - Billing address
 * @param shippingAddress - Shipping address
 * @returns Validation result
 */
export declare function validateAddresses(billingAddress: Address, shippingAddress: Address): Promise<{
    errors: ValidationError[];
    warnings: ValidationError[];
}>;
/**
 * Perform credit check for order
 *
 * @param orderId - Order ID to check
 * @returns Credit check result
 */
export declare function performCreditCheck(orderId: string): Promise<CreditCheckResult>;
/**
 * Override credit check with manual approval
 *
 * @param orderId - Order ID
 * @param approvedBy - User ID approving the override
 * @param reason - Reason for override
 * @returns Updated credit check result
 */
export declare function overrideCreditCheck(orderId: string, approvedBy: string, reason: string): Promise<CreditCheckResult>;
/**
 * Check inventory availability for item
 *
 * @param itemId - Item ID
 * @param warehouseId - Warehouse ID
 * @param quantityRequested - Requested quantity
 * @returns Inventory availability details
 */
export declare function checkInventoryAvailability(itemId: string, warehouseId: string, quantityRequested: number): Promise<InventoryAvailability>;
/**
 * Reserve inventory for order
 *
 * @param orderId - Order ID
 * @returns Reservation results for each line item
 */
export declare function reserveInventoryForOrder(orderId: string): Promise<Array<{
    lineNumber: number;
    reserved: boolean;
    reason?: string;
}>>;
/**
 * Calculate unit price for item based on customer and quantity
 *
 * @param context - Price calculation context
 * @returns Calculated unit price
 */
export declare function calculateUnitPrice(context: PriceCalculationContext): Promise<number>;
/**
 * Calculate order totals including subtotal, tax, shipping
 *
 * @param orderId - Order ID
 * @returns Updated order pricing
 */
export declare function calculateOrderTotals(orderId: string): Promise<OrderPricing>;
/**
 * Calculate tax amount for order
 *
 * @param context - Tax calculation context
 * @returns Calculated tax amount
 */
export declare function calculateOrderTax(context: TaxCalculationContext): Promise<number>;
/**
 * Calculate shipping cost for order
 *
 * @param context - Shipping calculation context
 * @returns Calculated shipping cost
 */
export declare function calculateShippingCost(context: ShippingCalculationContext): Promise<number>;
/**
 * Apply discount to order
 *
 * @param orderId - Order ID
 * @param discountAmount - Discount amount or percentage
 * @param isPercentage - Whether discount is percentage
 * @param reason - Reason for discount
 * @returns Updated order with discount applied
 */
export declare function applyOrderDiscount(orderId: string, discountAmount: number, isPercentage: boolean, reason: string): Promise<OrderHeader>;
/**
 * Create order template for quick entry
 *
 * @param templateData - Template data
 * @param userId - User creating template
 * @returns Created template
 */
export declare function createOrderTemplate(templateData: Omit<OrderTemplate, 'templateId' | 'createdAt'>, userId: string): Promise<OrderTemplateModel>;
/**
 * Create order from template
 *
 * @param templateId - Template ID
 * @param customerId - Customer ID for the order
 * @param userId - User creating order
 * @returns Created order
 */
export declare function createOrderFromTemplate(templateId: string, customerId: string, userId: string): Promise<OrderHeader>;
/**
 * Get order templates for customer or user
 *
 * @param filters - Filter criteria
 * @returns Array of templates
 */
export declare function getOrderTemplates(filters: {
    customerId?: string;
    createdBy?: string;
    isActive?: boolean;
}): Promise<OrderTemplateModel[]>;
/**
 * Import bulk orders from CSV or Excel
 *
 * @param records - Array of import records
 * @param userId - User importing orders
 * @returns Import results with created orders and errors
 */
export declare function importBulkOrders(records: BulkOrderImportRecord[], userId: string): Promise<{
    successful: OrderHeader[];
    failed: Array<{
        record: BulkOrderImportRecord;
        errors: string[];
    }>;
}>;
/**
 * Duplicate existing order
 *
 * @param orderId - Order ID to duplicate
 * @param userId - User creating duplicate
 * @returns Duplicated order
 */
export declare function duplicateOrder(orderId: string, userId: string): Promise<OrderHeader>;
/**
 * Split order into multiple orders based on criteria
 *
 * @param orderId - Order ID to split
 * @param config - Split configuration
 * @param userId - User performing split
 * @returns Array of split orders
 */
export declare function splitOrder(orderId: string, config: OrderSplitConfig, userId: string): Promise<OrderHeader[]>;
/**
 * Merge multiple orders into single order
 *
 * @param config - Merge configuration
 * @param userId - User performing merge
 * @returns Merged order
 */
export declare function mergeOrders(config: OrderMergeConfig, userId: string): Promise<OrderHeader>;
/**
 * Update order status with validation
 *
 * @param orderId - Order ID
 * @param newStatus - New status
 * @param userId - User making change
 * @param notes - Optional notes
 * @returns Updated order
 */
export declare function updateOrderStatus(orderId: string, newStatus: OrderStatus, userId: string, notes?: string): Promise<OrderHeader>;
/**
 * Validate status transition is allowed
 *
 * @param currentStatus - Current status
 * @param newStatus - Desired new status
 * @returns Whether transition is valid
 */
export declare function validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean;
/**
 * Get order workflow history
 *
 * @param orderId - Order ID
 * @returns Workflow history
 */
export declare function getOrderWorkflowHistory(orderId: string): Promise<Array<{
    status: OrderStatus;
    timestamp: Date;
    userId: string;
    notes?: string;
}>>;
declare const _default: {
    generateOrderNumber: typeof generateOrderNumber;
    createWebOrder: typeof createWebOrder;
    createMobileOrder: typeof createMobileOrder;
    createEDIOrder: typeof createEDIOrder;
    createAPIOrder: typeof createAPIOrder;
    createPhoneOrder: typeof createPhoneOrder;
    validateOrder: typeof validateOrder;
    validateCustomer: typeof validateCustomer;
    validateOrderLine: typeof validateOrderLine;
    validateInventoryAvailability: typeof validateInventoryAvailability;
    validateOrderPricing: typeof validateOrderPricing;
    validateAddresses: typeof validateAddresses;
    performCreditCheck: typeof performCreditCheck;
    overrideCreditCheck: typeof overrideCreditCheck;
    checkInventoryAvailability: typeof checkInventoryAvailability;
    reserveInventoryForOrder: typeof reserveInventoryForOrder;
    calculateUnitPrice: typeof calculateUnitPrice;
    calculateOrderTotals: typeof calculateOrderTotals;
    calculateOrderTax: typeof calculateOrderTax;
    calculateShippingCost: typeof calculateShippingCost;
    applyOrderDiscount: typeof applyOrderDiscount;
    createOrderTemplate: typeof createOrderTemplate;
    createOrderFromTemplate: typeof createOrderFromTemplate;
    getOrderTemplates: typeof getOrderTemplates;
    importBulkOrders: typeof importBulkOrders;
    duplicateOrder: typeof duplicateOrder;
    splitOrder: typeof splitOrder;
    mergeOrders: typeof mergeOrders;
    updateOrderStatus: typeof updateOrderStatus;
    validateStatusTransition: typeof validateStatusTransition;
    getOrderWorkflowHistory: typeof getOrderWorkflowHistory;
    OrderHeader: typeof OrderHeader;
    OrderLine: typeof OrderLine;
    OrderTemplateModel: typeof OrderTemplateModel;
    OrderSource: typeof OrderSource;
    OrderStatus: typeof OrderStatus;
    OrderType: typeof OrderType;
    OrderPriority: typeof OrderPriority;
    PaymentTerms: typeof PaymentTerms;
    ShippingMethod: typeof ShippingMethod;
    TaxCalculationMethod: typeof TaxCalculationMethod;
    CreditCheckStatus: typeof CreditCheckStatus;
    ValidationSeverity: typeof ValidationSeverity;
};
export default _default;
//# sourceMappingURL=order-creation-processing-kit.d.ts.map