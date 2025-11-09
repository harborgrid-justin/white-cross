"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTemplateModel = exports.OrderLine = exports.OrderHeader = exports.CreateOrderDto = exports.ValidationSeverity = exports.CreditCheckStatus = exports.TaxCalculationMethod = exports.ShippingMethod = exports.PaymentTerms = exports.OrderPriority = exports.OrderType = exports.OrderStatus = exports.OrderSource = void 0;
exports.generateOrderNumber = generateOrderNumber;
exports.createWebOrder = createWebOrder;
exports.createMobileOrder = createMobileOrder;
exports.createEDIOrder = createEDIOrder;
exports.createAPIOrder = createAPIOrder;
exports.createPhoneOrder = createPhoneOrder;
exports.validateOrder = validateOrder;
exports.validateCustomer = validateCustomer;
exports.validateOrderLine = validateOrderLine;
exports.validateInventoryAvailability = validateInventoryAvailability;
exports.validateOrderPricing = validateOrderPricing;
exports.validateAddresses = validateAddresses;
exports.performCreditCheck = performCreditCheck;
exports.overrideCreditCheck = overrideCreditCheck;
exports.checkInventoryAvailability = checkInventoryAvailability;
exports.reserveInventoryForOrder = reserveInventoryForOrder;
exports.calculateUnitPrice = calculateUnitPrice;
exports.calculateOrderTotals = calculateOrderTotals;
exports.calculateOrderTax = calculateOrderTax;
exports.calculateShippingCost = calculateShippingCost;
exports.applyOrderDiscount = applyOrderDiscount;
exports.createOrderTemplate = createOrderTemplate;
exports.createOrderFromTemplate = createOrderFromTemplate;
exports.getOrderTemplates = getOrderTemplates;
exports.importBulkOrders = importBulkOrders;
exports.duplicateOrder = duplicateOrder;
exports.splitOrder = splitOrder;
exports.mergeOrders = mergeOrders;
exports.updateOrderStatus = updateOrderStatus;
exports.validateStatusTransition = validateStatusTransition;
exports.getOrderWorkflowHistory = getOrderWorkflowHistory;
/**
 * File: /reuse/order/order-creation-processing-kit.ts
 * Locator: WC-ORD-CRTPRC-001
 * Purpose: Comprehensive Order Creation & Processing - Complete order entry, validation, creation workflows
 *
 * Upstream: Independent utility module for order creation operations
 * Downstream: ../backend/order/*, Order modules, Transaction services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 45 utility functions for order creation, validation, processing, workflows
 *
 * LLM Context: Enterprise-grade order creation utilities to compete with JD Edwards EnterpriseOne.
 * Provides comprehensive order entry, multi-channel order capture, order validation with business rules,
 * order creation workflows, order templates, quick order entry, mass order import, order duplication,
 * order splitting, order merging, price calculations, tax calculations, shipping calculations,
 * credit checks, inventory availability checks, customer validation, address validation, and more.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Order source channels for multi-channel order capture
 */
var OrderSource;
(function (OrderSource) {
    OrderSource["WEB"] = "WEB";
    OrderSource["MOBILE"] = "MOBILE";
    OrderSource["PHONE"] = "PHONE";
    OrderSource["EMAIL"] = "EMAIL";
    OrderSource["FAX"] = "FAX";
    OrderSource["EDI"] = "EDI";
    OrderSource["API"] = "API";
    OrderSource["POS"] = "POS";
    OrderSource["SALES_REP"] = "SALES_REP";
    OrderSource["MARKETPLACE"] = "MARKETPLACE";
    OrderSource["SOCIAL_MEDIA"] = "SOCIAL_MEDIA";
    OrderSource["PARTNER"] = "PARTNER";
})(OrderSource || (exports.OrderSource = OrderSource = {}));
/**
 * Order status for workflow management
 */
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "DRAFT";
    OrderStatus["PENDING_VALIDATION"] = "PENDING_VALIDATION";
    OrderStatus["VALIDATED"] = "VALIDATED";
    OrderStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    OrderStatus["APPROVED"] = "APPROVED";
    OrderStatus["REJECTED"] = "REJECTED";
    OrderStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
    OrderStatus["PAYMENT_RECEIVED"] = "PAYMENT_RECEIVED";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["ON_HOLD"] = "ON_HOLD";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["COMPLETED"] = "COMPLETED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
/**
 * Order type classifications
 */
var OrderType;
(function (OrderType) {
    OrderType["STANDARD"] = "STANDARD";
    OrderType["RUSH"] = "RUSH";
    OrderType["BACKORDER"] = "BACKORDER";
    OrderType["PREORDER"] = "PREORDER";
    OrderType["SUBSCRIPTION"] = "SUBSCRIPTION";
    OrderType["SAMPLE"] = "SAMPLE";
    OrderType["WARRANTY"] = "WARRANTY";
    OrderType["RETURN_EXCHANGE"] = "RETURN_EXCHANGE";
    OrderType["QUOTE"] = "QUOTE";
    OrderType["CONTRACT"] = "CONTRACT";
})(OrderType || (exports.OrderType = OrderType = {}));
/**
 * Order priority levels
 */
var OrderPriority;
(function (OrderPriority) {
    OrderPriority["LOW"] = "LOW";
    OrderPriority["NORMAL"] = "NORMAL";
    OrderPriority["HIGH"] = "HIGH";
    OrderPriority["URGENT"] = "URGENT";
    OrderPriority["CRITICAL"] = "CRITICAL";
})(OrderPriority || (exports.OrderPriority = OrderPriority = {}));
/**
 * Payment terms
 */
var PaymentTerms;
(function (PaymentTerms) {
    PaymentTerms["NET_30"] = "NET_30";
    PaymentTerms["NET_60"] = "NET_60";
    PaymentTerms["NET_90"] = "NET_90";
    PaymentTerms["COD"] = "COD";
    PaymentTerms["PREPAID"] = "PREPAID";
    PaymentTerms["DUE_ON_RECEIPT"] = "DUE_ON_RECEIPT";
    PaymentTerms["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentTerms["INSTALLMENT"] = "INSTALLMENT";
})(PaymentTerms || (exports.PaymentTerms = PaymentTerms = {}));
/**
 * Shipping method types
 */
var ShippingMethod;
(function (ShippingMethod) {
    ShippingMethod["STANDARD"] = "STANDARD";
    ShippingMethod["EXPRESS"] = "EXPRESS";
    ShippingMethod["OVERNIGHT"] = "OVERNIGHT";
    ShippingMethod["TWO_DAY"] = "TWO_DAY";
    ShippingMethod["GROUND"] = "GROUND";
    ShippingMethod["FREIGHT"] = "FREIGHT";
    ShippingMethod["PICKUP"] = "PICKUP";
    ShippingMethod["DROP_SHIP"] = "DROP_SHIP";
})(ShippingMethod || (exports.ShippingMethod = ShippingMethod = {}));
/**
 * Tax calculation methods
 */
var TaxCalculationMethod;
(function (TaxCalculationMethod) {
    TaxCalculationMethod["ORIGIN_BASED"] = "ORIGIN_BASED";
    TaxCalculationMethod["DESTINATION_BASED"] = "DESTINATION_BASED";
    TaxCalculationMethod["HYBRID"] = "HYBRID";
    TaxCalculationMethod["VAT"] = "VAT";
    TaxCalculationMethod["GST"] = "GST";
    TaxCalculationMethod["EXEMPT"] = "EXEMPT";
})(TaxCalculationMethod || (exports.TaxCalculationMethod = TaxCalculationMethod = {}));
/**
 * Credit check status
 */
var CreditCheckStatus;
(function (CreditCheckStatus) {
    CreditCheckStatus["NOT_REQUIRED"] = "NOT_REQUIRED";
    CreditCheckStatus["PENDING"] = "PENDING";
    CreditCheckStatus["APPROVED"] = "APPROVED";
    CreditCheckStatus["DECLINED"] = "DECLINED";
    CreditCheckStatus["MANUAL_REVIEW"] = "MANUAL_REVIEW";
    CreditCheckStatus["OVER_LIMIT"] = "OVER_LIMIT";
})(CreditCheckStatus || (exports.CreditCheckStatus = CreditCheckStatus = {}));
/**
 * Validation error severity
 */
var ValidationSeverity;
(function (ValidationSeverity) {
    ValidationSeverity["ERROR"] = "ERROR";
    ValidationSeverity["WARNING"] = "WARNING";
    ValidationSeverity["INFO"] = "INFO";
})(ValidationSeverity || (exports.ValidationSeverity = ValidationSeverity = {}));
/**
 * Order creation request DTO
 */
let CreateOrderDto = (() => {
    var _a;
    let _orderSource_decorators;
    let _orderSource_initializers = [];
    let _orderSource_extraInitializers = [];
    let _orderType_decorators;
    let _orderType_initializers = [];
    let _orderType_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _customer_decorators;
    let _customer_initializers = [];
    let _customer_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    let _shippingMethod_decorators;
    let _shippingMethod_initializers = [];
    let _shippingMethod_extraInitializers = [];
    let _requestedDeliveryDate_decorators;
    let _requestedDeliveryDate_initializers = [];
    let _requestedDeliveryDate_extraInitializers = [];
    let _poNumber_decorators;
    let _poNumber_initializers = [];
    let _poNumber_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _salesRepId_decorators;
    let _salesRepId_initializers = [];
    let _salesRepId_extraInitializers = [];
    let _customFields_decorators;
    let _customFields_initializers = [];
    let _customFields_extraInitializers = [];
    return _a = class CreateOrderDto {
            constructor() {
                this.orderSource = __runInitializers(this, _orderSource_initializers, void 0);
                this.orderType = (__runInitializers(this, _orderSource_extraInitializers), __runInitializers(this, _orderType_initializers, void 0));
                this.priority = (__runInitializers(this, _orderType_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.customer = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _customer_initializers, void 0));
                this.lineItems = (__runInitializers(this, _customer_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
                this.shippingMethod = (__runInitializers(this, _lineItems_extraInitializers), __runInitializers(this, _shippingMethod_initializers, void 0));
                this.requestedDeliveryDate = (__runInitializers(this, _shippingMethod_extraInitializers), __runInitializers(this, _requestedDeliveryDate_initializers, void 0));
                this.poNumber = (__runInitializers(this, _requestedDeliveryDate_extraInitializers), __runInitializers(this, _poNumber_initializers, void 0));
                this.notes = (__runInitializers(this, _poNumber_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.salesRepId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _salesRepId_initializers, void 0));
                this.customFields = (__runInitializers(this, _salesRepId_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
                __runInitializers(this, _customFields_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderSource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order source channel', enum: OrderSource }), (0, class_validator_1.IsEnum)(OrderSource), (0, class_validator_1.IsNotEmpty)()];
            _orderType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order type', enum: OrderType }), (0, class_validator_1.IsEnum)(OrderType), (0, class_validator_1.IsNotEmpty)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order priority', enum: OrderPriority }), (0, class_validator_1.IsEnum)(OrderPriority), (0, class_validator_1.IsNotEmpty)()];
            _customer_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer information' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsNotEmpty)()];
            _lineItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order line items', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsNotEmpty)()];
            _shippingMethod_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Shipping method', enum: ShippingMethod }), (0, class_validator_1.IsEnum)(ShippingMethod), (0, class_validator_1.IsOptional)()];
            _requestedDeliveryDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Requested delivery date' }), (0, class_validator_1.IsOptional)()];
            _poNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Purchase order number' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Order notes' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _salesRepId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Sales representative ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _customFields_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom fields' }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _orderSource_decorators, { kind: "field", name: "orderSource", static: false, private: false, access: { has: obj => "orderSource" in obj, get: obj => obj.orderSource, set: (obj, value) => { obj.orderSource = value; } }, metadata: _metadata }, _orderSource_initializers, _orderSource_extraInitializers);
            __esDecorate(null, null, _orderType_decorators, { kind: "field", name: "orderType", static: false, private: false, access: { has: obj => "orderType" in obj, get: obj => obj.orderType, set: (obj, value) => { obj.orderType = value; } }, metadata: _metadata }, _orderType_initializers, _orderType_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _customer_decorators, { kind: "field", name: "customer", static: false, private: false, access: { has: obj => "customer" in obj, get: obj => obj.customer, set: (obj, value) => { obj.customer = value; } }, metadata: _metadata }, _customer_initializers, _customer_extraInitializers);
            __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
            __esDecorate(null, null, _shippingMethod_decorators, { kind: "field", name: "shippingMethod", static: false, private: false, access: { has: obj => "shippingMethod" in obj, get: obj => obj.shippingMethod, set: (obj, value) => { obj.shippingMethod = value; } }, metadata: _metadata }, _shippingMethod_initializers, _shippingMethod_extraInitializers);
            __esDecorate(null, null, _requestedDeliveryDate_decorators, { kind: "field", name: "requestedDeliveryDate", static: false, private: false, access: { has: obj => "requestedDeliveryDate" in obj, get: obj => obj.requestedDeliveryDate, set: (obj, value) => { obj.requestedDeliveryDate = value; } }, metadata: _metadata }, _requestedDeliveryDate_initializers, _requestedDeliveryDate_extraInitializers);
            __esDecorate(null, null, _poNumber_decorators, { kind: "field", name: "poNumber", static: false, private: false, access: { has: obj => "poNumber" in obj, get: obj => obj.poNumber, set: (obj, value) => { obj.poNumber = value; } }, metadata: _metadata }, _poNumber_initializers, _poNumber_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _salesRepId_decorators, { kind: "field", name: "salesRepId", static: false, private: false, access: { has: obj => "salesRepId" in obj, get: obj => obj.salesRepId, set: (obj, value) => { obj.salesRepId = value; } }, metadata: _metadata }, _salesRepId_initializers, _salesRepId_extraInitializers);
            __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateOrderDto = CreateOrderDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Order header model
 */
let OrderHeader = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'order_headers',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['orderNumber'], unique: true },
                { fields: ['customerId'] },
                { fields: ['orderStatus'] },
                { fields: ['orderDate'] },
                { fields: ['orderSource'] },
                { fields: ['createdAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _orderNumber_decorators;
    let _orderNumber_initializers = [];
    let _orderNumber_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _orderDate_decorators;
    let _orderDate_initializers = [];
    let _orderDate_extraInitializers = [];
    let _orderSource_decorators;
    let _orderSource_initializers = [];
    let _orderSource_extraInitializers = [];
    let _orderType_decorators;
    let _orderType_initializers = [];
    let _orderType_extraInitializers = [];
    let _orderStatus_decorators;
    let _orderStatus_initializers = [];
    let _orderStatus_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _customerInfo_decorators;
    let _customerInfo_initializers = [];
    let _customerInfo_extraInitializers = [];
    let _billingAddress_decorators;
    let _billingAddress_initializers = [];
    let _billingAddress_extraInitializers = [];
    let _shippingAddress_decorators;
    let _shippingAddress_initializers = [];
    let _shippingAddress_extraInitializers = [];
    let _shippingMethod_decorators;
    let _shippingMethod_initializers = [];
    let _shippingMethod_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _subtotal_decorators;
    let _subtotal_initializers = [];
    let _subtotal_extraInitializers = [];
    let _discountAmount_decorators;
    let _discountAmount_initializers = [];
    let _discountAmount_extraInitializers = [];
    let _taxAmount_decorators;
    let _taxAmount_initializers = [];
    let _taxAmount_extraInitializers = [];
    let _shippingAmount_decorators;
    let _shippingAmount_initializers = [];
    let _shippingAmount_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _poNumber_decorators;
    let _poNumber_initializers = [];
    let _poNumber_extraInitializers = [];
    let _requestedDeliveryDate_decorators;
    let _requestedDeliveryDate_initializers = [];
    let _requestedDeliveryDate_extraInitializers = [];
    let _salesRepId_decorators;
    let _salesRepId_initializers = [];
    let _salesRepId_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _creditCheckStatus_decorators;
    let _creditCheckStatus_initializers = [];
    let _creditCheckStatus_extraInitializers = [];
    let _creditCheckResult_decorators;
    let _creditCheckResult_initializers = [];
    let _creditCheckResult_extraInitializers = [];
    let _validationResult_decorators;
    let _validationResult_initializers = [];
    let _validationResult_extraInitializers = [];
    let _parentOrderId_decorators;
    let _parentOrderId_initializers = [];
    let _parentOrderId_extraInitializers = [];
    let _customFields_decorators;
    let _customFields_initializers = [];
    let _customFields_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    var OrderHeader = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.orderId = __runInitializers(this, _orderId_initializers, void 0);
            this.orderNumber = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _orderNumber_initializers, void 0));
            this.customerId = (__runInitializers(this, _orderNumber_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.orderDate = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _orderDate_initializers, void 0));
            this.orderSource = (__runInitializers(this, _orderDate_extraInitializers), __runInitializers(this, _orderSource_initializers, void 0));
            this.orderType = (__runInitializers(this, _orderSource_extraInitializers), __runInitializers(this, _orderType_initializers, void 0));
            this.orderStatus = (__runInitializers(this, _orderType_extraInitializers), __runInitializers(this, _orderStatus_initializers, void 0));
            this.priority = (__runInitializers(this, _orderStatus_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.customerInfo = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _customerInfo_initializers, void 0));
            this.billingAddress = (__runInitializers(this, _customerInfo_extraInitializers), __runInitializers(this, _billingAddress_initializers, void 0));
            this.shippingAddress = (__runInitializers(this, _billingAddress_extraInitializers), __runInitializers(this, _shippingAddress_initializers, void 0));
            this.shippingMethod = (__runInitializers(this, _shippingAddress_extraInitializers), __runInitializers(this, _shippingMethod_initializers, void 0));
            this.paymentTerms = (__runInitializers(this, _shippingMethod_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
            this.subtotal = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _subtotal_initializers, void 0));
            this.discountAmount = (__runInitializers(this, _subtotal_extraInitializers), __runInitializers(this, _discountAmount_initializers, void 0));
            this.taxAmount = (__runInitializers(this, _discountAmount_extraInitializers), __runInitializers(this, _taxAmount_initializers, void 0));
            this.shippingAmount = (__runInitializers(this, _taxAmount_extraInitializers), __runInitializers(this, _shippingAmount_initializers, void 0));
            this.totalAmount = (__runInitializers(this, _shippingAmount_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
            this.currency = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.poNumber = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _poNumber_initializers, void 0));
            this.requestedDeliveryDate = (__runInitializers(this, _poNumber_extraInitializers), __runInitializers(this, _requestedDeliveryDate_initializers, void 0));
            this.salesRepId = (__runInitializers(this, _requestedDeliveryDate_extraInitializers), __runInitializers(this, _salesRepId_initializers, void 0));
            this.notes = (__runInitializers(this, _salesRepId_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.creditCheckStatus = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _creditCheckStatus_initializers, void 0));
            this.creditCheckResult = (__runInitializers(this, _creditCheckStatus_extraInitializers), __runInitializers(this, _creditCheckResult_initializers, void 0));
            this.validationResult = (__runInitializers(this, _creditCheckResult_extraInitializers), __runInitializers(this, _validationResult_initializers, void 0));
            this.parentOrderId = (__runInitializers(this, _validationResult_extraInitializers), __runInitializers(this, _parentOrderId_initializers, void 0));
            this.customFields = (__runInitializers(this, _parentOrderId_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
            this.createdBy = (__runInitializers(this, _customFields_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.lines = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _lines_initializers, void 0));
            __runInitializers(this, _lines_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OrderHeader");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _orderNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order number (auto-generated)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _orderDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _orderSource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order source channel', enum: OrderSource }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OrderSource)),
                allowNull: false,
            })];
        _orderType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order type', enum: OrderType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OrderType)),
                allowNull: false,
            })];
        _orderStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order status', enum: OrderStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OrderStatus)),
                allowNull: false,
                defaultValue: OrderStatus.DRAFT,
            }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order priority', enum: OrderPriority }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OrderPriority)),
                allowNull: false,
                defaultValue: OrderPriority.NORMAL,
            })];
        _customerInfo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer information (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _billingAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing address (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _shippingAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shipping address (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _shippingMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shipping method', enum: ShippingMethod }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ShippingMethod)),
                allowNull: true,
            })];
        _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms', enum: PaymentTerms }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentTerms)),
                allowNull: false,
            })];
        _subtotal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subtotal amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _discountAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _taxAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _shippingAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shipping amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                allowNull: false,
                defaultValue: 'USD',
            })];
        _poNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase order number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _requestedDeliveryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested delivery date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _salesRepId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sales representative ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _creditCheckStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit check status', enum: CreditCheckStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CreditCheckStatus)),
                allowNull: false,
                defaultValue: CreditCheckStatus.NOT_REQUIRED,
            })];
        _creditCheckResult_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit check result (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _validationResult_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation result (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _parentOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent order ID (for split orders)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            })];
        _customFields_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custom fields (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _updatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Updated by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        _lines_decorators = [(0, sequelize_typescript_1.HasMany)(() => OrderLine)];
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _orderNumber_decorators, { kind: "field", name: "orderNumber", static: false, private: false, access: { has: obj => "orderNumber" in obj, get: obj => obj.orderNumber, set: (obj, value) => { obj.orderNumber = value; } }, metadata: _metadata }, _orderNumber_initializers, _orderNumber_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _orderDate_decorators, { kind: "field", name: "orderDate", static: false, private: false, access: { has: obj => "orderDate" in obj, get: obj => obj.orderDate, set: (obj, value) => { obj.orderDate = value; } }, metadata: _metadata }, _orderDate_initializers, _orderDate_extraInitializers);
        __esDecorate(null, null, _orderSource_decorators, { kind: "field", name: "orderSource", static: false, private: false, access: { has: obj => "orderSource" in obj, get: obj => obj.orderSource, set: (obj, value) => { obj.orderSource = value; } }, metadata: _metadata }, _orderSource_initializers, _orderSource_extraInitializers);
        __esDecorate(null, null, _orderType_decorators, { kind: "field", name: "orderType", static: false, private: false, access: { has: obj => "orderType" in obj, get: obj => obj.orderType, set: (obj, value) => { obj.orderType = value; } }, metadata: _metadata }, _orderType_initializers, _orderType_extraInitializers);
        __esDecorate(null, null, _orderStatus_decorators, { kind: "field", name: "orderStatus", static: false, private: false, access: { has: obj => "orderStatus" in obj, get: obj => obj.orderStatus, set: (obj, value) => { obj.orderStatus = value; } }, metadata: _metadata }, _orderStatus_initializers, _orderStatus_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _customerInfo_decorators, { kind: "field", name: "customerInfo", static: false, private: false, access: { has: obj => "customerInfo" in obj, get: obj => obj.customerInfo, set: (obj, value) => { obj.customerInfo = value; } }, metadata: _metadata }, _customerInfo_initializers, _customerInfo_extraInitializers);
        __esDecorate(null, null, _billingAddress_decorators, { kind: "field", name: "billingAddress", static: false, private: false, access: { has: obj => "billingAddress" in obj, get: obj => obj.billingAddress, set: (obj, value) => { obj.billingAddress = value; } }, metadata: _metadata }, _billingAddress_initializers, _billingAddress_extraInitializers);
        __esDecorate(null, null, _shippingAddress_decorators, { kind: "field", name: "shippingAddress", static: false, private: false, access: { has: obj => "shippingAddress" in obj, get: obj => obj.shippingAddress, set: (obj, value) => { obj.shippingAddress = value; } }, metadata: _metadata }, _shippingAddress_initializers, _shippingAddress_extraInitializers);
        __esDecorate(null, null, _shippingMethod_decorators, { kind: "field", name: "shippingMethod", static: false, private: false, access: { has: obj => "shippingMethod" in obj, get: obj => obj.shippingMethod, set: (obj, value) => { obj.shippingMethod = value; } }, metadata: _metadata }, _shippingMethod_initializers, _shippingMethod_extraInitializers);
        __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
        __esDecorate(null, null, _subtotal_decorators, { kind: "field", name: "subtotal", static: false, private: false, access: { has: obj => "subtotal" in obj, get: obj => obj.subtotal, set: (obj, value) => { obj.subtotal = value; } }, metadata: _metadata }, _subtotal_initializers, _subtotal_extraInitializers);
        __esDecorate(null, null, _discountAmount_decorators, { kind: "field", name: "discountAmount", static: false, private: false, access: { has: obj => "discountAmount" in obj, get: obj => obj.discountAmount, set: (obj, value) => { obj.discountAmount = value; } }, metadata: _metadata }, _discountAmount_initializers, _discountAmount_extraInitializers);
        __esDecorate(null, null, _taxAmount_decorators, { kind: "field", name: "taxAmount", static: false, private: false, access: { has: obj => "taxAmount" in obj, get: obj => obj.taxAmount, set: (obj, value) => { obj.taxAmount = value; } }, metadata: _metadata }, _taxAmount_initializers, _taxAmount_extraInitializers);
        __esDecorate(null, null, _shippingAmount_decorators, { kind: "field", name: "shippingAmount", static: false, private: false, access: { has: obj => "shippingAmount" in obj, get: obj => obj.shippingAmount, set: (obj, value) => { obj.shippingAmount = value; } }, metadata: _metadata }, _shippingAmount_initializers, _shippingAmount_extraInitializers);
        __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _poNumber_decorators, { kind: "field", name: "poNumber", static: false, private: false, access: { has: obj => "poNumber" in obj, get: obj => obj.poNumber, set: (obj, value) => { obj.poNumber = value; } }, metadata: _metadata }, _poNumber_initializers, _poNumber_extraInitializers);
        __esDecorate(null, null, _requestedDeliveryDate_decorators, { kind: "field", name: "requestedDeliveryDate", static: false, private: false, access: { has: obj => "requestedDeliveryDate" in obj, get: obj => obj.requestedDeliveryDate, set: (obj, value) => { obj.requestedDeliveryDate = value; } }, metadata: _metadata }, _requestedDeliveryDate_initializers, _requestedDeliveryDate_extraInitializers);
        __esDecorate(null, null, _salesRepId_decorators, { kind: "field", name: "salesRepId", static: false, private: false, access: { has: obj => "salesRepId" in obj, get: obj => obj.salesRepId, set: (obj, value) => { obj.salesRepId = value; } }, metadata: _metadata }, _salesRepId_initializers, _salesRepId_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _creditCheckStatus_decorators, { kind: "field", name: "creditCheckStatus", static: false, private: false, access: { has: obj => "creditCheckStatus" in obj, get: obj => obj.creditCheckStatus, set: (obj, value) => { obj.creditCheckStatus = value; } }, metadata: _metadata }, _creditCheckStatus_initializers, _creditCheckStatus_extraInitializers);
        __esDecorate(null, null, _creditCheckResult_decorators, { kind: "field", name: "creditCheckResult", static: false, private: false, access: { has: obj => "creditCheckResult" in obj, get: obj => obj.creditCheckResult, set: (obj, value) => { obj.creditCheckResult = value; } }, metadata: _metadata }, _creditCheckResult_initializers, _creditCheckResult_extraInitializers);
        __esDecorate(null, null, _validationResult_decorators, { kind: "field", name: "validationResult", static: false, private: false, access: { has: obj => "validationResult" in obj, get: obj => obj.validationResult, set: (obj, value) => { obj.validationResult = value; } }, metadata: _metadata }, _validationResult_initializers, _validationResult_extraInitializers);
        __esDecorate(null, null, _parentOrderId_decorators, { kind: "field", name: "parentOrderId", static: false, private: false, access: { has: obj => "parentOrderId" in obj, get: obj => obj.parentOrderId, set: (obj, value) => { obj.parentOrderId = value; } }, metadata: _metadata }, _parentOrderId_initializers, _parentOrderId_extraInitializers);
        __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _lines_decorators, { kind: "field", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrderHeader = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrderHeader = _classThis;
})();
exports.OrderHeader = OrderHeader;
/**
 * Order line model
 */
let OrderLine = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'order_lines',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['orderId'] },
                { fields: ['itemId'] },
                { fields: ['lineNumber'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _orderLineId_decorators;
    let _orderLineId_initializers = [];
    let _orderLineId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _order_decorators;
    let _order_initializers = [];
    let _order_extraInitializers = [];
    let _lineNumber_decorators;
    let _lineNumber_initializers = [];
    let _lineNumber_extraInitializers = [];
    let _itemId_decorators;
    let _itemId_initializers = [];
    let _itemId_extraInitializers = [];
    let _itemNumber_decorators;
    let _itemNumber_initializers = [];
    let _itemNumber_extraInitializers = [];
    let _itemDescription_decorators;
    let _itemDescription_initializers = [];
    let _itemDescription_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _unitOfMeasure_decorators;
    let _unitOfMeasure_initializers = [];
    let _unitOfMeasure_extraInitializers = [];
    let _unitPrice_decorators;
    let _unitPrice_initializers = [];
    let _unitPrice_extraInitializers = [];
    let _discount_decorators;
    let _discount_initializers = [];
    let _discount_extraInitializers = [];
    let _discountPercent_decorators;
    let _discountPercent_initializers = [];
    let _discountPercent_extraInitializers = [];
    let _taxAmount_decorators;
    let _taxAmount_initializers = [];
    let _taxAmount_extraInitializers = [];
    let _taxRate_decorators;
    let _taxRate_initializers = [];
    let _taxRate_extraInitializers = [];
    let _lineTotal_decorators;
    let _lineTotal_initializers = [];
    let _lineTotal_extraInitializers = [];
    let _requestedDeliveryDate_decorators;
    let _requestedDeliveryDate_initializers = [];
    let _requestedDeliveryDate_extraInitializers = [];
    let _warehouseId_decorators;
    let _warehouseId_initializers = [];
    let _warehouseId_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _customFields_decorators;
    let _customFields_initializers = [];
    let _customFields_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var OrderLine = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.orderLineId = __runInitializers(this, _orderLineId_initializers, void 0);
            this.orderId = (__runInitializers(this, _orderLineId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.order = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            this.lineNumber = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _lineNumber_initializers, void 0));
            this.itemId = (__runInitializers(this, _lineNumber_extraInitializers), __runInitializers(this, _itemId_initializers, void 0));
            this.itemNumber = (__runInitializers(this, _itemId_extraInitializers), __runInitializers(this, _itemNumber_initializers, void 0));
            this.itemDescription = (__runInitializers(this, _itemNumber_extraInitializers), __runInitializers(this, _itemDescription_initializers, void 0));
            this.quantity = (__runInitializers(this, _itemDescription_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
            this.unitOfMeasure = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitOfMeasure_initializers, void 0));
            this.unitPrice = (__runInitializers(this, _unitOfMeasure_extraInitializers), __runInitializers(this, _unitPrice_initializers, void 0));
            this.discount = (__runInitializers(this, _unitPrice_extraInitializers), __runInitializers(this, _discount_initializers, void 0));
            this.discountPercent = (__runInitializers(this, _discount_extraInitializers), __runInitializers(this, _discountPercent_initializers, void 0));
            this.taxAmount = (__runInitializers(this, _discountPercent_extraInitializers), __runInitializers(this, _taxAmount_initializers, void 0));
            this.taxRate = (__runInitializers(this, _taxAmount_extraInitializers), __runInitializers(this, _taxRate_initializers, void 0));
            this.lineTotal = (__runInitializers(this, _taxRate_extraInitializers), __runInitializers(this, _lineTotal_initializers, void 0));
            this.requestedDeliveryDate = (__runInitializers(this, _lineTotal_extraInitializers), __runInitializers(this, _requestedDeliveryDate_initializers, void 0));
            this.warehouseId = (__runInitializers(this, _requestedDeliveryDate_extraInitializers), __runInitializers(this, _warehouseId_initializers, void 0));
            this.notes = (__runInitializers(this, _warehouseId_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.customFields = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
            this.createdAt = (__runInitializers(this, _customFields_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OrderLine");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _orderLineId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order line ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, sequelize_typescript_1.ForeignKey)(() => OrderHeader), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _order_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => OrderHeader)];
        _lineNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _itemId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _itemNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _itemDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity ordered' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 4),
                allowNull: false,
            })];
        _unitOfMeasure_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measure' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: false,
            })];
        _unitPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 4),
                allowNull: false,
            })];
        _discount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _discountPercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount percentage' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _taxAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _taxRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax rate' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 4),
                allowNull: false,
                defaultValue: 0,
            })];
        _lineTotal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line total amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _requestedDeliveryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested delivery date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _warehouseId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warehouse ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _customFields_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custom fields (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _orderLineId_decorators, { kind: "field", name: "orderLineId", static: false, private: false, access: { has: obj => "orderLineId" in obj, get: obj => obj.orderLineId, set: (obj, value) => { obj.orderLineId = value; } }, metadata: _metadata }, _orderLineId_initializers, _orderLineId_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: obj => "order" in obj, get: obj => obj.order, set: (obj, value) => { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _lineNumber_decorators, { kind: "field", name: "lineNumber", static: false, private: false, access: { has: obj => "lineNumber" in obj, get: obj => obj.lineNumber, set: (obj, value) => { obj.lineNumber = value; } }, metadata: _metadata }, _lineNumber_initializers, _lineNumber_extraInitializers);
        __esDecorate(null, null, _itemId_decorators, { kind: "field", name: "itemId", static: false, private: false, access: { has: obj => "itemId" in obj, get: obj => obj.itemId, set: (obj, value) => { obj.itemId = value; } }, metadata: _metadata }, _itemId_initializers, _itemId_extraInitializers);
        __esDecorate(null, null, _itemNumber_decorators, { kind: "field", name: "itemNumber", static: false, private: false, access: { has: obj => "itemNumber" in obj, get: obj => obj.itemNumber, set: (obj, value) => { obj.itemNumber = value; } }, metadata: _metadata }, _itemNumber_initializers, _itemNumber_extraInitializers);
        __esDecorate(null, null, _itemDescription_decorators, { kind: "field", name: "itemDescription", static: false, private: false, access: { has: obj => "itemDescription" in obj, get: obj => obj.itemDescription, set: (obj, value) => { obj.itemDescription = value; } }, metadata: _metadata }, _itemDescription_initializers, _itemDescription_extraInitializers);
        __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
        __esDecorate(null, null, _unitOfMeasure_decorators, { kind: "field", name: "unitOfMeasure", static: false, private: false, access: { has: obj => "unitOfMeasure" in obj, get: obj => obj.unitOfMeasure, set: (obj, value) => { obj.unitOfMeasure = value; } }, metadata: _metadata }, _unitOfMeasure_initializers, _unitOfMeasure_extraInitializers);
        __esDecorate(null, null, _unitPrice_decorators, { kind: "field", name: "unitPrice", static: false, private: false, access: { has: obj => "unitPrice" in obj, get: obj => obj.unitPrice, set: (obj, value) => { obj.unitPrice = value; } }, metadata: _metadata }, _unitPrice_initializers, _unitPrice_extraInitializers);
        __esDecorate(null, null, _discount_decorators, { kind: "field", name: "discount", static: false, private: false, access: { has: obj => "discount" in obj, get: obj => obj.discount, set: (obj, value) => { obj.discount = value; } }, metadata: _metadata }, _discount_initializers, _discount_extraInitializers);
        __esDecorate(null, null, _discountPercent_decorators, { kind: "field", name: "discountPercent", static: false, private: false, access: { has: obj => "discountPercent" in obj, get: obj => obj.discountPercent, set: (obj, value) => { obj.discountPercent = value; } }, metadata: _metadata }, _discountPercent_initializers, _discountPercent_extraInitializers);
        __esDecorate(null, null, _taxAmount_decorators, { kind: "field", name: "taxAmount", static: false, private: false, access: { has: obj => "taxAmount" in obj, get: obj => obj.taxAmount, set: (obj, value) => { obj.taxAmount = value; } }, metadata: _metadata }, _taxAmount_initializers, _taxAmount_extraInitializers);
        __esDecorate(null, null, _taxRate_decorators, { kind: "field", name: "taxRate", static: false, private: false, access: { has: obj => "taxRate" in obj, get: obj => obj.taxRate, set: (obj, value) => { obj.taxRate = value; } }, metadata: _metadata }, _taxRate_initializers, _taxRate_extraInitializers);
        __esDecorate(null, null, _lineTotal_decorators, { kind: "field", name: "lineTotal", static: false, private: false, access: { has: obj => "lineTotal" in obj, get: obj => obj.lineTotal, set: (obj, value) => { obj.lineTotal = value; } }, metadata: _metadata }, _lineTotal_initializers, _lineTotal_extraInitializers);
        __esDecorate(null, null, _requestedDeliveryDate_decorators, { kind: "field", name: "requestedDeliveryDate", static: false, private: false, access: { has: obj => "requestedDeliveryDate" in obj, get: obj => obj.requestedDeliveryDate, set: (obj, value) => { obj.requestedDeliveryDate = value; } }, metadata: _metadata }, _requestedDeliveryDate_initializers, _requestedDeliveryDate_extraInitializers);
        __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: obj => "warehouseId" in obj, get: obj => obj.warehouseId, set: (obj, value) => { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrderLine = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrderLine = _classThis;
})();
exports.OrderLine = OrderLine;
/**
 * Order template model
 */
let OrderTemplateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'order_templates',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['templateName'] },
                { fields: ['customerId'] },
                { fields: ['createdBy'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _templateName_decorators;
    let _templateName_initializers = [];
    let _templateName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _orderType_decorators;
    let _orderType_initializers = [];
    let _orderType_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    let _shippingMethod_decorators;
    let _shippingMethod_initializers = [];
    let _shippingMethod_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var OrderTemplateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.templateId = __runInitializers(this, _templateId_initializers, void 0);
            this.templateName = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _templateName_initializers, void 0));
            this.description = (__runInitializers(this, _templateName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.customerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.orderType = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _orderType_initializers, void 0));
            this.lineItems = (__runInitializers(this, _orderType_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
            this.shippingMethod = (__runInitializers(this, _lineItems_extraInitializers), __runInitializers(this, _shippingMethod_initializers, void 0));
            this.isActive = (__runInitializers(this, _shippingMethod_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdBy = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OrderTemplateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _templateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _templateName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID (optional)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            }), sequelize_typescript_1.Index];
        _orderType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order type', enum: OrderType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OrderType)),
                allowNull: false,
            })];
        _lineItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line items template (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _shippingMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shipping method', enum: ShippingMethod }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ShippingMethod)),
                allowNull: true,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _templateName_decorators, { kind: "field", name: "templateName", static: false, private: false, access: { has: obj => "templateName" in obj, get: obj => obj.templateName, set: (obj, value) => { obj.templateName = value; } }, metadata: _metadata }, _templateName_initializers, _templateName_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _orderType_decorators, { kind: "field", name: "orderType", static: false, private: false, access: { has: obj => "orderType" in obj, get: obj => obj.orderType, set: (obj, value) => { obj.orderType = value; } }, metadata: _metadata }, _orderType_initializers, _orderType_extraInitializers);
        __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
        __esDecorate(null, null, _shippingMethod_decorators, { kind: "field", name: "shippingMethod", static: false, private: false, access: { has: obj => "shippingMethod" in obj, get: obj => obj.shippingMethod, set: (obj, value) => { obj.shippingMethod = value; } }, metadata: _metadata }, _shippingMethod_initializers, _shippingMethod_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrderTemplateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrderTemplateModel = _classThis;
})();
exports.OrderTemplateModel = OrderTemplateModel;
// ============================================================================
// UTILITY FUNCTIONS - ORDER CREATION & ENTRY
// ============================================================================
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
function generateOrderNumber(prefix, sequence, length = 8) {
    try {
        const paddedSequence = sequence.toString().padStart(length, '0');
        return `${prefix}${paddedSequence}`;
    }
    catch (error) {
        throw new Error(`Failed to generate order number: ${error.message}`);
    }
}
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
async function createWebOrder(orderData, userId) {
    try {
        const orderNumber = await generateNextOrderNumber('WEB');
        const order = await OrderHeader.create({
            orderNumber,
            customerId: orderData.customer.customerId,
            orderDate: new Date(),
            orderSource: OrderSource.WEB,
            orderType: orderData.orderType,
            orderStatus: OrderStatus.DRAFT,
            priority: orderData.priority,
            customerInfo: orderData.customer,
            billingAddress: orderData.customer.billingAddress,
            shippingAddress: orderData.customer.shippingAddress || orderData.customer.billingAddress,
            shippingMethod: orderData.shippingMethod,
            paymentTerms: orderData.customer.paymentTerms,
            poNumber: orderData.poNumber,
            requestedDeliveryDate: orderData.requestedDeliveryDate,
            salesRepId: orderData.salesRepId,
            notes: orderData.notes,
            customFields: orderData.customFields,
            createdBy: userId,
            subtotal: 0,
            discountAmount: 0,
            taxAmount: 0,
            shippingAmount: 0,
            totalAmount: 0,
            currency: 'USD',
        });
        // Create order lines
        for (let i = 0; i < orderData.lineItems.length; i++) {
            const lineItem = orderData.lineItems[i];
            await OrderLine.create({
                orderId: order.orderId,
                lineNumber: i + 1,
                itemId: lineItem.itemId,
                itemNumber: lineItem.itemNumber,
                itemDescription: lineItem.itemDescription,
                quantity: lineItem.quantity,
                unitOfMeasure: lineItem.unitOfMeasure,
                unitPrice: lineItem.unitPrice,
                discount: lineItem.discount || 0,
                discountPercent: lineItem.discountPercent || 0,
                taxAmount: lineItem.taxAmount || 0,
                taxRate: lineItem.taxRate || 0,
                lineTotal: lineItem.lineTotal,
                requestedDeliveryDate: lineItem.requestedDeliveryDate,
                warehouseId: lineItem.warehouseId,
                notes: lineItem.notes,
                customFields: lineItem.customFields,
            });
        }
        return order;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create web order: ${error.message}`);
    }
}
/**
 * Create order from mobile channel
 *
 * @param orderData - Order creation data
 * @param deviceInfo - Mobile device information
 * @param userId - User ID creating the order
 * @returns Created order header
 */
async function createMobileOrder(orderData, deviceInfo, userId) {
    try {
        const orderNumber = await generateNextOrderNumber('MOB');
        const customFields = {
            ...orderData.customFields,
            deviceInfo,
            mobileApp: true,
        };
        const order = await OrderHeader.create({
            orderNumber,
            customerId: orderData.customer.customerId,
            orderDate: new Date(),
            orderSource: OrderSource.MOBILE,
            orderType: orderData.orderType,
            orderStatus: OrderStatus.DRAFT,
            priority: orderData.priority,
            customerInfo: orderData.customer,
            billingAddress: orderData.customer.billingAddress,
            shippingAddress: orderData.customer.shippingAddress || orderData.customer.billingAddress,
            shippingMethod: orderData.shippingMethod,
            paymentTerms: orderData.customer.paymentTerms,
            poNumber: orderData.poNumber,
            requestedDeliveryDate: orderData.requestedDeliveryDate,
            salesRepId: orderData.salesRepId,
            notes: orderData.notes,
            customFields,
            createdBy: userId,
            subtotal: 0,
            discountAmount: 0,
            taxAmount: 0,
            shippingAmount: 0,
            totalAmount: 0,
            currency: 'USD',
        });
        return order;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create mobile order: ${error.message}`);
    }
}
/**
 * Create order from EDI (Electronic Data Interchange)
 *
 * @param ediMessage - Parsed EDI 850 message
 * @param tradingPartnerId - Trading partner ID
 * @returns Created order header
 */
async function createEDIOrder(ediMessage, tradingPartnerId) {
    try {
        const orderNumber = await generateNextOrderNumber('EDI');
        // Parse EDI message to order structure
        const customerInfo = extractCustomerFromEDI(ediMessage);
        const lineItems = extractLineItemsFromEDI(ediMessage);
        const order = await OrderHeader.create({
            orderNumber,
            customerId: tradingPartnerId,
            orderDate: new Date(),
            orderSource: OrderSource.EDI,
            orderType: OrderType.STANDARD,
            orderStatus: OrderStatus.PENDING_VALIDATION,
            priority: OrderPriority.NORMAL,
            customerInfo,
            billingAddress: customerInfo.billingAddress,
            shippingAddress: customerInfo.shippingAddress,
            paymentTerms: customerInfo.paymentTerms,
            customFields: { ediMessage },
            createdBy: 'EDI_SYSTEM',
            subtotal: 0,
            taxAmount: 0,
            shippingAmount: 0,
            totalAmount: 0,
            currency: 'USD',
        });
        return order;
    }
    catch (error) {
        throw new common_1.UnprocessableEntityException(`Failed to create EDI order: ${error.message}`);
    }
}
/**
 * Create order from API call
 *
 * @param orderData - Order creation data
 * @param apiKey - API key used
 * @param sourceSystem - Source system identifier
 * @returns Created order header
 */
async function createAPIOrder(orderData, apiKey, sourceSystem) {
    try {
        const orderNumber = await generateNextOrderNumber('API');
        const customFields = {
            ...orderData.customFields,
            apiKey,
            sourceSystem,
            apiVersion: '1.0',
        };
        const order = await OrderHeader.create({
            orderNumber,
            customerId: orderData.customer.customerId,
            orderDate: new Date(),
            orderSource: OrderSource.API,
            orderType: orderData.orderType,
            orderStatus: OrderStatus.DRAFT,
            priority: orderData.priority,
            customerInfo: orderData.customer,
            billingAddress: orderData.customer.billingAddress,
            shippingAddress: orderData.customer.shippingAddress || orderData.customer.billingAddress,
            shippingMethod: orderData.shippingMethod,
            paymentTerms: orderData.customer.paymentTerms,
            poNumber: orderData.poNumber,
            requestedDeliveryDate: orderData.requestedDeliveryDate,
            salesRepId: orderData.salesRepId,
            notes: orderData.notes,
            customFields,
            createdBy: 'API_SYSTEM',
            subtotal: 0,
            discountAmount: 0,
            taxAmount: 0,
            shippingAmount: 0,
            totalAmount: 0,
            currency: 'USD',
        });
        return order;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create API order: ${error.message}`);
    }
}
/**
 * Create order from phone/call center
 *
 * @param orderData - Order creation data
 * @param callCenterRep - Call center representative ID
 * @param callId - Call tracking ID
 * @returns Created order header
 */
async function createPhoneOrder(orderData, callCenterRep, callId) {
    try {
        const orderNumber = await generateNextOrderNumber('PHN');
        const customFields = {
            ...orderData.customFields,
            callId,
            callCenterRep,
            orderMethod: 'PHONE',
        };
        const order = await OrderHeader.create({
            orderNumber,
            customerId: orderData.customer.customerId,
            orderDate: new Date(),
            orderSource: OrderSource.PHONE,
            orderType: orderData.orderType,
            orderStatus: OrderStatus.DRAFT,
            priority: orderData.priority,
            customerInfo: orderData.customer,
            billingAddress: orderData.customer.billingAddress,
            shippingAddress: orderData.customer.shippingAddress || orderData.customer.billingAddress,
            shippingMethod: orderData.shippingMethod,
            paymentTerms: orderData.customer.paymentTerms,
            poNumber: orderData.poNumber,
            requestedDeliveryDate: orderData.requestedDeliveryDate,
            salesRepId: orderData.salesRepId || callCenterRep,
            notes: orderData.notes,
            customFields,
            createdBy: callCenterRep,
            subtotal: 0,
            discountAmount: 0,
            taxAmount: 0,
            shippingAmount: 0,
            totalAmount: 0,
            currency: 'USD',
        });
        return order;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create phone order: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - ORDER VALIDATION
// ============================================================================
/**
 * Validate complete order with all business rules
 *
 * @param orderId - Order ID to validate
 * @returns Validation result with errors and warnings
 */
async function validateOrder(orderId) {
    try {
        const order = await OrderHeader.findByPk(orderId, {
            include: [{ model: OrderLine, as: 'lines' }],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        const errors = [];
        const warnings = [];
        // Validate customer
        const customerValidation = await validateCustomer(order.customerInfo);
        errors.push(...customerValidation.errors);
        warnings.push(...customerValidation.warnings);
        // Validate line items
        for (const line of order.lines) {
            const lineValidation = await validateOrderLine(line);
            errors.push(...lineValidation.errors);
            warnings.push(...lineValidation.warnings);
        }
        // Validate inventory availability
        const inventoryValidation = await validateInventoryAvailability(order.lines);
        errors.push(...inventoryValidation.errors);
        warnings.push(...inventoryValidation.warnings);
        // Validate pricing
        const pricingValidation = await validateOrderPricing(order);
        errors.push(...pricingValidation.errors);
        warnings.push(...pricingValidation.warnings);
        // Validate addresses
        const addressValidation = await validateAddresses(order.billingAddress, order.shippingAddress);
        errors.push(...addressValidation.errors);
        warnings.push(...addressValidation.warnings);
        const result = {
            isValid: errors.filter(e => e.severity === ValidationSeverity.ERROR).length === 0,
            errors,
            warnings,
            validatedAt: new Date(),
        };
        // Update order with validation result
        await order.update({
            validationResult: result,
            orderStatus: result.isValid ? OrderStatus.VALIDATED : OrderStatus.PENDING_VALIDATION,
        });
        return result;
    }
    catch (error) {
        throw new Error(`Order validation failed: ${error.message}`);
    }
}
/**
 * Validate customer information and credit standing
 *
 * @param customerInfo - Customer information to validate
 * @returns Validation result
 */
async function validateCustomer(customerInfo) {
    const errors = [];
    const warnings = [];
    try {
        // Validate customer exists and is active
        if (!customerInfo.customerId) {
            errors.push({
                code: 'CUSTOMER_ID_MISSING',
                field: 'customerId',
                message: 'Customer ID is required',
                severity: ValidationSeverity.ERROR,
            });
        }
        // Validate customer name
        if (!customerInfo.customerName || customerInfo.customerName.trim().length === 0) {
            errors.push({
                code: 'CUSTOMER_NAME_MISSING',
                field: 'customerName',
                message: 'Customer name is required',
                severity: ValidationSeverity.ERROR,
            });
        }
        // Validate payment terms
        if (!customerInfo.paymentTerms) {
            errors.push({
                code: 'PAYMENT_TERMS_MISSING',
                field: 'paymentTerms',
                message: 'Payment terms are required',
                severity: ValidationSeverity.ERROR,
            });
        }
        // Check credit limit if applicable
        if (customerInfo.creditLimit && customerInfo.currentBalance) {
            const availableCredit = customerInfo.creditLimit - customerInfo.currentBalance;
            if (availableCredit <= 0) {
                warnings.push({
                    code: 'CREDIT_LIMIT_EXCEEDED',
                    field: 'creditLimit',
                    message: `Customer has exceeded credit limit. Available: $${availableCredit.toFixed(2)}`,
                    severity: ValidationSeverity.WARNING,
                    details: {
                        creditLimit: customerInfo.creditLimit,
                        currentBalance: customerInfo.currentBalance,
                        availableCredit,
                    },
                });
            }
        }
        return { errors, warnings };
    }
    catch (error) {
        errors.push({
            code: 'CUSTOMER_VALIDATION_ERROR',
            message: `Customer validation failed: ${error.message}`,
            severity: ValidationSeverity.ERROR,
        });
        return { errors, warnings };
    }
}
/**
 * Validate individual order line item
 *
 * @param orderLine - Order line to validate
 * @returns Validation result
 */
async function validateOrderLine(orderLine) {
    const errors = [];
    const warnings = [];
    try {
        // Validate item ID
        if (!orderLine.itemId) {
            errors.push({
                code: 'ITEM_ID_MISSING',
                field: `line${orderLine.lineNumber}.itemId`,
                message: 'Item ID is required',
                severity: ValidationSeverity.ERROR,
            });
        }
        // Validate quantity
        if (!orderLine.quantity || orderLine.quantity <= 0) {
            errors.push({
                code: 'INVALID_QUANTITY',
                field: `line${orderLine.lineNumber}.quantity`,
                message: 'Quantity must be greater than zero',
                severity: ValidationSeverity.ERROR,
            });
        }
        // Validate unit price
        if (orderLine.unitPrice < 0) {
            errors.push({
                code: 'INVALID_UNIT_PRICE',
                field: `line${orderLine.lineNumber}.unitPrice`,
                message: 'Unit price cannot be negative',
                severity: ValidationSeverity.ERROR,
            });
        }
        // Validate line total calculation
        const expectedTotal = (orderLine.quantity * orderLine.unitPrice) - orderLine.discount;
        if (Math.abs(expectedTotal - orderLine.lineTotal) > 0.01) {
            errors.push({
                code: 'LINE_TOTAL_MISMATCH',
                field: `line${orderLine.lineNumber}.lineTotal`,
                message: 'Line total does not match calculation',
                severity: ValidationSeverity.ERROR,
                details: {
                    expected: expectedTotal,
                    actual: orderLine.lineTotal,
                },
            });
        }
        return { errors, warnings };
    }
    catch (error) {
        errors.push({
            code: 'LINE_VALIDATION_ERROR',
            message: `Line validation failed: ${error.message}`,
            severity: ValidationSeverity.ERROR,
        });
        return { errors, warnings };
    }
}
/**
 * Validate inventory availability for all order lines
 *
 * @param orderLines - Order lines to check
 * @returns Validation result with availability details
 */
async function validateInventoryAvailability(orderLines) {
    const errors = [];
    const warnings = [];
    try {
        for (const line of orderLines) {
            const availability = await checkInventoryAvailability(line.itemId, line.warehouseId || 'DEFAULT', line.quantity);
            if (!availability.isAvailable) {
                if (availability.quantityAvailable === 0) {
                    errors.push({
                        code: 'OUT_OF_STOCK',
                        field: `line${line.lineNumber}.itemId`,
                        message: `Item ${line.itemNumber} is out of stock`,
                        severity: ValidationSeverity.ERROR,
                        details: availability,
                    });
                }
                else if (availability.quantityAvailable < line.quantity) {
                    warnings.push({
                        code: 'PARTIAL_AVAILABILITY',
                        field: `line${line.lineNumber}.quantity`,
                        message: `Only ${availability.quantityAvailable} of ${line.quantity} available for ${line.itemNumber}`,
                        severity: ValidationSeverity.WARNING,
                        details: availability,
                    });
                }
            }
        }
        return { errors, warnings };
    }
    catch (error) {
        errors.push({
            code: 'INVENTORY_CHECK_ERROR',
            message: `Inventory validation failed: ${error.message}`,
            severity: ValidationSeverity.ERROR,
        });
        return { errors, warnings };
    }
}
/**
 * Validate order pricing and calculations
 *
 * @param order - Order to validate
 * @returns Validation result
 */
async function validateOrderPricing(order) {
    const errors = [];
    const warnings = [];
    try {
        // Validate subtotal matches sum of line totals
        const lines = await OrderLine.findAll({ where: { orderId: order.orderId } });
        const calculatedSubtotal = lines.reduce((sum, line) => sum + Number(line.lineTotal), 0);
        if (Math.abs(calculatedSubtotal - Number(order.subtotal)) > 0.01) {
            errors.push({
                code: 'SUBTOTAL_MISMATCH',
                field: 'subtotal',
                message: 'Order subtotal does not match sum of line totals',
                severity: ValidationSeverity.ERROR,
                details: {
                    expected: calculatedSubtotal,
                    actual: order.subtotal,
                },
            });
        }
        // Validate total amount calculation
        const expectedTotal = Number(order.subtotal) - Number(order.discountAmount) +
            Number(order.taxAmount) + Number(order.shippingAmount);
        if (Math.abs(expectedTotal - Number(order.totalAmount)) > 0.01) {
            errors.push({
                code: 'TOTAL_AMOUNT_MISMATCH',
                field: 'totalAmount',
                message: 'Order total does not match calculation',
                severity: ValidationSeverity.ERROR,
                details: {
                    expected: expectedTotal,
                    actual: order.totalAmount,
                },
            });
        }
        // Warn if tax amount is zero for non-exempt customers
        if (Number(order.taxAmount) === 0 && !order.customerInfo.taxExempt) {
            warnings.push({
                code: 'ZERO_TAX_AMOUNT',
                field: 'taxAmount',
                message: 'Tax amount is zero for non-exempt customer',
                severity: ValidationSeverity.WARNING,
            });
        }
        return { errors, warnings };
    }
    catch (error) {
        errors.push({
            code: 'PRICING_VALIDATION_ERROR',
            message: `Pricing validation failed: ${error.message}`,
            severity: ValidationSeverity.ERROR,
        });
        return { errors, warnings };
    }
}
/**
 * Validate billing and shipping addresses
 *
 * @param billingAddress - Billing address
 * @param shippingAddress - Shipping address
 * @returns Validation result
 */
async function validateAddresses(billingAddress, shippingAddress) {
    const errors = [];
    const warnings = [];
    try {
        // Validate billing address
        const billingValidation = validateSingleAddress(billingAddress, 'billingAddress');
        errors.push(...billingValidation.errors);
        warnings.push(...billingValidation.warnings);
        // Validate shipping address
        if (shippingAddress) {
            const shippingValidation = validateSingleAddress(shippingAddress, 'shippingAddress');
            errors.push(...shippingValidation.errors);
            warnings.push(...shippingValidation.warnings);
        }
        return { errors, warnings };
    }
    catch (error) {
        errors.push({
            code: 'ADDRESS_VALIDATION_ERROR',
            message: `Address validation failed: ${error.message}`,
            severity: ValidationSeverity.ERROR,
        });
        return { errors, warnings };
    }
}
// ============================================================================
// UTILITY FUNCTIONS - CREDIT CHECKING
// ============================================================================
/**
 * Perform credit check for order
 *
 * @param orderId - Order ID to check
 * @returns Credit check result
 */
async function performCreditCheck(orderId) {
    try {
        const order = await OrderHeader.findByPk(orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        const customerInfo = order.customerInfo;
        // If prepaid or COD, no credit check needed
        if (customerInfo.paymentTerms === PaymentTerms.PREPAID ||
            customerInfo.paymentTerms === PaymentTerms.COD) {
            const result = {
                status: CreditCheckStatus.NOT_REQUIRED,
                creditLimit: 0,
                currentBalance: 0,
                availableCredit: 0,
                orderAmount: Number(order.totalAmount),
                approved: true,
                reason: 'Payment terms do not require credit check',
                checkedAt: new Date(),
            };
            await order.update({
                creditCheckStatus: CreditCheckStatus.NOT_REQUIRED,
                creditCheckResult: result,
            });
            return result;
        }
        const creditLimit = customerInfo.creditLimit || 0;
        const currentBalance = customerInfo.currentBalance || 0;
        const availableCredit = creditLimit - currentBalance;
        const orderAmount = Number(order.totalAmount);
        let status;
        let approved;
        let reason;
        if (availableCredit >= orderAmount) {
            status = CreditCheckStatus.APPROVED;
            approved = true;
            reason = 'Sufficient credit available';
        }
        else if (availableCredit > 0 && availableCredit < orderAmount) {
            status = CreditCheckStatus.MANUAL_REVIEW;
            approved = false;
            reason = `Order amount ($${orderAmount.toFixed(2)}) exceeds available credit ($${availableCredit.toFixed(2)})`;
        }
        else {
            status = CreditCheckStatus.OVER_LIMIT;
            approved = false;
            reason = 'Customer over credit limit';
        }
        const result = {
            status,
            creditLimit,
            currentBalance,
            availableCredit,
            orderAmount,
            approved,
            reason,
            checkedAt: new Date(),
        };
        await order.update({
            creditCheckStatus: status,
            creditCheckResult: result,
        });
        return result;
    }
    catch (error) {
        throw new Error(`Credit check failed: ${error.message}`);
    }
}
/**
 * Override credit check with manual approval
 *
 * @param orderId - Order ID
 * @param approvedBy - User ID approving the override
 * @param reason - Reason for override
 * @returns Updated credit check result
 */
async function overrideCreditCheck(orderId, approvedBy, reason) {
    try {
        const order = await OrderHeader.findByPk(orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        const existingResult = order.creditCheckResult;
        const result = {
            ...existingResult,
            status: CreditCheckStatus.APPROVED,
            approved: true,
            reason: `Manual override by ${approvedBy}: ${reason}`,
            checkedAt: new Date(),
            checkedBy: approvedBy,
        };
        await order.update({
            creditCheckStatus: CreditCheckStatus.APPROVED,
            creditCheckResult: result,
            orderStatus: OrderStatus.APPROVED,
        });
        return result;
    }
    catch (error) {
        throw new Error(`Credit check override failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - INVENTORY CHECKING
// ============================================================================
/**
 * Check inventory availability for item
 *
 * @param itemId - Item ID
 * @param warehouseId - Warehouse ID
 * @param quantityRequested - Requested quantity
 * @returns Inventory availability details
 */
async function checkInventoryAvailability(itemId, warehouseId, quantityRequested) {
    try {
        // Mock implementation - replace with actual inventory service call
        const mockInventory = {
            quantityOnHand: 100,
            quantityReserved: 20,
        };
        const quantityAvailable = mockInventory.quantityOnHand - mockInventory.quantityReserved;
        const isAvailable = quantityAvailable >= quantityRequested;
        const quantityBackordered = isAvailable ? 0 : quantityRequested - quantityAvailable;
        return {
            itemId,
            warehouseId,
            quantityRequested,
            quantityAvailable,
            quantityOnHand: mockInventory.quantityOnHand,
            quantityReserved: mockInventory.quantityReserved,
            quantityBackordered,
            isAvailable,
            expectedAvailabilityDate: !isAvailable ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined,
        };
    }
    catch (error) {
        throw new Error(`Inventory availability check failed: ${error.message}`);
    }
}
/**
 * Reserve inventory for order
 *
 * @param orderId - Order ID
 * @returns Reservation results for each line item
 */
async function reserveInventoryForOrder(orderId) {
    try {
        const lines = await OrderLine.findAll({ where: { orderId } });
        const results = [];
        for (const line of lines) {
            const availability = await checkInventoryAvailability(line.itemId, line.warehouseId || 'DEFAULT', line.quantity);
            if (availability.isAvailable) {
                // Mock reservation - replace with actual inventory service call
                results.push({
                    lineNumber: line.lineNumber,
                    reserved: true,
                });
            }
            else {
                results.push({
                    lineNumber: line.lineNumber,
                    reserved: false,
                    reason: `Insufficient inventory. Available: ${availability.quantityAvailable}, Requested: ${line.quantity}`,
                });
            }
        }
        return results;
    }
    catch (error) {
        throw new Error(`Inventory reservation failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - PRICING CALCULATIONS
// ============================================================================
/**
 * Calculate unit price for item based on customer and quantity
 *
 * @param context - Price calculation context
 * @returns Calculated unit price
 */
async function calculateUnitPrice(context) {
    try {
        // Mock implementation - replace with actual pricing service
        let basePrice = 100.00;
        // Apply quantity discounts
        if (context.quantity >= 100) {
            basePrice *= 0.85; // 15% discount
        }
        else if (context.quantity >= 50) {
            basePrice *= 0.90; // 10% discount
        }
        else if (context.quantity >= 10) {
            basePrice *= 0.95; // 5% discount
        }
        // Apply customer price group discounts
        if (context.customerPriceGroup === 'WHOLESALE') {
            basePrice *= 0.80;
        }
        else if (context.customerPriceGroup === 'VIP') {
            basePrice *= 0.85;
        }
        // Apply promotion codes
        if (context.promotionCode) {
            basePrice *= 0.90; // 10% promotion discount
        }
        return Number(basePrice.toFixed(4));
    }
    catch (error) {
        throw new Error(`Unit price calculation failed: ${error.message}`);
    }
}
/**
 * Calculate order totals including subtotal, tax, shipping
 *
 * @param orderId - Order ID
 * @returns Updated order pricing
 */
async function calculateOrderTotals(orderId) {
    try {
        const order = await OrderHeader.findByPk(orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        const lines = await OrderLine.findAll({ where: { orderId } });
        // Calculate subtotal
        const subtotal = lines.reduce((sum, line) => sum + Number(line.lineTotal), 0);
        // Calculate tax
        const taxContext = {
            customerId: order.customerId,
            shipToAddress: order.shippingAddress,
            shipFromAddress: { country: 'US', stateProvince: 'CA' }, // Mock
            lineItems: lines.map(l => ({
                lineNumber: l.lineNumber,
                itemId: l.itemId,
                itemNumber: l.itemNumber,
                itemDescription: l.itemDescription,
                quantity: Number(l.quantity),
                unitOfMeasure: l.unitOfMeasure,
                unitPrice: Number(l.unitPrice),
                lineTotal: Number(l.lineTotal),
            })),
            orderDate: order.orderDate,
            taxExempt: order.customerInfo.taxExempt || false,
            taxExemptNumber: order.customerInfo.taxExemptNumber,
        };
        const taxAmount = await calculateOrderTax(taxContext);
        // Calculate shipping
        const shippingContext = {
            shipToAddress: order.shippingAddress,
            shipFromAddress: { country: 'US', stateProvince: 'CA' }, // Mock
            shippingMethod: order.shippingMethod || ShippingMethod.STANDARD,
            totalWeight: 10.0, // Mock
            totalVolume: 5.0, // Mock
            declaredValue: subtotal,
            lineItems: lines.map(l => ({
                lineNumber: l.lineNumber,
                itemId: l.itemId,
                itemNumber: l.itemNumber,
                itemDescription: l.itemDescription,
                quantity: Number(l.quantity),
                unitOfMeasure: l.unitOfMeasure,
                unitPrice: Number(l.unitPrice),
                lineTotal: Number(l.lineTotal),
            })),
        };
        const shippingAmount = await calculateShippingCost(shippingContext);
        const totalAmount = subtotal - Number(order.discountAmount) + taxAmount + shippingAmount;
        const pricing = {
            subtotal,
            discountAmount: Number(order.discountAmount),
            taxAmount,
            shippingAmount,
            handlingAmount: 0,
            totalAmount,
            currency: order.currency,
        };
        // Update order with calculated totals
        await order.update({
            subtotal: pricing.subtotal,
            taxAmount: pricing.taxAmount,
            shippingAmount: pricing.shippingAmount,
            totalAmount: pricing.totalAmount,
        });
        return pricing;
    }
    catch (error) {
        throw new Error(`Order totals calculation failed: ${error.message}`);
    }
}
/**
 * Calculate tax amount for order
 *
 * @param context - Tax calculation context
 * @returns Calculated tax amount
 */
async function calculateOrderTax(context) {
    try {
        // If tax exempt, return 0
        if (context.taxExempt) {
            return 0;
        }
        // Mock implementation - replace with actual tax service (Avalara, TaxJar, etc.)
        const subtotal = context.lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
        // Use state-based tax rate (mock)
        let taxRate = 0.0;
        const state = context.shipToAddress.stateProvince;
        if (state === 'CA') {
            taxRate = 0.0725; // California base rate
        }
        else if (state === 'NY') {
            taxRate = 0.04; // New York base rate
        }
        else if (state === 'TX') {
            taxRate = 0.0625; // Texas base rate
        }
        const taxAmount = subtotal * taxRate;
        return Number(taxAmount.toFixed(2));
    }
    catch (error) {
        throw new Error(`Tax calculation failed: ${error.message}`);
    }
}
/**
 * Calculate shipping cost for order
 *
 * @param context - Shipping calculation context
 * @returns Calculated shipping cost
 */
async function calculateShippingCost(context) {
    try {
        // Mock implementation - replace with actual shipping service (UPS, FedEx, etc.)
        let baseCost = 10.00;
        // Apply shipping method multipliers
        switch (context.shippingMethod) {
            case ShippingMethod.OVERNIGHT:
                baseCost *= 5.0;
                break;
            case ShippingMethod.TWO_DAY:
                baseCost *= 3.0;
                break;
            case ShippingMethod.EXPRESS:
                baseCost *= 2.0;
                break;
            case ShippingMethod.FREIGHT:
                baseCost *= 10.0;
                break;
            case ShippingMethod.PICKUP:
                return 0;
            default:
                baseCost *= 1.0;
        }
        // Apply weight-based charges
        if (context.totalWeight > 50) {
            baseCost += (context.totalWeight - 50) * 0.50;
        }
        // Free shipping over threshold
        if (context.declaredValue > 100) {
            baseCost *= 0.5; // 50% discount
        }
        return Number(baseCost.toFixed(2));
    }
    catch (error) {
        throw new Error(`Shipping cost calculation failed: ${error.message}`);
    }
}
/**
 * Apply discount to order
 *
 * @param orderId - Order ID
 * @param discountAmount - Discount amount or percentage
 * @param isPercentage - Whether discount is percentage
 * @param reason - Reason for discount
 * @returns Updated order with discount applied
 */
async function applyOrderDiscount(orderId, discountAmount, isPercentage, reason) {
    try {
        const order = await OrderHeader.findByPk(orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        let finalDiscountAmount;
        if (isPercentage) {
            if (discountAmount < 0 || discountAmount > 100) {
                throw new common_1.BadRequestException('Discount percentage must be between 0 and 100');
            }
            finalDiscountAmount = Number(order.subtotal) * (discountAmount / 100);
        }
        else {
            finalDiscountAmount = discountAmount;
        }
        await order.update({
            discountAmount: finalDiscountAmount,
        });
        // Recalculate totals
        await calculateOrderTotals(orderId);
        return order.reload();
    }
    catch (error) {
        throw new Error(`Apply discount failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - ORDER TEMPLATES
// ============================================================================
/**
 * Create order template for quick entry
 *
 * @param templateData - Template data
 * @param userId - User creating template
 * @returns Created template
 */
async function createOrderTemplate(templateData, userId) {
    try {
        const template = await OrderTemplateModel.create({
            templateName: templateData.templateName,
            description: templateData.description,
            customerId: templateData.customerId,
            orderType: templateData.orderType,
            lineItems: templateData.lineItems,
            shippingMethod: templateData.shippingMethod,
            isActive: templateData.isActive,
            createdBy: userId,
        });
        return template;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create order template: ${error.message}`);
    }
}
/**
 * Create order from template
 *
 * @param templateId - Template ID
 * @param customerId - Customer ID for the order
 * @param userId - User creating order
 * @returns Created order
 */
async function createOrderFromTemplate(templateId, customerId, userId) {
    try {
        const template = await OrderTemplateModel.findByPk(templateId);
        if (!template) {
            throw new common_1.NotFoundException(`Template ${templateId} not found`);
        }
        if (!template.isActive) {
            throw new common_1.BadRequestException('Template is not active');
        }
        // Fetch customer information
        const customerInfo = await fetchCustomerInfo(customerId);
        const orderNumber = await generateNextOrderNumber('TPL');
        const order = await OrderHeader.create({
            orderNumber,
            customerId,
            orderDate: new Date(),
            orderSource: OrderSource.WEB,
            orderType: template.orderType,
            orderStatus: OrderStatus.DRAFT,
            priority: OrderPriority.NORMAL,
            customerInfo,
            billingAddress: customerInfo.billingAddress,
            shippingAddress: customerInfo.shippingAddress || customerInfo.billingAddress,
            shippingMethod: template.shippingMethod,
            paymentTerms: customerInfo.paymentTerms,
            createdBy: userId,
            subtotal: 0,
            taxAmount: 0,
            shippingAmount: 0,
            totalAmount: 0,
            currency: 'USD',
            customFields: { templateId },
        });
        // Create lines from template
        for (let i = 0; i < template.lineItems.length; i++) {
            const templateItem = template.lineItems[i];
            await OrderLine.create({
                orderId: order.orderId,
                lineNumber: i + 1,
                itemId: templateItem.itemId,
                itemNumber: templateItem.itemNumber,
                itemDescription: templateItem.itemDescription,
                quantity: templateItem.quantity,
                unitOfMeasure: templateItem.unitOfMeasure,
                unitPrice: templateItem.unitPrice,
                lineTotal: templateItem.quantity * templateItem.unitPrice,
            });
        }
        // Calculate totals
        await calculateOrderTotals(order.orderId);
        return order.reload();
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create order from template: ${error.message}`);
    }
}
/**
 * Get order templates for customer or user
 *
 * @param filters - Filter criteria
 * @returns Array of templates
 */
async function getOrderTemplates(filters) {
    try {
        const whereClause = {};
        if (filters.customerId) {
            whereClause.customerId = filters.customerId;
        }
        if (filters.createdBy) {
            whereClause.createdBy = filters.createdBy;
        }
        if (filters.isActive !== undefined) {
            whereClause.isActive = filters.isActive;
        }
        const templates = await OrderTemplateModel.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });
        return templates;
    }
    catch (error) {
        throw new Error(`Failed to fetch order templates: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - BULK OPERATIONS
// ============================================================================
/**
 * Import bulk orders from CSV or Excel
 *
 * @param records - Array of import records
 * @param userId - User importing orders
 * @returns Import results with created orders and errors
 */
async function importBulkOrders(records, userId) {
    const successful = [];
    const failed = [];
    try {
        for (const record of records) {
            try {
                // Validate record
                if (!record.isValid) {
                    failed.push({ record, errors: record.errors || ['Invalid record'] });
                    continue;
                }
                // Fetch customer info
                const customerInfo = await fetchCustomerInfo(record.customerId);
                // Create order
                const orderNumber = await generateNextOrderNumber('BLK');
                const order = await OrderHeader.create({
                    orderNumber,
                    customerId: record.customerId,
                    orderDate: new Date(),
                    orderSource: OrderSource.API,
                    orderType: OrderType.STANDARD,
                    orderStatus: OrderStatus.DRAFT,
                    priority: OrderPriority.NORMAL,
                    customerInfo,
                    billingAddress: customerInfo.billingAddress,
                    shippingAddress: customerInfo.shippingAddress || customerInfo.billingAddress,
                    paymentTerms: customerInfo.paymentTerms,
                    poNumber: record.poNumber,
                    requestedDeliveryDate: record.requestedDeliveryDate,
                    createdBy: userId,
                    subtotal: 0,
                    taxAmount: 0,
                    shippingAmount: 0,
                    totalAmount: 0,
                    currency: 'USD',
                });
                // Create order line
                await OrderLine.create({
                    orderId: order.orderId,
                    lineNumber: 1,
                    itemId: record.itemId,
                    itemNumber: record.itemId,
                    itemDescription: 'Bulk import item',
                    quantity: record.quantity,
                    unitOfMeasure: 'EA',
                    unitPrice: record.unitPrice || 0,
                    lineTotal: record.quantity * (record.unitPrice || 0),
                });
                // Calculate totals
                await calculateOrderTotals(order.orderId);
                successful.push(order);
            }
            catch (error) {
                failed.push({ record, errors: [error.message] });
            }
        }
        return { successful, failed };
    }
    catch (error) {
        throw new Error(`Bulk import failed: ${error.message}`);
    }
}
/**
 * Duplicate existing order
 *
 * @param orderId - Order ID to duplicate
 * @param userId - User creating duplicate
 * @returns Duplicated order
 */
async function duplicateOrder(orderId, userId) {
    try {
        const originalOrder = await OrderHeader.findByPk(orderId, {
            include: [{ model: OrderLine, as: 'lines' }],
        });
        if (!originalOrder) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        const orderNumber = await generateNextOrderNumber('DUP');
        // Create duplicate order
        const duplicateOrder = await OrderHeader.create({
            orderNumber,
            customerId: originalOrder.customerId,
            orderDate: new Date(),
            orderSource: originalOrder.orderSource,
            orderType: originalOrder.orderType,
            orderStatus: OrderStatus.DRAFT,
            priority: originalOrder.priority,
            customerInfo: originalOrder.customerInfo,
            billingAddress: originalOrder.billingAddress,
            shippingAddress: originalOrder.shippingAddress,
            shippingMethod: originalOrder.shippingMethod,
            paymentTerms: originalOrder.paymentTerms,
            salesRepId: originalOrder.salesRepId,
            createdBy: userId,
            subtotal: 0,
            taxAmount: 0,
            shippingAmount: 0,
            totalAmount: 0,
            currency: originalOrder.currency,
            customFields: {
                ...originalOrder.customFields,
                duplicatedFrom: originalOrder.orderId,
            },
        });
        // Duplicate order lines
        for (const line of originalOrder.lines) {
            await OrderLine.create({
                orderId: duplicateOrder.orderId,
                lineNumber: line.lineNumber,
                itemId: line.itemId,
                itemNumber: line.itemNumber,
                itemDescription: line.itemDescription,
                quantity: line.quantity,
                unitOfMeasure: line.unitOfMeasure,
                unitPrice: line.unitPrice,
                discount: line.discount,
                discountPercent: line.discountPercent,
                taxAmount: line.taxAmount,
                taxRate: line.taxRate,
                lineTotal: line.lineTotal,
                warehouseId: line.warehouseId,
                notes: line.notes,
                customFields: line.customFields,
            });
        }
        // Recalculate totals with current prices
        await calculateOrderTotals(duplicateOrder.orderId);
        return duplicateOrder.reload();
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to duplicate order: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - ORDER SPLITTING & MERGING
// ============================================================================
/**
 * Split order into multiple orders based on criteria
 *
 * @param orderId - Order ID to split
 * @param config - Split configuration
 * @param userId - User performing split
 * @returns Array of split orders
 */
async function splitOrder(orderId, config, userId) {
    try {
        const originalOrder = await OrderHeader.findByPk(orderId, {
            include: [{ model: OrderLine, as: 'lines' }],
        });
        if (!originalOrder) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        const splitOrders = [];
        if (config.splitBy === 'WAREHOUSE') {
            // Group lines by warehouse
            const warehouseGroups = new Map();
            for (const line of originalOrder.lines) {
                const warehouse = line.warehouseId || 'DEFAULT';
                if (!warehouseGroups.has(warehouse)) {
                    warehouseGroups.set(warehouse, []);
                }
                warehouseGroups.get(warehouse).push(line);
            }
            // Create order for each warehouse
            for (const [warehouse, lines] of warehouseGroups) {
                const newOrder = await createSplitOrder(originalOrder, lines, userId, { warehouse });
                splitOrders.push(newOrder);
            }
        }
        // Mark original order as split
        await originalOrder.update({
            orderStatus: OrderStatus.CANCELLED,
            notes: `${originalOrder.notes || ''}\n\nOrder split into ${splitOrders.length} orders`,
        });
        return splitOrders;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to split order: ${error.message}`);
    }
}
/**
 * Merge multiple orders into single order
 *
 * @param config - Merge configuration
 * @param userId - User performing merge
 * @returns Merged order
 */
async function mergeOrders(config, userId) {
    try {
        if (config.orderIds.length < 2) {
            throw new common_1.BadRequestException('At least 2 orders required for merge');
        }
        const orders = await OrderHeader.findAll({
            where: { orderId: config.orderIds },
            include: [{ model: OrderLine, as: 'lines' }],
        });
        if (orders.length !== config.orderIds.length) {
            throw new common_1.NotFoundException('One or more orders not found');
        }
        // Validate all orders have same customer
        const customerId = orders[0].customerId;
        if (!orders.every(o => o.customerId === customerId)) {
            throw new common_1.BadRequestException('All orders must belong to same customer');
        }
        const orderNumber = await generateNextOrderNumber('MRG');
        // Create merged order
        const mergedOrder = await OrderHeader.create({
            orderNumber,
            customerId,
            orderDate: new Date(),
            orderSource: orders[0].orderSource,
            orderType: orders[0].orderType,
            orderStatus: OrderStatus.DRAFT,
            priority: orders[0].priority,
            customerInfo: orders[0].customerInfo,
            billingAddress: orders[0].billingAddress,
            shippingAddress: orders[0].shippingAddress,
            shippingMethod: orders[0].shippingMethod,
            paymentTerms: orders[0].paymentTerms,
            createdBy: userId,
            subtotal: 0,
            taxAmount: 0,
            shippingAmount: 0,
            totalAmount: 0,
            currency: orders[0].currency,
            customFields: {
                mergedFrom: config.orderIds,
            },
        });
        // Merge all lines
        let lineNumber = 1;
        for (const order of orders) {
            for (const line of order.lines) {
                await OrderLine.create({
                    orderId: mergedOrder.orderId,
                    lineNumber: lineNumber++,
                    itemId: line.itemId,
                    itemNumber: line.itemNumber,
                    itemDescription: line.itemDescription,
                    quantity: line.quantity,
                    unitOfMeasure: line.unitOfMeasure,
                    unitPrice: line.unitPrice,
                    discount: line.discount,
                    discountPercent: line.discountPercent,
                    lineTotal: line.lineTotal,
                    warehouseId: line.warehouseId,
                    notes: line.notes,
                    customFields: {
                        ...line.customFields,
                        originalOrderId: order.orderId,
                    },
                });
            }
        }
        // Calculate totals
        await calculateOrderTotals(mergedOrder.orderId);
        // Mark original orders as merged
        for (const order of orders) {
            await order.update({
                orderStatus: OrderStatus.CANCELLED,
                notes: `${order.notes || ''}\n\nMerged into order ${orderNumber}`,
            });
        }
        return mergedOrder.reload();
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to merge orders: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW & STATE MANAGEMENT
// ============================================================================
/**
 * Update order status with validation
 *
 * @param orderId - Order ID
 * @param newStatus - New status
 * @param userId - User making change
 * @param notes - Optional notes
 * @returns Updated order
 */
async function updateOrderStatus(orderId, newStatus, userId, notes) {
    try {
        const order = await OrderHeader.findByPk(orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        // Validate status transition
        const validTransition = validateStatusTransition(order.orderStatus, newStatus);
        if (!validTransition) {
            throw new common_1.BadRequestException(`Invalid status transition from ${order.orderStatus} to ${newStatus}`);
        }
        await order.update({
            orderStatus: newStatus,
            notes: notes ? `${order.notes || ''}\n\n${notes}` : order.notes,
            updatedBy: userId,
        });
        return order;
    }
    catch (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
    }
}
/**
 * Validate status transition is allowed
 *
 * @param currentStatus - Current status
 * @param newStatus - Desired new status
 * @returns Whether transition is valid
 */
function validateStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
        [OrderStatus.DRAFT]: [
            OrderStatus.PENDING_VALIDATION,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.PENDING_VALIDATION]: [
            OrderStatus.VALIDATED,
            OrderStatus.DRAFT,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.VALIDATED]: [
            OrderStatus.PENDING_APPROVAL,
            OrderStatus.CONFIRMED,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.PENDING_APPROVAL]: [
            OrderStatus.APPROVED,
            OrderStatus.REJECTED,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.APPROVED]: [
            OrderStatus.PENDING_PAYMENT,
            OrderStatus.PROCESSING,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.REJECTED]: [
            OrderStatus.DRAFT,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.PENDING_PAYMENT]: [
            OrderStatus.PAYMENT_RECEIVED,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.PAYMENT_RECEIVED]: [
            OrderStatus.PROCESSING,
        ],
        [OrderStatus.PROCESSING]: [
            OrderStatus.CONFIRMED,
            OrderStatus.ON_HOLD,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.CONFIRMED]: [
            OrderStatus.COMPLETED,
            OrderStatus.ON_HOLD,
        ],
        [OrderStatus.ON_HOLD]: [
            OrderStatus.PROCESSING,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.CANCELLED]: [],
        [OrderStatus.COMPLETED]: [],
    };
    return validTransitions[currentStatus]?.includes(newStatus) || false;
}
/**
 * Get order workflow history
 *
 * @param orderId - Order ID
 * @returns Workflow history
 */
async function getOrderWorkflowHistory(orderId) {
    try {
        // Mock implementation - replace with actual audit log query
        const order = await OrderHeader.findByPk(orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        return [
            {
                status: OrderStatus.DRAFT,
                timestamp: order.createdAt,
                userId: order.createdBy,
            },
            {
                status: order.orderStatus,
                timestamp: order.updatedAt,
                userId: order.updatedBy || order.createdBy,
            },
        ];
    }
    catch (error) {
        throw new Error(`Failed to fetch workflow history: ${error.message}`);
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generate next order number for given prefix
 */
async function generateNextOrderNumber(prefix) {
    // Mock implementation - replace with actual sequence generator
    const sequence = Math.floor(Math.random() * 1000000);
    return generateOrderNumber(prefix, sequence, 8);
}
/**
 * Fetch customer information from customer service
 */
async function fetchCustomerInfo(customerId) {
    // Mock implementation - replace with actual customer service call
    return {
        customerId,
        customerNumber: `CUST${customerId}`,
        customerName: 'Mock Customer',
        email: 'customer@example.com',
        phone: '555-0100',
        billingAddress: {
            addressLine1: '123 Main St',
            city: 'San Francisco',
            stateProvince: 'CA',
            postalCode: '94105',
            country: 'US',
            addressType: 'BILLING',
        },
        shippingAddress: {
            addressLine1: '123 Main St',
            city: 'San Francisco',
            stateProvince: 'CA',
            postalCode: '94105',
            country: 'US',
            addressType: 'SHIPPING',
        },
        creditLimit: 50000,
        currentBalance: 10000,
        paymentTerms: PaymentTerms.NET_30,
    };
}
/**
 * Extract customer info from EDI message
 */
function extractCustomerFromEDI(ediMessage) {
    // Mock implementation
    return {
        customerId: 'EDI_CUSTOMER',
        customerName: 'EDI Trading Partner',
        billingAddress: {
            addressLine1: '123 EDI Lane',
            city: 'Commerce',
            stateProvince: 'CA',
            postalCode: '90001',
            country: 'US',
        },
        paymentTerms: PaymentTerms.NET_30,
    };
}
/**
 * Extract line items from EDI message
 */
function extractLineItemsFromEDI(ediMessage) {
    // Mock implementation
    return [
        {
            lineNumber: 1,
            itemId: 'EDI_ITEM_001',
            itemNumber: 'ITEM001',
            itemDescription: 'EDI Item',
            quantity: 10,
            unitOfMeasure: 'EA',
            unitPrice: 100,
            lineTotal: 1000,
        },
    ];
}
/**
 * Validate single address
 */
function validateSingleAddress(address, fieldPrefix) {
    const errors = [];
    const warnings = [];
    if (!address.addressLine1) {
        errors.push({
            code: 'ADDRESS_LINE1_MISSING',
            field: `${fieldPrefix}.addressLine1`,
            message: 'Address line 1 is required',
            severity: ValidationSeverity.ERROR,
        });
    }
    if (!address.city) {
        errors.push({
            code: 'CITY_MISSING',
            field: `${fieldPrefix}.city`,
            message: 'City is required',
            severity: ValidationSeverity.ERROR,
        });
    }
    if (!address.stateProvince) {
        errors.push({
            code: 'STATE_MISSING',
            field: `${fieldPrefix}.stateProvince`,
            message: 'State/Province is required',
            severity: ValidationSeverity.ERROR,
        });
    }
    if (!address.postalCode) {
        errors.push({
            code: 'POSTAL_CODE_MISSING',
            field: `${fieldPrefix}.postalCode`,
            message: 'Postal code is required',
            severity: ValidationSeverity.ERROR,
        });
    }
    if (!address.country) {
        errors.push({
            code: 'COUNTRY_MISSING',
            field: `${fieldPrefix}.country`,
            message: 'Country is required',
            severity: ValidationSeverity.ERROR,
        });
    }
    return { errors, warnings };
}
/**
 * Create split order from original
 */
async function createSplitOrder(originalOrder, lines, userId, metadata) {
    const orderNumber = await generateNextOrderNumber('SPL');
    const splitOrder = await OrderHeader.create({
        orderNumber,
        customerId: originalOrder.customerId,
        orderDate: new Date(),
        orderSource: originalOrder.orderSource,
        orderType: originalOrder.orderType,
        orderStatus: OrderStatus.DRAFT,
        priority: originalOrder.priority,
        customerInfo: originalOrder.customerInfo,
        billingAddress: originalOrder.billingAddress,
        shippingAddress: originalOrder.shippingAddress,
        shippingMethod: originalOrder.shippingMethod,
        paymentTerms: originalOrder.paymentTerms,
        parentOrderId: originalOrder.orderId,
        createdBy: userId,
        subtotal: 0,
        taxAmount: 0,
        shippingAmount: 0,
        totalAmount: 0,
        currency: originalOrder.currency,
        customFields: {
            ...metadata,
            splitFrom: originalOrder.orderId,
        },
    });
    // Copy lines
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        await OrderLine.create({
            orderId: splitOrder.orderId,
            lineNumber: i + 1,
            itemId: line.itemId,
            itemNumber: line.itemNumber,
            itemDescription: line.itemDescription,
            quantity: line.quantity,
            unitOfMeasure: line.unitOfMeasure,
            unitPrice: line.unitPrice,
            discount: line.discount,
            discountPercent: line.discountPercent,
            lineTotal: line.lineTotal,
            warehouseId: line.warehouseId,
            notes: line.notes,
            customFields: line.customFields,
        });
    }
    // Calculate totals
    await calculateOrderTotals(splitOrder.orderId);
    return splitOrder.reload();
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Order Creation Functions
    generateOrderNumber,
    createWebOrder,
    createMobileOrder,
    createEDIOrder,
    createAPIOrder,
    createPhoneOrder,
    // Validation Functions
    validateOrder,
    validateCustomer,
    validateOrderLine,
    validateInventoryAvailability,
    validateOrderPricing,
    validateAddresses,
    // Credit Check Functions
    performCreditCheck,
    overrideCreditCheck,
    // Inventory Functions
    checkInventoryAvailability,
    reserveInventoryForOrder,
    // Pricing Functions
    calculateUnitPrice,
    calculateOrderTotals,
    calculateOrderTax,
    calculateShippingCost,
    applyOrderDiscount,
    // Template Functions
    createOrderTemplate,
    createOrderFromTemplate,
    getOrderTemplates,
    // Bulk Operations
    importBulkOrders,
    duplicateOrder,
    // Split/Merge Functions
    splitOrder,
    mergeOrders,
    // Workflow Functions
    updateOrderStatus,
    validateStatusTransition,
    getOrderWorkflowHistory,
    // Models
    OrderHeader,
    OrderLine,
    OrderTemplateModel,
    // Enums
    OrderSource,
    OrderStatus,
    OrderType,
    OrderPriority,
    PaymentTerms,
    ShippingMethod,
    TaxCalculationMethod,
    CreditCheckStatus,
    ValidationSeverity,
};
//# sourceMappingURL=order-creation-processing-kit.js.map