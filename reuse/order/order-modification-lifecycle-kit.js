"use strict";
/**
 * LOC: WC-ORD-MODLIF-001
 * File: /reuse/order/order-modification-lifecycle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Order services
 *   - Workflow engines
 *   - Audit systems
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveOrderDto = exports.CloneOrderDto = exports.ApprovalDecisionDto = exports.TransitionStateDto = exports.ReleaseHoldDto = exports.PlaceHoldDto = exports.CancelOrderDto = exports.CreateAmendmentDto = exports.ChangeCustomerDto = exports.ChangeDateDto = exports.AdjustPriceDto = exports.ModifyQuantityDto = exports.CancellationReason = exports.HoldReason = exports.ChangeApprovalStatus = exports.OrderModificationType = exports.OrderStatus = void 0;
exports.modifyLineItemQuantity = modifyLineItemQuantity;
exports.adjustLineItemPrice = adjustLineItemPrice;
exports.changeDeliveryDate = changeDeliveryDate;
exports.changeOrderCustomer = changeOrderCustomer;
exports.addLineItemToOrder = addLineItemToOrder;
exports.removeLineItemFromOrder = removeLineItemFromOrder;
exports.updateOrderNotes = updateOrderNotes;
exports.createOrderAmendment = createOrderAmendment;
exports.approveAmendment = approveAmendment;
exports.rejectAmendment = rejectAmendment;
exports.getCustomerApproval = getCustomerApproval;
exports.applyAmendmentToOrder = applyAmendmentToOrder;
exports.calculateChangeImpact = calculateChangeImpact;
exports.generateChangeNotification = generateChangeNotification;
exports.cancelOrder = cancelOrder;
exports.partialCancelOrder = partialCancelOrder;
exports.processRefund = processRefund;
exports.calculateRestockingFee = calculateRestockingFee;
exports.validateCancellationEligibility = validateCancellationEligibility;
exports.sendCancellationNotification = sendCancellationNotification;
exports.restockCancelledItems = restockCancelledItems;
exports.placeOrderOnHold = placeOrderOnHold;
exports.releaseOrderHold = releaseOrderHold;
exports.autoReleaseExpiredHolds = autoReleaseExpiredHolds;
exports.extendHoldDuration = extendHoldDuration;
exports.getOrdersOnHold = getOrdersOnHold;
exports.sendHoldNotification = sendHoldNotification;
exports.validateHoldEligibility = validateHoldEligibility;
exports.transitionOrderStatus = transitionOrderStatus;
exports.validateStateTransition = validateStateTransition;
exports.getOrderLifecycleTimeline = getOrderLifecycleTimeline;
exports.canRollbackOrder = canRollbackOrder;
exports.rollbackOrderState = rollbackOrderState;
exports.getCurrentLifecycleStage = getCurrentLifecycleStage;
exports.generateStateMachineDiagram = generateStateMachineDiagram;
exports.createOrderAuditEntry = createOrderAuditEntry;
exports.getOrderAuditTrail = getOrderAuditTrail;
exports.createOrderVersion = createOrderVersion;
exports.restoreOrderVersion = restoreOrderVersion;
exports.cloneOrder = cloneOrder;
exports.archiveOrder = archiveOrder;
exports.generateModificationReport = generateModificationReport;
/**
 * File: /reuse/order/order-modification-lifecycle-kit.ts
 * Locator: WC-ORD-MODLIF-001
 * Purpose: Order Modification & Lifecycle - Complete order change management and lifecycle operations
 *
 * Upstream: Independent utility module for order modification and lifecycle operations
 * Downstream: ../backend/order/*, Order modules, Workflow services, Audit systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, class-validator
 * Exports: 42 comprehensive functions for order modifications, amendments, cancellations, holds, lifecycle, history
 *
 * LLM Context: Enterprise-grade order modification and lifecycle management utilities for healthcare operations.
 * Provides comprehensive order change management, amendment workflows, cancellation processing, hold/release operations,
 * state machine transitions, audit trails, version control, approval workflows, notification systems, and archival.
 * Designed for HIPAA compliance with full audit logging and change tracking.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================
/**
 * Order status enumeration
 */
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "DRAFT";
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["ON_HOLD"] = "ON_HOLD";
    OrderStatus["PARTIALLY_SHIPPED"] = "PARTIALLY_SHIPPED";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["REFUNDED"] = "REFUNDED";
    OrderStatus["ARCHIVED"] = "ARCHIVED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
/**
 * Order modification type enumeration
 */
var OrderModificationType;
(function (OrderModificationType) {
    OrderModificationType["QUANTITY_CHANGE"] = "QUANTITY_CHANGE";
    OrderModificationType["PRICE_ADJUSTMENT"] = "PRICE_ADJUSTMENT";
    OrderModificationType["DATE_CHANGE"] = "DATE_CHANGE";
    OrderModificationType["CUSTOMER_CHANGE"] = "CUSTOMER_CHANGE";
    OrderModificationType["ADDRESS_CHANGE"] = "ADDRESS_CHANGE";
    OrderModificationType["PAYMENT_METHOD_CHANGE"] = "PAYMENT_METHOD_CHANGE";
    OrderModificationType["SHIPPING_METHOD_CHANGE"] = "SHIPPING_METHOD_CHANGE";
    OrderModificationType["LINE_ITEM_ADDITION"] = "LINE_ITEM_ADDITION";
    OrderModificationType["LINE_ITEM_REMOVAL"] = "LINE_ITEM_REMOVAL";
    OrderModificationType["DISCOUNT_APPLICATION"] = "DISCOUNT_APPLICATION";
    OrderModificationType["TAX_ADJUSTMENT"] = "TAX_ADJUSTMENT";
    OrderModificationType["NOTES_UPDATE"] = "NOTES_UPDATE";
})(OrderModificationType || (exports.OrderModificationType = OrderModificationType = {}));
/**
 * Change approval status
 */
var ChangeApprovalStatus;
(function (ChangeApprovalStatus) {
    ChangeApprovalStatus["PENDING"] = "PENDING";
    ChangeApprovalStatus["APPROVED"] = "APPROVED";
    ChangeApprovalStatus["REJECTED"] = "REJECTED";
    ChangeApprovalStatus["AUTO_APPROVED"] = "AUTO_APPROVED";
})(ChangeApprovalStatus || (exports.ChangeApprovalStatus = ChangeApprovalStatus = {}));
/**
 * Hold reason enumeration
 */
var HoldReason;
(function (HoldReason) {
    HoldReason["PAYMENT_VERIFICATION"] = "PAYMENT_VERIFICATION";
    HoldReason["FRAUD_CHECK"] = "FRAUD_CHECK";
    HoldReason["INVENTORY_CHECK"] = "INVENTORY_CHECK";
    HoldReason["CUSTOMER_REQUEST"] = "CUSTOMER_REQUEST";
    HoldReason["ADDRESS_VERIFICATION"] = "ADDRESS_VERIFICATION";
    HoldReason["CREDIT_LIMIT_EXCEEDED"] = "CREDIT_LIMIT_EXCEEDED";
    HoldReason["MANUAL_REVIEW"] = "MANUAL_REVIEW";
    HoldReason["REGULATORY_COMPLIANCE"] = "REGULATORY_COMPLIANCE";
    HoldReason["OTHER"] = "OTHER";
})(HoldReason || (exports.HoldReason = HoldReason = {}));
/**
 * Cancellation reason enumeration
 */
var CancellationReason;
(function (CancellationReason) {
    CancellationReason["CUSTOMER_REQUEST"] = "CUSTOMER_REQUEST";
    CancellationReason["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    CancellationReason["PAYMENT_FAILED"] = "PAYMENT_FAILED";
    CancellationReason["FRAUD_DETECTED"] = "FRAUD_DETECTED";
    CancellationReason["DUPLICATE_ORDER"] = "DUPLICATE_ORDER";
    CancellationReason["SHIPPING_ISSUE"] = "SHIPPING_ISSUE";
    CancellationReason["PRICING_ERROR"] = "PRICING_ERROR";
    CancellationReason["CUSTOMER_UNAVAILABLE"] = "CUSTOMER_UNAVAILABLE";
    CancellationReason["REGULATORY_RESTRICTION"] = "REGULATORY_RESTRICTION";
    CancellationReason["OTHER"] = "OTHER";
})(CancellationReason || (exports.CancellationReason = CancellationReason = {}));
// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================
/**
 * DTO for quantity modification
 */
let ModifyQuantityDto = (() => {
    var _a;
    let _lineItemId_decorators;
    let _lineItemId_initializers = [];
    let _lineItemId_extraInitializers = [];
    let _newQuantity_decorators;
    let _newQuantity_initializers = [];
    let _newQuantity_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _requiresApproval_decorators;
    let _requiresApproval_initializers = [];
    let _requiresApproval_extraInitializers = [];
    return _a = class ModifyQuantityDto {
            constructor() {
                this.lineItemId = __runInitializers(this, _lineItemId_initializers, void 0);
                this.newQuantity = (__runInitializers(this, _lineItemId_extraInitializers), __runInitializers(this, _newQuantity_initializers, void 0));
                this.reason = (__runInitializers(this, _newQuantity_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.requiresApproval = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _requiresApproval_initializers, void 0));
                __runInitializers(this, _requiresApproval_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _lineItemId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line item ID to modify' }), (0, class_validator_1.IsUUID)()];
            _newQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'New quantity', minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reason for modification' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _requiresApproval_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Requires approval flag' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _lineItemId_decorators, { kind: "field", name: "lineItemId", static: false, private: false, access: { has: obj => "lineItemId" in obj, get: obj => obj.lineItemId, set: (obj, value) => { obj.lineItemId = value; } }, metadata: _metadata }, _lineItemId_initializers, _lineItemId_extraInitializers);
            __esDecorate(null, null, _newQuantity_decorators, { kind: "field", name: "newQuantity", static: false, private: false, access: { has: obj => "newQuantity" in obj, get: obj => obj.newQuantity, set: (obj, value) => { obj.newQuantity = value; } }, metadata: _metadata }, _newQuantity_initializers, _newQuantity_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _requiresApproval_decorators, { kind: "field", name: "requiresApproval", static: false, private: false, access: { has: obj => "requiresApproval" in obj, get: obj => obj.requiresApproval, set: (obj, value) => { obj.requiresApproval = value; } }, metadata: _metadata }, _requiresApproval_initializers, _requiresApproval_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ModifyQuantityDto = ModifyQuantityDto;
/**
 * DTO for price adjustment
 */
let AdjustPriceDto = (() => {
    var _a;
    let _lineItemId_decorators;
    let _lineItemId_initializers = [];
    let _lineItemId_extraInitializers = [];
    let _newPrice_decorators;
    let _newPrice_initializers = [];
    let _newPrice_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _overrideApproval_decorators;
    let _overrideApproval_initializers = [];
    let _overrideApproval_extraInitializers = [];
    return _a = class AdjustPriceDto {
            constructor() {
                this.lineItemId = __runInitializers(this, _lineItemId_initializers, void 0);
                this.newPrice = (__runInitializers(this, _lineItemId_extraInitializers), __runInitializers(this, _newPrice_initializers, void 0));
                this.reason = (__runInitializers(this, _newPrice_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.overrideApproval = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _overrideApproval_initializers, void 0));
                __runInitializers(this, _overrideApproval_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _lineItemId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line item ID to adjust' }), (0, class_validator_1.IsUUID)()];
            _newPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'New unit price' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Adjustment reason' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _overrideApproval_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Override approval requirement' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _lineItemId_decorators, { kind: "field", name: "lineItemId", static: false, private: false, access: { has: obj => "lineItemId" in obj, get: obj => obj.lineItemId, set: (obj, value) => { obj.lineItemId = value; } }, metadata: _metadata }, _lineItemId_initializers, _lineItemId_extraInitializers);
            __esDecorate(null, null, _newPrice_decorators, { kind: "field", name: "newPrice", static: false, private: false, access: { has: obj => "newPrice" in obj, get: obj => obj.newPrice, set: (obj, value) => { obj.newPrice = value; } }, metadata: _metadata }, _newPrice_initializers, _newPrice_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _overrideApproval_decorators, { kind: "field", name: "overrideApproval", static: false, private: false, access: { has: obj => "overrideApproval" in obj, get: obj => obj.overrideApproval, set: (obj, value) => { obj.overrideApproval = value; } }, metadata: _metadata }, _overrideApproval_initializers, _overrideApproval_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AdjustPriceDto = AdjustPriceDto;
/**
 * DTO for date change
 */
let ChangeDateDto = (() => {
    var _a;
    let _newDeliveryDate_decorators;
    let _newDeliveryDate_initializers = [];
    let _newDeliveryDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _notifyCustomer_decorators;
    let _notifyCustomer_initializers = [];
    let _notifyCustomer_extraInitializers = [];
    return _a = class ChangeDateDto {
            constructor() {
                this.newDeliveryDate = __runInitializers(this, _newDeliveryDate_initializers, void 0);
                this.reason = (__runInitializers(this, _newDeliveryDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.notifyCustomer = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _notifyCustomer_initializers, void 0));
                __runInitializers(this, _notifyCustomer_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _newDeliveryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'New requested delivery date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reason for date change' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _notifyCustomer_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Notify customer' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _newDeliveryDate_decorators, { kind: "field", name: "newDeliveryDate", static: false, private: false, access: { has: obj => "newDeliveryDate" in obj, get: obj => obj.newDeliveryDate, set: (obj, value) => { obj.newDeliveryDate = value; } }, metadata: _metadata }, _newDeliveryDate_initializers, _newDeliveryDate_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _notifyCustomer_decorators, { kind: "field", name: "notifyCustomer", static: false, private: false, access: { has: obj => "notifyCustomer" in obj, get: obj => obj.notifyCustomer, set: (obj, value) => { obj.notifyCustomer = value; } }, metadata: _metadata }, _notifyCustomer_initializers, _notifyCustomer_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ChangeDateDto = ChangeDateDto;
/**
 * DTO for customer change
 */
let ChangeCustomerDto = (() => {
    var _a;
    let _newCustomerId_decorators;
    let _newCustomerId_initializers = [];
    let _newCustomerId_extraInitializers = [];
    let _transferReason_decorators;
    let _transferReason_initializers = [];
    let _transferReason_extraInitializers = [];
    let _updateBillingAddress_decorators;
    let _updateBillingAddress_initializers = [];
    let _updateBillingAddress_extraInitializers = [];
    let _updateShippingAddress_decorators;
    let _updateShippingAddress_initializers = [];
    let _updateShippingAddress_extraInitializers = [];
    return _a = class ChangeCustomerDto {
            constructor() {
                this.newCustomerId = __runInitializers(this, _newCustomerId_initializers, void 0);
                this.transferReason = (__runInitializers(this, _newCustomerId_extraInitializers), __runInitializers(this, _transferReason_initializers, void 0));
                this.updateBillingAddress = (__runInitializers(this, _transferReason_extraInitializers), __runInitializers(this, _updateBillingAddress_initializers, void 0));
                this.updateShippingAddress = (__runInitializers(this, _updateBillingAddress_extraInitializers), __runInitializers(this, _updateShippingAddress_initializers, void 0));
                __runInitializers(this, _updateShippingAddress_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _newCustomerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'New customer ID' }), (0, class_validator_1.IsUUID)()];
            _transferReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer reason' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _updateBillingAddress_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Update billing address' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _updateShippingAddress_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Update shipping address' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _newCustomerId_decorators, { kind: "field", name: "newCustomerId", static: false, private: false, access: { has: obj => "newCustomerId" in obj, get: obj => obj.newCustomerId, set: (obj, value) => { obj.newCustomerId = value; } }, metadata: _metadata }, _newCustomerId_initializers, _newCustomerId_extraInitializers);
            __esDecorate(null, null, _transferReason_decorators, { kind: "field", name: "transferReason", static: false, private: false, access: { has: obj => "transferReason" in obj, get: obj => obj.transferReason, set: (obj, value) => { obj.transferReason = value; } }, metadata: _metadata }, _transferReason_initializers, _transferReason_extraInitializers);
            __esDecorate(null, null, _updateBillingAddress_decorators, { kind: "field", name: "updateBillingAddress", static: false, private: false, access: { has: obj => "updateBillingAddress" in obj, get: obj => obj.updateBillingAddress, set: (obj, value) => { obj.updateBillingAddress = value; } }, metadata: _metadata }, _updateBillingAddress_initializers, _updateBillingAddress_extraInitializers);
            __esDecorate(null, null, _updateShippingAddress_decorators, { kind: "field", name: "updateShippingAddress", static: false, private: false, access: { has: obj => "updateShippingAddress" in obj, get: obj => obj.updateShippingAddress, set: (obj, value) => { obj.updateShippingAddress = value; } }, metadata: _metadata }, _updateShippingAddress_initializers, _updateShippingAddress_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ChangeCustomerDto = ChangeCustomerDto;
/**
 * DTO for creating amendment
 */
let CreateAmendmentDto = (() => {
    var _a;
    let _modifications_decorators;
    let _modifications_initializers = [];
    let _modifications_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _requiresCustomerApproval_decorators;
    let _requiresCustomerApproval_initializers = [];
    let _requiresCustomerApproval_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    return _a = class CreateAmendmentDto {
            constructor() {
                this.modifications = __runInitializers(this, _modifications_initializers, void 0);
                this.notes = (__runInitializers(this, _modifications_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.requiresCustomerApproval = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _requiresCustomerApproval_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _requiresCustomerApproval_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                __runInitializers(this, _effectiveDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _modifications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Modifications to include', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true })];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Amendment notes' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _requiresCustomerApproval_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Requires customer approval' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _effectiveDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Effective date' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _modifications_decorators, { kind: "field", name: "modifications", static: false, private: false, access: { has: obj => "modifications" in obj, get: obj => obj.modifications, set: (obj, value) => { obj.modifications = value; } }, metadata: _metadata }, _modifications_initializers, _modifications_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _requiresCustomerApproval_decorators, { kind: "field", name: "requiresCustomerApproval", static: false, private: false, access: { has: obj => "requiresCustomerApproval" in obj, get: obj => obj.requiresCustomerApproval, set: (obj, value) => { obj.requiresCustomerApproval = value; } }, metadata: _metadata }, _requiresCustomerApproval_initializers, _requiresCustomerApproval_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAmendmentDto = CreateAmendmentDto;
/**
 * DTO for cancellation request
 */
let CancelOrderDto = (() => {
    var _a;
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _lineItemIds_decorators;
    let _lineItemIds_initializers = [];
    let _lineItemIds_extraInitializers = [];
    let _processRefund_decorators;
    let _processRefund_initializers = [];
    let _processRefund_extraInitializers = [];
    let _restockingFeePercent_decorators;
    let _restockingFeePercent_initializers = [];
    let _restockingFeePercent_extraInitializers = [];
    let _notifyCustomer_decorators;
    let _notifyCustomer_initializers = [];
    let _notifyCustomer_extraInitializers = [];
    return _a = class CancelOrderDto {
            constructor() {
                this.reason = __runInitializers(this, _reason_initializers, void 0);
                this.description = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.lineItemIds = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _lineItemIds_initializers, void 0));
                this.processRefund = (__runInitializers(this, _lineItemIds_extraInitializers), __runInitializers(this, _processRefund_initializers, void 0));
                this.restockingFeePercent = (__runInitializers(this, _processRefund_extraInitializers), __runInitializers(this, _restockingFeePercent_initializers, void 0));
                this.notifyCustomer = (__runInitializers(this, _restockingFeePercent_extraInitializers), __runInitializers(this, _notifyCustomer_initializers, void 0));
                __runInitializers(this, _notifyCustomer_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cancellation reason', enum: CancellationReason }), (0, class_validator_1.IsEnum)(CancellationReason)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detailed description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _lineItemIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Partial cancellation - line item IDs' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)(undefined, { each: true })];
            _processRefund_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Process refund automatically' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _restockingFeePercent_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Restocking fee percentage (0-1)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _notifyCustomer_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Notify customer' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _lineItemIds_decorators, { kind: "field", name: "lineItemIds", static: false, private: false, access: { has: obj => "lineItemIds" in obj, get: obj => obj.lineItemIds, set: (obj, value) => { obj.lineItemIds = value; } }, metadata: _metadata }, _lineItemIds_initializers, _lineItemIds_extraInitializers);
            __esDecorate(null, null, _processRefund_decorators, { kind: "field", name: "processRefund", static: false, private: false, access: { has: obj => "processRefund" in obj, get: obj => obj.processRefund, set: (obj, value) => { obj.processRefund = value; } }, metadata: _metadata }, _processRefund_initializers, _processRefund_extraInitializers);
            __esDecorate(null, null, _restockingFeePercent_decorators, { kind: "field", name: "restockingFeePercent", static: false, private: false, access: { has: obj => "restockingFeePercent" in obj, get: obj => obj.restockingFeePercent, set: (obj, value) => { obj.restockingFeePercent = value; } }, metadata: _metadata }, _restockingFeePercent_initializers, _restockingFeePercent_extraInitializers);
            __esDecorate(null, null, _notifyCustomer_decorators, { kind: "field", name: "notifyCustomer", static: false, private: false, access: { has: obj => "notifyCustomer" in obj, get: obj => obj.notifyCustomer, set: (obj, value) => { obj.notifyCustomer = value; } }, metadata: _metadata }, _notifyCustomer_initializers, _notifyCustomer_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CancelOrderDto = CancelOrderDto;
/**
 * DTO for placing order on hold
 */
let PlaceHoldDto = (() => {
    var _a;
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _autoReleaseDuration_decorators;
    let _autoReleaseDuration_initializers = [];
    let _autoReleaseDuration_extraInitializers = [];
    let _notifyUsers_decorators;
    let _notifyUsers_initializers = [];
    let _notifyUsers_extraInitializers = [];
    return _a = class PlaceHoldDto {
            constructor() {
                this.reason = __runInitializers(this, _reason_initializers, void 0);
                this.description = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.autoReleaseDuration = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _autoReleaseDuration_initializers, void 0));
                this.notifyUsers = (__runInitializers(this, _autoReleaseDuration_extraInitializers), __runInitializers(this, _notifyUsers_initializers, void 0));
                __runInitializers(this, _notifyUsers_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hold reason', enum: HoldReason }), (0, class_validator_1.IsEnum)(HoldReason)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hold description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _autoReleaseDuration_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Auto-release after duration (minutes)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _notifyUsers_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Send notifications to' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _autoReleaseDuration_decorators, { kind: "field", name: "autoReleaseDuration", static: false, private: false, access: { has: obj => "autoReleaseDuration" in obj, get: obj => obj.autoReleaseDuration, set: (obj, value) => { obj.autoReleaseDuration = value; } }, metadata: _metadata }, _autoReleaseDuration_initializers, _autoReleaseDuration_extraInitializers);
            __esDecorate(null, null, _notifyUsers_decorators, { kind: "field", name: "notifyUsers", static: false, private: false, access: { has: obj => "notifyUsers" in obj, get: obj => obj.notifyUsers, set: (obj, value) => { obj.notifyUsers = value; } }, metadata: _metadata }, _notifyUsers_initializers, _notifyUsers_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PlaceHoldDto = PlaceHoldDto;
/**
 * DTO for releasing hold
 */
let ReleaseHoldDto = (() => {
    var _a;
    let _releaseNotes_decorators;
    let _releaseNotes_initializers = [];
    let _releaseNotes_extraInitializers = [];
    let _resumeProcessing_decorators;
    let _resumeProcessing_initializers = [];
    let _resumeProcessing_extraInitializers = [];
    return _a = class ReleaseHoldDto {
            constructor() {
                this.releaseNotes = __runInitializers(this, _releaseNotes_initializers, void 0);
                this.resumeProcessing = (__runInitializers(this, _releaseNotes_extraInitializers), __runInitializers(this, _resumeProcessing_initializers, void 0));
                __runInitializers(this, _resumeProcessing_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _releaseNotes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Release notes' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _resumeProcessing_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Resume processing immediately' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _releaseNotes_decorators, { kind: "field", name: "releaseNotes", static: false, private: false, access: { has: obj => "releaseNotes" in obj, get: obj => obj.releaseNotes, set: (obj, value) => { obj.releaseNotes = value; } }, metadata: _metadata }, _releaseNotes_initializers, _releaseNotes_extraInitializers);
            __esDecorate(null, null, _resumeProcessing_decorators, { kind: "field", name: "resumeProcessing", static: false, private: false, access: { has: obj => "resumeProcessing" in obj, get: obj => obj.resumeProcessing, set: (obj, value) => { obj.resumeProcessing = value; } }, metadata: _metadata }, _resumeProcessing_initializers, _resumeProcessing_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ReleaseHoldDto = ReleaseHoldDto;
/**
 * DTO for state transition
 */
let TransitionStateDto = (() => {
    var _a;
    let _targetStatus_decorators;
    let _targetStatus_initializers = [];
    let _targetStatus_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _skipValidations_decorators;
    let _skipValidations_initializers = [];
    let _skipValidations_extraInitializers = [];
    return _a = class TransitionStateDto {
            constructor() {
                this.targetStatus = __runInitializers(this, _targetStatus_initializers, void 0);
                this.reason = (__runInitializers(this, _targetStatus_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.skipValidations = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _skipValidations_initializers, void 0));
                __runInitializers(this, _skipValidations_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _targetStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target status', enum: OrderStatus }), (0, class_validator_1.IsEnum)(OrderStatus)];
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Transition reason' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _skipValidations_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Skip validations' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _targetStatus_decorators, { kind: "field", name: "targetStatus", static: false, private: false, access: { has: obj => "targetStatus" in obj, get: obj => obj.targetStatus, set: (obj, value) => { obj.targetStatus = value; } }, metadata: _metadata }, _targetStatus_initializers, _targetStatus_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _skipValidations_decorators, { kind: "field", name: "skipValidations", static: false, private: false, access: { has: obj => "skipValidations" in obj, get: obj => obj.skipValidations, set: (obj, value) => { obj.skipValidations = value; } }, metadata: _metadata }, _skipValidations_initializers, _skipValidations_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TransitionStateDto = TransitionStateDto;
/**
 * DTO for approval decision
 */
let ApprovalDecisionDto = (() => {
    var _a;
    let _decision_decorators;
    let _decision_initializers = [];
    let _decision_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    return _a = class ApprovalDecisionDto {
            constructor() {
                this.decision = __runInitializers(this, _decision_initializers, void 0);
                this.notes = (__runInitializers(this, _decision_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.conditions = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
                __runInitializers(this, _conditions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _decision_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval decision', enum: ChangeApprovalStatus }), (0, class_validator_1.IsEnum)(ChangeApprovalStatus)];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Decision notes' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _conditions_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Conditions or requirements' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _decision_decorators, { kind: "field", name: "decision", static: false, private: false, access: { has: obj => "decision" in obj, get: obj => obj.decision, set: (obj, value) => { obj.decision = value; } }, metadata: _metadata }, _decision_initializers, _decision_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApprovalDecisionDto = ApprovalDecisionDto;
/**
 * DTO for order clone
 */
let CloneOrderDto = (() => {
    var _a;
    let _newCustomerId_decorators;
    let _newCustomerId_initializers = [];
    let _newCustomerId_extraInitializers = [];
    let _includeModifications_decorators;
    let _includeModifications_initializers = [];
    let _includeModifications_extraInitializers = [];
    let _resetToDraft_decorators;
    let _resetToDraft_initializers = [];
    let _resetToDraft_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    return _a = class CloneOrderDto {
            constructor() {
                this.newCustomerId = __runInitializers(this, _newCustomerId_initializers, void 0);
                this.includeModifications = (__runInitializers(this, _newCustomerId_extraInitializers), __runInitializers(this, _includeModifications_initializers, void 0));
                this.resetToDraft = (__runInitializers(this, _includeModifications_extraInitializers), __runInitializers(this, _resetToDraft_initializers, void 0));
                this.tags = (__runInitializers(this, _resetToDraft_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _newCustomerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'New customer ID (if different)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _includeModifications_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include modifications' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _resetToDraft_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reset to draft status' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Clone tags' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _newCustomerId_decorators, { kind: "field", name: "newCustomerId", static: false, private: false, access: { has: obj => "newCustomerId" in obj, get: obj => obj.newCustomerId, set: (obj, value) => { obj.newCustomerId = value; } }, metadata: _metadata }, _newCustomerId_initializers, _newCustomerId_extraInitializers);
            __esDecorate(null, null, _includeModifications_decorators, { kind: "field", name: "includeModifications", static: false, private: false, access: { has: obj => "includeModifications" in obj, get: obj => obj.includeModifications, set: (obj, value) => { obj.includeModifications = value; } }, metadata: _metadata }, _includeModifications_initializers, _includeModifications_extraInitializers);
            __esDecorate(null, null, _resetToDraft_decorators, { kind: "field", name: "resetToDraft", static: false, private: false, access: { has: obj => "resetToDraft" in obj, get: obj => obj.resetToDraft, set: (obj, value) => { obj.resetToDraft = value; } }, metadata: _metadata }, _resetToDraft_initializers, _resetToDraft_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CloneOrderDto = CloneOrderDto;
/**
 * DTO for archival
 */
let ArchiveOrderDto = (() => {
    var _a;
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _createBackup_decorators;
    let _createBackup_initializers = [];
    let _createBackup_extraInitializers = [];
    let _retentionDays_decorators;
    let _retentionDays_initializers = [];
    let _retentionDays_extraInitializers = [];
    return _a = class ArchiveOrderDto {
            constructor() {
                this.reason = __runInitializers(this, _reason_initializers, void 0);
                this.createBackup = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _createBackup_initializers, void 0));
                this.retentionDays = (__runInitializers(this, _createBackup_extraInitializers), __runInitializers(this, _retentionDays_initializers, void 0));
                __runInitializers(this, _retentionDays_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Archival reason' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _createBackup_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Create backup before archival' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _retentionDays_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Retention period (days)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _createBackup_decorators, { kind: "field", name: "createBackup", static: false, private: false, access: { has: obj => "createBackup" in obj, get: obj => obj.createBackup, set: (obj, value) => { obj.createBackup = value; } }, metadata: _metadata }, _createBackup_initializers, _createBackup_extraInitializers);
            __esDecorate(null, null, _retentionDays_decorators, { kind: "field", name: "retentionDays", static: false, private: false, access: { has: obj => "retentionDays" in obj, get: obj => obj.retentionDays, set: (obj, value) => { obj.retentionDays = value; } }, metadata: _metadata }, _retentionDays_initializers, _retentionDays_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ArchiveOrderDto = ArchiveOrderDto;
// ============================================================================
// SECTION 1: ORDER MODIFICATIONS (Functions 1-7)
// ============================================================================
/**
 * 1. Modifies line item quantity in an order.
 *
 * @param {Order} order - Order to modify
 * @param {ModifyQuantityDto} dto - Modification details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const modifiedOrder = await modifyLineItemQuantity(order, {
 *   lineItemId: 'line-123',
 *   newQuantity: 5,
 *   reason: 'Customer requested increase'
 * }, 'user-456');
 * ```
 */
async function modifyLineItemQuantity(order, dto, userId) {
    const lineItem = order.lineItems.find(item => item.lineItemId === dto.lineItemId);
    if (!lineItem) {
        throw new common_1.NotFoundException(`Line item ${dto.lineItemId} not found`);
    }
    const previousQuantity = lineItem.quantity;
    const modification = {
        modificationId: generateModificationId(),
        orderId: order.orderId,
        type: OrderModificationType.QUANTITY_CHANGE,
        timestamp: new Date(),
        modifiedBy: userId,
        modifiedByRole: 'user', // Would come from context
        previousValue: previousQuantity,
        newValue: dto.newQuantity,
        reason: dto.reason,
        approvalStatus: dto.requiresApproval
            ? ChangeApprovalStatus.PENDING
            : ChangeApprovalStatus.AUTO_APPROVED,
    };
    // Update line item
    lineItem.quantity = dto.newQuantity;
    lineItem.subtotal = lineItem.quantity * lineItem.unitPrice;
    lineItem.total = lineItem.subtotal - lineItem.discountAmount + lineItem.taxAmount;
    lineItem.modifiedAt = new Date();
    lineItem.modifiedBy = userId;
    lineItem.version++;
    // Recalculate order totals
    const updatedOrder = recalculateOrderTotals(order);
    updatedOrder.modifications.push(modification);
    updatedOrder.version++;
    updatedOrder.updatedAt = new Date();
    updatedOrder.updatedBy = userId;
    return updatedOrder;
}
/**
 * 2. Adjusts price for a line item.
 *
 * @param {Order} order - Order to modify
 * @param {AdjustPriceDto} dto - Price adjustment details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const adjusted = await adjustLineItemPrice(order, {
 *   lineItemId: 'line-123',
 *   newPrice: 99.99,
 *   reason: 'Price match guarantee'
 * }, 'user-456');
 * ```
 */
async function adjustLineItemPrice(order, dto, userId) {
    const lineItem = order.lineItems.find(item => item.lineItemId === dto.lineItemId);
    if (!lineItem) {
        throw new common_1.NotFoundException(`Line item ${dto.lineItemId} not found`);
    }
    const previousPrice = lineItem.unitPrice;
    const priceDifference = Math.abs(dto.newPrice - previousPrice);
    const percentageChange = (priceDifference / previousPrice) * 100;
    // Require approval for significant price changes (>10%)
    const requiresApproval = percentageChange > 10 && !dto.overrideApproval;
    const modification = {
        modificationId: generateModificationId(),
        orderId: order.orderId,
        type: OrderModificationType.PRICE_ADJUSTMENT,
        timestamp: new Date(),
        modifiedBy: userId,
        modifiedByRole: 'user',
        previousValue: previousPrice,
        newValue: dto.newPrice,
        reason: dto.reason,
        approvalStatus: requiresApproval
            ? ChangeApprovalStatus.PENDING
            : ChangeApprovalStatus.AUTO_APPROVED,
        metadata: { percentageChange, priceDifference },
    };
    // Update line item
    lineItem.unitPrice = dto.newPrice;
    lineItem.subtotal = lineItem.quantity * lineItem.unitPrice;
    lineItem.total = lineItem.subtotal - lineItem.discountAmount + lineItem.taxAmount;
    lineItem.modifiedAt = new Date();
    lineItem.modifiedBy = userId;
    lineItem.version++;
    const updatedOrder = recalculateOrderTotals(order);
    updatedOrder.modifications.push(modification);
    updatedOrder.version++;
    updatedOrder.updatedAt = new Date();
    updatedOrder.updatedBy = userId;
    return updatedOrder;
}
/**
 * 3. Changes the requested delivery date for an order.
 *
 * @param {Order} order - Order to modify
 * @param {ChangeDateDto} dto - Date change details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await changeDeliveryDate(order, {
 *   newDeliveryDate: new Date('2024-02-01'),
 *   reason: 'Customer unavailable on original date',
 *   notifyCustomer: true
 * }, 'user-456');
 * ```
 */
async function changeDeliveryDate(order, dto, userId) {
    const previousDate = order.requestedDeliveryDate;
    const modification = {
        modificationId: generateModificationId(),
        orderId: order.orderId,
        type: OrderModificationType.DATE_CHANGE,
        timestamp: new Date(),
        modifiedBy: userId,
        modifiedByRole: 'user',
        previousValue: previousDate,
        newValue: dto.newDeliveryDate,
        reason: dto.reason,
        approvalStatus: ChangeApprovalStatus.AUTO_APPROVED,
        metadata: { notifyCustomer: dto.notifyCustomer },
    };
    order.requestedDeliveryDate = dto.newDeliveryDate;
    order.modifications.push(modification);
    order.version++;
    order.updatedAt = new Date();
    order.updatedBy = userId;
    return order;
}
/**
 * 4. Changes the customer associated with an order.
 *
 * @param {Order} order - Order to modify
 * @param {ChangeCustomerDto} dto - Customer change details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const transferred = await changeOrderCustomer(order, {
 *   newCustomerId: 'cust-789',
 *   transferReason: 'Order placed by assistant on behalf of customer',
 *   updateBillingAddress: true
 * }, 'user-456');
 * ```
 */
async function changeOrderCustomer(order, dto, userId) {
    const previousCustomerId = order.customerId;
    if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.PENDING) {
        throw new common_1.BadRequestException('Cannot change customer for orders beyond pending status');
    }
    const modification = {
        modificationId: generateModificationId(),
        orderId: order.orderId,
        type: OrderModificationType.CUSTOMER_CHANGE,
        timestamp: new Date(),
        modifiedBy: userId,
        modifiedByRole: 'user',
        previousValue: previousCustomerId,
        newValue: dto.newCustomerId,
        reason: dto.transferReason,
        approvalStatus: ChangeApprovalStatus.PENDING, // Always requires approval
        metadata: {
            updateBillingAddress: dto.updateBillingAddress,
            updateShippingAddress: dto.updateShippingAddress,
        },
    };
    order.customerId = dto.newCustomerId;
    order.modifications.push(modification);
    order.version++;
    order.updatedAt = new Date();
    order.updatedBy = userId;
    return order;
}
/**
 * 5. Adds a new line item to an existing order.
 *
 * @param {Order} order - Order to modify
 * @param {Partial<OrderLineItem>} lineItem - Line item to add
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await addLineItemToOrder(order, {
 *   productId: 'prod-789',
 *   sku: 'SKU-789',
 *   name: 'Additional Product',
 *   quantity: 2,
 *   unitPrice: 49.99
 * }, 'user-456');
 * ```
 */
async function addLineItemToOrder(order, lineItem, userId) {
    const newLineItem = {
        lineItemId: generateLineItemId(),
        productId: lineItem.productId || '',
        sku: lineItem.sku || '',
        name: lineItem.name || '',
        description: lineItem.description,
        quantity: lineItem.quantity || 1,
        unitPrice: lineItem.unitPrice || 0,
        discountAmount: lineItem.discountAmount || 0,
        taxAmount: calculateLineTax(lineItem.quantity || 1, lineItem.unitPrice || 0),
        subtotal: (lineItem.quantity || 1) * (lineItem.unitPrice || 0),
        total: 0, // Will be calculated
        metadata: lineItem.metadata,
        version: 1,
        modifiedAt: new Date(),
        modifiedBy: userId,
    };
    newLineItem.total = newLineItem.subtotal - newLineItem.discountAmount + newLineItem.taxAmount;
    const modification = {
        modificationId: generateModificationId(),
        orderId: order.orderId,
        type: OrderModificationType.LINE_ITEM_ADDITION,
        timestamp: new Date(),
        modifiedBy: userId,
        modifiedByRole: 'user',
        previousValue: null,
        newValue: newLineItem,
        approvalStatus: ChangeApprovalStatus.AUTO_APPROVED,
    };
    order.lineItems.push(newLineItem);
    const updatedOrder = recalculateOrderTotals(order);
    updatedOrder.modifications.push(modification);
    updatedOrder.version++;
    updatedOrder.updatedAt = new Date();
    updatedOrder.updatedBy = userId;
    return updatedOrder;
}
/**
 * 6. Removes a line item from an order.
 *
 * @param {Order} order - Order to modify
 * @param {string} lineItemId - Line item ID to remove
 * @param {string} reason - Removal reason
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await removeLineItemFromOrder(
 *   order,
 *   'line-123',
 *   'Product discontinued',
 *   'user-456'
 * );
 * ```
 */
async function removeLineItemFromOrder(order, lineItemId, reason, userId) {
    const lineItemIndex = order.lineItems.findIndex(item => item.lineItemId === lineItemId);
    if (lineItemIndex === -1) {
        throw new common_1.NotFoundException(`Line item ${lineItemId} not found`);
    }
    const removedItem = order.lineItems[lineItemIndex];
    const modification = {
        modificationId: generateModificationId(),
        orderId: order.orderId,
        type: OrderModificationType.LINE_ITEM_REMOVAL,
        timestamp: new Date(),
        modifiedBy: userId,
        modifiedByRole: 'user',
        previousValue: removedItem,
        newValue: null,
        reason,
        approvalStatus: ChangeApprovalStatus.AUTO_APPROVED,
    };
    order.lineItems.splice(lineItemIndex, 1);
    if (order.lineItems.length === 0) {
        throw new common_1.BadRequestException('Cannot remove all line items from order');
    }
    const updatedOrder = recalculateOrderTotals(order);
    updatedOrder.modifications.push(modification);
    updatedOrder.version++;
    updatedOrder.updatedAt = new Date();
    updatedOrder.updatedBy = userId;
    return updatedOrder;
}
/**
 * 7. Updates order notes or special instructions.
 *
 * @param {Order} order - Order to modify
 * @param {string} notes - New notes
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await updateOrderNotes(
 *   order,
 *   'Please ring doorbell twice and leave at side door',
 *   'user-456'
 * );
 * ```
 */
async function updateOrderNotes(order, notes, userId) {
    const previousNotes = order.notes;
    const modification = {
        modificationId: generateModificationId(),
        orderId: order.orderId,
        type: OrderModificationType.NOTES_UPDATE,
        timestamp: new Date(),
        modifiedBy: userId,
        modifiedByRole: 'user',
        previousValue: previousNotes,
        newValue: notes,
        approvalStatus: ChangeApprovalStatus.AUTO_APPROVED,
    };
    order.notes = notes;
    order.modifications.push(modification);
    order.updatedAt = new Date();
    order.updatedBy = userId;
    return order;
}
// ============================================================================
// SECTION 2: ORDER AMENDMENTS & CHANGE ORDERS (Functions 8-14)
// ============================================================================
/**
 * 8. Creates a formal amendment to an order.
 *
 * @param {Order} order - Order to amend
 * @param {CreateAmendmentDto} dto - Amendment details
 * @param {string} userId - User creating amendment
 * @returns {Promise<OrderAmendment>} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createOrderAmendment(order, {
 *   modifications: [mod1, mod2],
 *   notes: 'Customer requested changes to delivery',
 *   requiresCustomerApproval: true
 * }, 'user-456');
 * ```
 */
async function createOrderAmendment(order, dto, userId) {
    const amendmentNumber = generateAmendmentNumber(order.orderNumber, order.amendments.length + 1);
    // Calculate total impact
    const totalImpact = calculateAmendmentImpact(dto.modifications);
    const amendment = {
        amendmentId: generateAmendmentId(),
        orderId: order.orderId,
        amendmentNumber,
        createdAt: new Date(),
        createdBy: userId,
        modifications: dto.modifications,
        status: dto.requiresCustomerApproval
            ? ChangeApprovalStatus.PENDING
            : ChangeApprovalStatus.AUTO_APPROVED,
        effectiveDate: dto.effectiveDate,
        notes: dto.notes,
        requiresCustomerApproval: dto.requiresCustomerApproval || false,
        totalImpact,
    };
    order.amendments.push(amendment);
    order.version++;
    order.updatedAt = new Date();
    order.updatedBy = userId;
    return amendment;
}
/**
 * 9. Approves a pending order amendment.
 *
 * @param {OrderAmendment} amendment - Amendment to approve
 * @param {ApprovalDecisionDto} dto - Approval details
 * @param {string} approverId - User approving
 * @returns {Promise<OrderAmendment>} Approved amendment
 *
 * @example
 * ```typescript
 * const approved = await approveAmendment(amendment, {
 *   decision: ChangeApprovalStatus.APPROVED,
 *   notes: 'All changes look good'
 * }, 'approver-789');
 * ```
 */
async function approveAmendment(amendment, dto, approverId) {
    if (amendment.status !== ChangeApprovalStatus.PENDING) {
        throw new common_1.BadRequestException('Amendment is not pending approval');
    }
    amendment.status = dto.decision;
    amendment.approvedBy = approverId;
    amendment.approvedAt = new Date();
    // Update all modifications in the amendment
    amendment.modifications.forEach(mod => {
        mod.approvalStatus = dto.decision;
        mod.approvedBy = approverId;
        mod.approvedAt = new Date();
        if (dto.decision === ChangeApprovalStatus.REJECTED) {
            mod.rejectionReason = dto.notes;
        }
    });
    return amendment;
}
/**
 * 10. Rejects a pending order amendment.
 *
 * @param {OrderAmendment} amendment - Amendment to reject
 * @param {string} reason - Rejection reason
 * @param {string} approverId - User rejecting
 * @returns {Promise<OrderAmendment>} Rejected amendment
 *
 * @example
 * ```typescript
 * const rejected = await rejectAmendment(
 *   amendment,
 *   'Price change exceeds allowed threshold',
 *   'approver-789'
 * );
 * ```
 */
async function rejectAmendment(amendment, reason, approverId) {
    if (amendment.status !== ChangeApprovalStatus.PENDING) {
        throw new common_1.BadRequestException('Amendment is not pending approval');
    }
    amendment.status = ChangeApprovalStatus.REJECTED;
    amendment.approvedBy = approverId;
    amendment.approvedAt = new Date();
    amendment.modifications.forEach(mod => {
        mod.approvalStatus = ChangeApprovalStatus.REJECTED;
        mod.approvedBy = approverId;
        mod.approvedAt = new Date();
        mod.rejectionReason = reason;
    });
    return amendment;
}
/**
 * 11. Gets customer approval for an amendment.
 *
 * @param {OrderAmendment} amendment - Amendment requiring approval
 * @param {boolean} approved - Customer approval decision
 * @returns {Promise<OrderAmendment>} Updated amendment
 *
 * @example
 * ```typescript
 * const updated = await getCustomerApproval(amendment, true);
 * ```
 */
async function getCustomerApproval(amendment, approved) {
    if (!amendment.requiresCustomerApproval) {
        throw new common_1.BadRequestException('Amendment does not require customer approval');
    }
    if (approved) {
        amendment.customerApprovedAt = new Date();
        amendment.status = ChangeApprovalStatus.APPROVED;
    }
    else {
        amendment.status = ChangeApprovalStatus.REJECTED;
    }
    return amendment;
}
/**
 * 12. Applies an approved amendment to the order.
 *
 * @param {Order} order - Order to apply amendment to
 * @param {OrderAmendment} amendment - Approved amendment
 * @param {string} userId - User applying amendment
 * @returns {Promise<Order>} Updated order
 *
 * @example
 * ```typescript
 * const updated = await applyAmendmentToOrder(order, amendment, 'user-456');
 * ```
 */
async function applyAmendmentToOrder(order, amendment, userId) {
    if (amendment.status !== ChangeApprovalStatus.APPROVED) {
        throw new common_1.BadRequestException('Amendment must be approved before applying');
    }
    if (amendment.orderId !== order.orderId) {
        throw new common_1.BadRequestException('Amendment does not belong to this order');
    }
    // Apply each modification from the amendment
    for (const modification of amendment.modifications) {
        switch (modification.type) {
            case OrderModificationType.QUANTITY_CHANGE:
                const lineItem = order.lineItems.find(item => item.lineItemId === modification.metadata?.lineItemId);
                if (lineItem) {
                    lineItem.quantity = modification.newValue;
                }
                break;
            case OrderModificationType.PRICE_ADJUSTMENT:
                const priceItem = order.lineItems.find(item => item.lineItemId === modification.metadata?.lineItemId);
                if (priceItem) {
                    priceItem.unitPrice = modification.newValue;
                }
                break;
            // Handle other modification types...
        }
    }
    const updatedOrder = recalculateOrderTotals(order);
    updatedOrder.version++;
    updatedOrder.updatedAt = new Date();
    updatedOrder.updatedBy = userId;
    return updatedOrder;
}
/**
 * 13. Calculates the financial impact of proposed changes.
 *
 * @param {OrderModification[]} modifications - Proposed modifications
 * @returns {object} Impact summary
 *
 * @example
 * ```typescript
 * const impact = calculateChangeImpact([mod1, mod2, mod3]);
 * console.log(`Price delta: $${impact.priceDelta}`);
 * ```
 */
function calculateChangeImpact(modifications) {
    let priceDelta = 0;
    let quantityDelta = 0;
    let taxDelta = 0;
    const affectedLineItems = new Set();
    for (const mod of modifications) {
        if (mod.metadata?.lineItemId) {
            affectedLineItems.add(mod.metadata.lineItemId);
        }
        switch (mod.type) {
            case OrderModificationType.PRICE_ADJUSTMENT:
                priceDelta += (mod.newValue - mod.previousValue);
                break;
            case OrderModificationType.QUANTITY_CHANGE:
                quantityDelta += (mod.newValue - mod.previousValue);
                break;
            case OrderModificationType.TAX_ADJUSTMENT:
                taxDelta += (mod.newValue - mod.previousValue);
                break;
        }
    }
    return {
        priceDelta,
        quantityDelta,
        taxDelta,
        affectedLineItems: Array.from(affectedLineItems),
    };
}
/**
 * 14. Generates change notification for customer.
 *
 * @param {Order} order - Modified order
 * @param {OrderAmendment} amendment - Amendment details
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = generateChangeNotification(order, amendment);
 * await emailService.send(notification);
 * ```
 */
function generateChangeNotification(order, amendment) {
    const impact = amendment.totalImpact;
    const priceChange = impact.priceDelta >= 0 ? `+$${impact.priceDelta.toFixed(2)}` : `-$${Math.abs(impact.priceDelta).toFixed(2)}`;
    return {
        to: order.customerId, // Would be customer email
        subject: `Order ${order.orderNumber} - Changes Requiring Your Approval`,
        body: `
Dear Customer,

Your order ${order.orderNumber} has been modified and requires your approval.

Amendment: ${amendment.amendmentNumber}
Changes: ${amendment.modifications.length} modification(s)
Price Impact: ${priceChange}
Quantity Impact: ${impact.quantityDelta}

Notes: ${amendment.notes || 'None'}

Please review and approve these changes at your earliest convenience.

Thank you,
Order Management Team
    `.trim(),
        priority: 'high',
    };
}
// ============================================================================
// SECTION 3: ORDER CANCELLATIONS (Functions 15-21)
// ============================================================================
/**
 * 15. Cancels an entire order.
 *
 * @param {Order} order - Order to cancel
 * @param {CancelOrderDto} dto - Cancellation details
 * @param {string} userId - User cancelling
 * @returns {Promise<OrderCancellation>} Cancellation record
 *
 * @example
 * ```typescript
 * const cancellation = await cancelOrder(order, {
 *   reason: CancellationReason.CUSTOMER_REQUEST,
 *   description: 'Customer no longer needs items',
 *   processRefund: true,
 *   notifyCustomer: true
 * }, 'user-456');
 * ```
 */
async function cancelOrder(order, dto, userId) {
    // Validate cancellation is allowed
    if (order.status === OrderStatus.CANCELLED) {
        throw new common_1.BadRequestException('Order is already cancelled');
    }
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.COMPLETED) {
        throw new common_1.BadRequestException('Cannot cancel completed or delivered orders');
    }
    const refundAmount = dto.processRefund ? order.total : 0;
    const restockingFee = dto.restockingFeePercent
        ? order.total * dto.restockingFeePercent
        : 0;
    const cancellation = {
        cancellationId: generateCancellationId(),
        orderId: order.orderId,
        reason: dto.reason,
        description: dto.description,
        cancelledAt: new Date(),
        cancelledBy: userId,
        refundAmount: refundAmount - restockingFee,
        refundProcessed: false,
        restockingFee,
        partialCancellation: false,
        customerNotified: dto.notifyCustomer || false,
    };
    // Update order status
    const stateTransition = {
        transitionId: generateTransitionId(),
        orderId: order.orderId,
        fromStatus: order.status,
        toStatus: OrderStatus.CANCELLED,
        timestamp: new Date(),
        triggeredBy: userId,
        triggeredBySystem: false,
        reason: dto.description,
        validationsPassed: true,
        rollbackAvailable: false,
    };
    order.status = OrderStatus.CANCELLED;
    order.stateHistory.push(stateTransition);
    order.metadata = {
        ...order.metadata,
        cancellation,
    };
    order.updatedAt = new Date();
    order.updatedBy = userId;
    return cancellation;
}
/**
 * 16. Partially cancels specific line items.
 *
 * @param {Order} order - Order to partially cancel
 * @param {CancelOrderDto} dto - Cancellation details with line items
 * @param {string} userId - User cancelling
 * @returns {Promise<OrderCancellation>} Cancellation record
 *
 * @example
 * ```typescript
 * const cancellation = await partialCancelOrder(order, {
 *   reason: CancellationReason.OUT_OF_STOCK,
 *   description: 'Items no longer available',
 *   lineItemIds: ['line-123', 'line-456'],
 *   processRefund: true
 * }, 'user-456');
 * ```
 */
async function partialCancelOrder(order, dto, userId) {
    if (!dto.lineItemIds || dto.lineItemIds.length === 0) {
        throw new common_1.BadRequestException('Line item IDs required for partial cancellation');
    }
    // Calculate refund amount for cancelled items
    const cancelledItems = order.lineItems.filter(item => dto.lineItemIds.includes(item.lineItemId));
    if (cancelledItems.length === 0) {
        throw new common_1.NotFoundException('No valid line items found for cancellation');
    }
    const refundAmount = cancelledItems.reduce((sum, item) => sum + item.total, 0);
    const restockingFee = dto.restockingFeePercent
        ? refundAmount * dto.restockingFeePercent
        : 0;
    const cancellation = {
        cancellationId: generateCancellationId(),
        orderId: order.orderId,
        reason: dto.reason,
        description: dto.description,
        cancelledAt: new Date(),
        cancelledBy: userId,
        refundAmount: refundAmount - restockingFee,
        refundProcessed: false,
        restockingFee,
        partialCancellation: true,
        cancelledLineItems: dto.lineItemIds,
        customerNotified: dto.notifyCustomer || false,
    };
    // Remove cancelled line items
    order.lineItems = order.lineItems.filter(item => !dto.lineItemIds.includes(item.lineItemId));
    // Recalculate order totals
    const updatedOrder = recalculateOrderTotals(order);
    updatedOrder.metadata = {
        ...updatedOrder.metadata,
        partialCancellations: [
            ...(updatedOrder.metadata?.partialCancellations || []),
            cancellation,
        ],
    };
    updatedOrder.updatedAt = new Date();
    updatedOrder.updatedBy = userId;
    return cancellation;
}
/**
 * 17. Processes refund for cancelled order.
 *
 * @param {OrderCancellation} cancellation - Cancellation to process refund for
 * @param {string} refundMethod - Payment method for refund
 * @returns {Promise<object>} Refund details
 *
 * @example
 * ```typescript
 * const refund = await processRefund(cancellation, 'original_payment_method');
 * ```
 */
async function processRefund(cancellation, refundMethod) {
    if (cancellation.refundProcessed) {
        throw new common_1.BadRequestException('Refund already processed');
    }
    const refund = {
        refundId: generateRefundId(),
        amount: cancellation.refundAmount || 0,
        method: refundMethod,
        processedAt: new Date(),
        status: 'processed',
    };
    cancellation.refundProcessed = true;
    return refund;
}
/**
 * 18. Calculates cancellation restocking fee.
 *
 * @param {number} orderTotal - Original order total
 * @param {number} feePercentage - Fee percentage (0-1)
 * @param {OrderStatus} currentStatus - Current order status
 * @returns {object} Fee breakdown
 *
 * @example
 * ```typescript
 * const fee = calculateRestockingFee(500.00, 0.15, OrderStatus.PROCESSING);
 * // Returns: { originalAmount: 500, fee: 75, refundAmount: 425 }
 * ```
 */
function calculateRestockingFee(orderTotal, feePercentage, currentStatus) {
    // Waive fee for early-stage cancellations
    if (currentStatus === OrderStatus.DRAFT || currentStatus === OrderStatus.PENDING) {
        return {
            originalAmount: orderTotal,
            fee: 0,
            refundAmount: orderTotal,
            feeWaived: true,
            waiverReason: 'Order not yet processed',
        };
    }
    const fee = orderTotal * feePercentage;
    return {
        originalAmount: orderTotal,
        fee,
        refundAmount: orderTotal - fee,
        feeWaived: false,
    };
}
/**
 * 19. Validates if an order can be cancelled.
 *
 * @param {Order} order - Order to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCancellationEligibility(order);
 * if (!result.canCancel) {
 *   console.error(result.reason);
 * }
 * ```
 */
function validateCancellationEligibility(order) {
    if (order.status === OrderStatus.CANCELLED) {
        return {
            canCancel: false,
            reason: 'Order is already cancelled',
            requiresApproval: false,
            estimatedRefund: 0,
        };
    }
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.COMPLETED) {
        return {
            canCancel: false,
            reason: 'Cannot cancel completed or delivered orders',
            requiresApproval: false,
            estimatedRefund: 0,
        };
    }
    if (order.status === OrderStatus.SHIPPED) {
        return {
            canCancel: true,
            reason: 'Order in transit - requires supervisor approval',
            requiresApproval: true,
            estimatedRefund: order.total,
        };
    }
    return {
        canCancel: true,
        requiresApproval: false,
        estimatedRefund: order.total,
    };
}
/**
 * 20. Sends cancellation notification to customer.
 *
 * @param {Order} order - Cancelled order
 * @param {OrderCancellation} cancellation - Cancellation details
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = sendCancellationNotification(order, cancellation);
 * ```
 */
function sendCancellationNotification(order, cancellation) {
    return {
        to: order.customerId,
        subject: `Order ${order.orderNumber} - Cancellation Confirmation`,
        body: `
Dear Customer,

Your order ${order.orderNumber} has been ${cancellation.partialCancellation ? 'partially ' : ''}cancelled.

Reason: ${cancellation.reason}
Cancelled on: ${cancellation.cancelledAt.toLocaleDateString()}

${cancellation.refundAmount ? `Refund Amount: $${cancellation.refundAmount.toFixed(2)}` : ''}
${cancellation.restockingFee ? `Restocking Fee: $${cancellation.restockingFee.toFixed(2)}` : ''}

${cancellation.partialCancellation
            ? `Items Cancelled: ${cancellation.cancelledLineItems?.length} item(s)\nRemaining items will be processed normally.`
            : 'All items have been cancelled.'}

If you have any questions, please contact our customer service team.

Thank you,
Order Management Team
    `.trim(),
        includeRefundInfo: (cancellation.refundAmount || 0) > 0,
    };
}
/**
 * 21. Restocks inventory for cancelled items.
 *
 * @param {Order} order - Cancelled order
 * @param {string[]} lineItemIds - Line items to restock
 * @returns {Promise<object>} Restock summary
 *
 * @example
 * ```typescript
 * const restocked = await restockCancelledItems(order, ['line-123', 'line-456']);
 * ```
 */
async function restockCancelledItems(order, lineItemIds) {
    const itemsToRestock = lineItemIds
        ? order.lineItems.filter(item => lineItemIds.includes(item.lineItemId))
        : order.lineItems;
    const restockedItems = itemsToRestock.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
    }));
    const totalItemsRestocked = restockedItems.reduce((sum, item) => sum + item.quantity, 0);
    return {
        restockedItems,
        totalItemsRestocked,
        restockedAt: new Date(),
    };
}
// ============================================================================
// SECTION 4: ORDER HOLDS & RELEASES (Functions 22-28)
// ============================================================================
/**
 * 22. Places an order on hold.
 *
 * @param {Order} order - Order to hold
 * @param {PlaceHoldDto} dto - Hold details
 * @param {string} userId - User placing hold
 * @returns {Promise<OrderHold>} Hold record
 *
 * @example
 * ```typescript
 * const hold = await placeOrderOnHold(order, {
 *   reason: HoldReason.PAYMENT_VERIFICATION,
 *   description: 'Verifying payment method',
 *   autoReleaseDuration: 120
 * }, 'user-456');
 * ```
 */
async function placeOrderOnHold(order, dto, userId) {
    if (order.currentHold) {
        throw new common_1.ConflictException('Order is already on hold');
    }
    const expiresAt = dto.autoReleaseDuration
        ? new Date(Date.now() + dto.autoReleaseDuration * 60000)
        : undefined;
    const hold = {
        holdId: generateHoldId(),
        orderId: order.orderId,
        reason: dto.reason,
        description: dto.description,
        placedAt: new Date(),
        placedBy: userId,
        expiresAt,
        autoRelease: !!dto.autoReleaseDuration,
        notificationsSent: dto.notifyUsers || [],
    };
    const stateTransition = {
        transitionId: generateTransitionId(),
        orderId: order.orderId,
        fromStatus: order.status,
        toStatus: OrderStatus.ON_HOLD,
        timestamp: new Date(),
        triggeredBy: userId,
        triggeredBySystem: false,
        reason: dto.description,
        validationsPassed: true,
        rollbackAvailable: true,
    };
    order.status = OrderStatus.ON_HOLD;
    order.currentHold = hold;
    order.stateHistory.push(stateTransition);
    order.updatedAt = new Date();
    order.updatedBy = userId;
    return hold;
}
/**
 * 23. Releases an order from hold.
 *
 * @param {Order} order - Order to release
 * @param {ReleaseHoldDto} dto - Release details
 * @param {string} userId - User releasing hold
 * @returns {Promise<Order>} Updated order
 *
 * @example
 * ```typescript
 * const released = await releaseOrderHold(order, {
 *   releaseNotes: 'Payment verified successfully',
 *   resumeProcessing: true
 * }, 'user-456');
 * ```
 */
async function releaseOrderHold(order, dto, userId) {
    if (!order.currentHold) {
        throw new common_1.BadRequestException('Order is not on hold');
    }
    order.currentHold.releasedAt = new Date();
    order.currentHold.releasedBy = userId;
    order.currentHold.releaseNotes = dto.releaseNotes;
    // Determine next status
    const previousStatus = order.stateHistory
        .filter(t => t.toStatus !== OrderStatus.ON_HOLD)
        .pop()?.fromStatus || OrderStatus.PENDING;
    const stateTransition = {
        transitionId: generateTransitionId(),
        orderId: order.orderId,
        fromStatus: OrderStatus.ON_HOLD,
        toStatus: dto.resumeProcessing ? OrderStatus.PROCESSING : previousStatus,
        timestamp: new Date(),
        triggeredBy: userId,
        triggeredBySystem: false,
        reason: dto.releaseNotes,
        validationsPassed: true,
        rollbackAvailable: false,
    };
    order.status = stateTransition.toStatus;
    order.stateHistory.push(stateTransition);
    // Archive the hold
    if (!order.metadata)
        order.metadata = {};
    if (!order.metadata.holdHistory)
        order.metadata.holdHistory = [];
    order.metadata.holdHistory.push(order.currentHold);
    order.currentHold = undefined;
    order.updatedAt = new Date();
    order.updatedBy = userId;
    return order;
}
/**
 * 24. Auto-releases expired holds.
 *
 * @param {Order[]} orders - Orders to check for expired holds
 * @returns {Promise<Order[]>} Auto-released orders
 *
 * @example
 * ```typescript
 * const released = await autoReleaseExpiredHolds(ordersOnHold);
 * ```
 */
async function autoReleaseExpiredHolds(orders) {
    const now = new Date();
    const autoReleased = [];
    for (const order of orders) {
        if (order.currentHold &&
            order.currentHold.autoRelease &&
            order.currentHold.expiresAt &&
            order.currentHold.expiresAt <= now) {
            await releaseOrderHold(order, {
                releaseNotes: 'Auto-released due to expiration',
                resumeProcessing: true,
            }, 'system');
            autoReleased.push(order);
        }
    }
    return autoReleased;
}
/**
 * 25. Extends hold duration.
 *
 * @param {OrderHold} hold - Hold to extend
 * @param {number} additionalMinutes - Minutes to add
 * @param {string} reason - Extension reason
 * @returns {Promise<OrderHold>} Updated hold
 *
 * @example
 * ```typescript
 * const extended = await extendHoldDuration(hold, 60, 'Awaiting additional documentation');
 * ```
 */
async function extendHoldDuration(hold, additionalMinutes, reason) {
    if (hold.releasedAt) {
        throw new common_1.BadRequestException('Hold has already been released');
    }
    if (!hold.expiresAt) {
        hold.expiresAt = new Date(Date.now() + additionalMinutes * 60000);
    }
    else {
        hold.expiresAt = new Date(hold.expiresAt.getTime() + additionalMinutes * 60000);
    }
    if (!hold.metadata)
        hold.metadata = {};
    if (!hold.metadata.extensions)
        hold.metadata.extensions = [];
    hold.metadata.extensions.push({
        extendedBy: additionalMinutes,
        reason,
        timestamp: new Date(),
    });
    return hold;
}
/**
 * 26. Gets all orders currently on hold.
 *
 * @param {Order[]} orders - All orders
 * @param {HoldReason} filterByReason - Optional reason filter
 * @returns {Order[]} Orders on hold
 *
 * @example
 * ```typescript
 * const onHold = getOrdersOnHold(allOrders, HoldReason.PAYMENT_VERIFICATION);
 * ```
 */
function getOrdersOnHold(orders, filterByReason) {
    return orders.filter(order => {
        if (!order.currentHold)
            return false;
        if (filterByReason && order.currentHold.reason !== filterByReason)
            return false;
        return true;
    });
}
/**
 * 27. Sends hold notification to stakeholders.
 *
 * @param {Order} order - Order on hold
 * @param {OrderHold} hold - Hold details
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = sendHoldNotification(order, hold);
 * ```
 */
function sendHoldNotification(order, hold) {
    return {
        recipients: [order.customerId, ...hold.notificationsSent],
        subject: `Order ${order.orderNumber} - Currently On Hold`,
        body: `
Order ${order.orderNumber} has been placed on hold.

Reason: ${hold.reason}
Description: ${hold.description}
Hold placed: ${hold.placedAt.toLocaleString()}
${hold.expiresAt ? `Auto-release scheduled: ${hold.expiresAt.toLocaleString()}` : 'No auto-release scheduled'}

We will notify you once the hold is resolved and your order resumes processing.

If you have any questions, please contact our customer service team.

Thank you for your patience.
    `.trim(),
        priority: 'medium',
    };
}
/**
 * 28. Validates if order can be placed on hold.
 *
 * @param {Order} order - Order to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateHoldEligibility(order);
 * ```
 */
function validateHoldEligibility(order) {
    if (order.currentHold) {
        return {
            canHold: false,
            reason: 'Order is already on hold',
        };
    }
    if (order.status === OrderStatus.CANCELLED) {
        return {
            canHold: false,
            reason: 'Cannot hold cancelled orders',
        };
    }
    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.DELIVERED) {
        return {
            canHold: false,
            reason: 'Cannot hold completed or delivered orders',
        };
    }
    return { canHold: true };
}
// ============================================================================
// SECTION 5: ORDER LIFECYCLE & STATE MACHINE (Functions 29-35)
// ============================================================================
/**
 * 29. Transitions order to a new status.
 *
 * @param {Order} order - Order to transition
 * @param {TransitionStateDto} dto - Transition details
 * @param {string} userId - User triggering transition
 * @returns {Promise<Order>} Updated order
 *
 * @example
 * ```typescript
 * const transitioned = await transitionOrderStatus(order, {
 *   targetStatus: OrderStatus.PROCESSING,
 *   reason: 'Payment confirmed'
 * }, 'user-456');
 * ```
 */
async function transitionOrderStatus(order, dto, userId) {
    const fromStatus = order.status;
    const toStatus = dto.targetStatus;
    // Validate transition
    if (!dto.skipValidations) {
        const validation = validateStateTransition(fromStatus, toStatus);
        if (!validation.valid) {
            throw new common_1.BadRequestException(`Invalid state transition: ${validation.reason}`);
        }
    }
    const transition = {
        transitionId: generateTransitionId(),
        orderId: order.orderId,
        fromStatus,
        toStatus,
        timestamp: new Date(),
        triggeredBy: userId,
        triggeredBySystem: false,
        reason: dto.reason,
        validationsPassed: true,
        rollbackAvailable: canRollbackTransition(fromStatus, toStatus),
    };
    order.status = toStatus;
    order.stateHistory.push(transition);
    order.updatedAt = new Date();
    order.updatedBy = userId;
    return order;
}
/**
 * 30. Validates if a state transition is allowed.
 *
 * @param {OrderStatus} fromStatus - Current status
 * @param {OrderStatus} toStatus - Target status
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateStateTransition(
 *   OrderStatus.PENDING,
 *   OrderStatus.PROCESSING
 * );
 * ```
 */
function validateStateTransition(fromStatus, toStatus) {
    // Define allowed transitions
    const allowedTransitions = {
        [OrderStatus.DRAFT]: [OrderStatus.PENDING, OrderStatus.CANCELLED],
        [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.ON_HOLD, OrderStatus.CANCELLED],
        [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.ON_HOLD, OrderStatus.CANCELLED],
        [OrderStatus.PROCESSING]: [
            OrderStatus.PARTIALLY_SHIPPED,
            OrderStatus.SHIPPED,
            OrderStatus.ON_HOLD,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.ON_HOLD]: [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PROCESSING,
            OrderStatus.CANCELLED,
        ],
        [OrderStatus.PARTIALLY_SHIPPED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
        [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.REFUNDED],
        [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.REFUNDED],
        [OrderStatus.COMPLETED]: [OrderStatus.REFUNDED, OrderStatus.ARCHIVED],
        [OrderStatus.CANCELLED]: [OrderStatus.ARCHIVED],
        [OrderStatus.REFUNDED]: [OrderStatus.ARCHIVED],
        [OrderStatus.ARCHIVED]: [],
    };
    if (!allowedTransitions[fromStatus]) {
        return {
            valid: false,
            reason: `Unknown source status: ${fromStatus}`,
        };
    }
    if (!allowedTransitions[fromStatus].includes(toStatus)) {
        return {
            valid: false,
            reason: `Cannot transition from ${fromStatus} to ${toStatus}`,
        };
    }
    return { valid: true };
}
/**
 * 31. Gets order lifecycle timeline.
 *
 * @param {Order} order - Order to get timeline for
 * @returns {object[]} Timeline events
 *
 * @example
 * ```typescript
 * const timeline = getOrderLifecycleTimeline(order);
 * ```
 */
function getOrderLifecycleTimeline(order) {
    const timeline = [];
    // Order creation
    timeline.push({
        timestamp: order.createdAt,
        event: 'ORDER_CREATED',
        status: OrderStatus.DRAFT,
        actor: order.createdBy,
        description: 'Order created',
    });
    // State transitions
    for (const transition of order.stateHistory) {
        timeline.push({
            timestamp: transition.timestamp,
            event: 'STATUS_CHANGE',
            status: transition.toStatus,
            actor: transition.triggeredBy,
            description: `Status changed from ${transition.fromStatus} to ${transition.toStatus}`,
        });
    }
    // Modifications
    for (const modification of order.modifications) {
        timeline.push({
            timestamp: modification.timestamp,
            event: 'MODIFICATION',
            actor: modification.modifiedBy,
            description: `${modification.type}: ${modification.reason || 'No reason provided'}`,
        });
    }
    // Sort by timestamp
    timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return timeline;
}
/**
 * 32. Checks if order can be rolled back to previous state.
 *
 * @param {Order} order - Order to check
 * @returns {object} Rollback information
 *
 * @example
 * ```typescript
 * const rollback = canRollbackOrder(order);
 * if (rollback.canRollback) {
 *   console.log(`Can rollback to: ${rollback.targetStatus}`);
 * }
 * ```
 */
function canRollbackOrder(order) {
    if (order.stateHistory.length < 2) {
        return {
            canRollback: false,
            reason: 'No previous state to rollback to',
        };
    }
    const lastTransition = order.stateHistory[order.stateHistory.length - 1];
    if (!lastTransition.rollbackAvailable) {
        return {
            canRollback: false,
            lastTransition,
            reason: 'Last transition does not support rollback',
        };
    }
    return {
        canRollback: true,
        targetStatus: lastTransition.fromStatus,
        lastTransition,
    };
}
/**
 * 33. Performs rollback to previous order state.
 *
 * @param {Order} order - Order to rollback
 * @param {string} reason - Rollback reason
 * @param {string} userId - User performing rollback
 * @returns {Promise<Order>} Rolled back order
 *
 * @example
 * ```typescript
 * const rolledBack = await rollbackOrderState(
 *   order,
 *   'Incorrect status change',
 *   'user-456'
 * );
 * ```
 */
async function rollbackOrderState(order, reason, userId) {
    const rollbackInfo = canRollbackOrder(order);
    if (!rollbackInfo.canRollback) {
        throw new common_1.BadRequestException(`Cannot rollback: ${rollbackInfo.reason}`);
    }
    const transition = {
        transitionId: generateTransitionId(),
        orderId: order.orderId,
        fromStatus: order.status,
        toStatus: rollbackInfo.targetStatus,
        timestamp: new Date(),
        triggeredBy: userId,
        triggeredBySystem: false,
        reason: `Rollback: ${reason}`,
        validationsPassed: true,
        rollbackAvailable: false,
    };
    order.status = rollbackInfo.targetStatus;
    order.stateHistory.push(transition);
    order.updatedAt = new Date();
    order.updatedBy = userId;
    return order;
}
/**
 * 34. Gets current lifecycle stage details.
 *
 * @param {Order} order - Order to analyze
 * @returns {object} Lifecycle stage information
 *
 * @example
 * ```typescript
 * const stage = getCurrentLifecycleStage(order);
 * console.log(`Current stage: ${stage.stageName}`);
 * ```
 */
function getCurrentLifecycleStage(order) {
    const stageMap = {
        [OrderStatus.DRAFT]: { name: 'Draft', stage: 1 },
        [OrderStatus.PENDING]: { name: 'Pending Confirmation', stage: 2 },
        [OrderStatus.CONFIRMED]: { name: 'Confirmed', stage: 3 },
        [OrderStatus.PROCESSING]: { name: 'Processing', stage: 4 },
        [OrderStatus.ON_HOLD]: { name: 'On Hold', stage: 4 },
        [OrderStatus.PARTIALLY_SHIPPED]: { name: 'Partially Shipped', stage: 5 },
        [OrderStatus.SHIPPED]: { name: 'Shipped', stage: 6 },
        [OrderStatus.DELIVERED]: { name: 'Delivered', stage: 7 },
        [OrderStatus.COMPLETED]: { name: 'Completed', stage: 8 },
        [OrderStatus.CANCELLED]: { name: 'Cancelled', stage: 0 },
        [OrderStatus.REFUNDED]: { name: 'Refunded', stage: 0 },
        [OrderStatus.ARCHIVED]: { name: 'Archived', stage: 0 },
    };
    const currentStage = stageMap[order.status];
    const totalStages = 8;
    const progressPercentage = (currentStage.stage / totalStages) * 100;
    return {
        stageName: currentStage.name,
        stageNumber: currentStage.stage,
        totalStages,
        progressPercentage,
    };
}
/**
 * 35. Generates state machine diagram for order.
 *
 * @param {Order} order - Order to generate diagram for
 * @returns {string} Mermaid diagram syntax
 *
 * @example
 * ```typescript
 * const diagram = generateStateMachineDiagram(order);
 * console.log(diagram);
 * ```
 */
function generateStateMachineDiagram(order) {
    let diagram = 'stateDiagram-v2\n';
    diagram += '    [*] --> DRAFT\n';
    const transitions = order.stateHistory;
    const visited = new Set();
    for (const transition of transitions) {
        const edge = `${transition.fromStatus} --> ${transition.toStatus}`;
        if (!visited.has(edge)) {
            diagram += `    ${edge}\n`;
            visited.add(edge);
        }
    }
    if (order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED) {
        diagram += `    ${order.status} --> [*]\n`;
    }
    return diagram;
}
// ============================================================================
// SECTION 6: ORDER HISTORY & ARCHIVAL (Functions 36-42)
// ============================================================================
/**
 * 36. Creates audit entry for order action.
 *
 * @param {Order} order - Order being audited
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {any} changes - Changes made
 * @returns {Promise<OrderAuditEntry>} Audit entry
 *
 * @example
 * ```typescript
 * const audit = await createOrderAuditEntry(
 *   order,
 *   'UPDATE_QUANTITY',
 *   'user-456',
 *   { field: 'quantity', oldValue: 1, newValue: 2 }
 * );
 * ```
 */
async function createOrderAuditEntry(order, action, userId, changes) {
    const auditEntry = {
        auditId: generateAuditId(),
        orderId: order.orderId,
        timestamp: new Date(),
        userId,
        userName: 'User Name', // Would come from user service
        userRole: 'role', // Would come from context
        action,
        entityType: 'ORDER',
        entityId: order.orderId,
        changes,
        metadata: {
            orderNumber: order.orderNumber,
            orderStatus: order.status,
        },
    };
    return auditEntry;
}
/**
 * 37. Gets complete audit trail for an order.
 *
 * @param {Order} order - Order to get audit trail for
 * @param {Date} fromDate - Optional start date
 * @param {Date} toDate - Optional end date
 * @returns {Promise<OrderAuditEntry[]>} Audit entries
 *
 * @example
 * ```typescript
 * const trail = await getOrderAuditTrail(order, startDate, endDate);
 * ```
 */
async function getOrderAuditTrail(order, fromDate, toDate) {
    // This would typically query a database
    // For now, we'll construct from order history
    const auditEntries = [];
    // Add state transitions
    for (const transition of order.stateHistory) {
        if (fromDate && transition.timestamp < fromDate)
            continue;
        if (toDate && transition.timestamp > toDate)
            continue;
        auditEntries.push({
            auditId: generateAuditId(),
            orderId: order.orderId,
            timestamp: transition.timestamp,
            userId: transition.triggeredBy,
            userName: transition.triggeredBy,
            userRole: 'unknown',
            action: 'STATE_TRANSITION',
            entityType: 'ORDER',
            entityId: order.orderId,
            changes: [
                {
                    field: 'status',
                    oldValue: transition.fromStatus,
                    newValue: transition.toStatus,
                },
            ],
        });
    }
    // Add modifications
    for (const modification of order.modifications) {
        if (fromDate && modification.timestamp < fromDate)
            continue;
        if (toDate && modification.timestamp > toDate)
            continue;
        auditEntries.push({
            auditId: generateAuditId(),
            orderId: order.orderId,
            timestamp: modification.timestamp,
            userId: modification.modifiedBy,
            userName: modification.modifiedBy,
            userRole: modification.modifiedByRole,
            action: modification.type,
            entityType: 'ORDER',
            entityId: order.orderId,
            changes: [
                {
                    field: modification.type,
                    oldValue: modification.previousValue,
                    newValue: modification.newValue,
                },
            ],
        });
    }
    return auditEntries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}
/**
 * 38. Creates version snapshot of order.
 *
 * @param {Order} order - Order to snapshot
 * @param {string} changesSummary - Summary of changes
 * @param {string} userId - User creating version
 * @returns {Promise<OrderVersion>} Version record
 *
 * @example
 * ```typescript
 * const version = await createOrderVersion(
 *   order,
 *   'Updated quantities and delivery date',
 *   'user-456'
 * );
 * ```
 */
async function createOrderVersion(order, changesSummary, userId) {
    const version = {
        versionId: generateVersionId(),
        orderId: order.orderId,
        versionNumber: order.version,
        createdAt: new Date(),
        createdBy: userId,
        snapshot: JSON.parse(JSON.stringify(order)), // Deep clone
        changesSummary,
        restorable: true,
    };
    return version;
}
/**
 * 39. Restores order from a specific version.
 *
 * @param {OrderVersion} version - Version to restore from
 * @param {string} userId - User performing restoration
 * @returns {Promise<Order>} Restored order
 *
 * @example
 * ```typescript
 * const restored = await restoreOrderVersion(version, 'user-456');
 * ```
 */
async function restoreOrderVersion(version, userId) {
    if (!version.restorable) {
        throw new common_1.BadRequestException('This version cannot be restored');
    }
    const restoredOrder = JSON.parse(JSON.stringify(version.snapshot));
    // Update metadata
    restoredOrder.updatedAt = new Date();
    restoredOrder.updatedBy = userId;
    restoredOrder.metadata = {
        ...restoredOrder.metadata,
        restoredFrom: {
            versionId: version.versionId,
            versionNumber: version.versionNumber,
            restoredAt: new Date(),
            restoredBy: userId,
        },
    };
    return restoredOrder;
}
/**
 * 40. Clones an existing order.
 *
 * @param {Order} order - Order to clone
 * @param {CloneOrderDto} dto - Clone options
 * @param {string} userId - User cloning order
 * @returns {Promise<Order>} Cloned order
 *
 * @example
 * ```typescript
 * const clone = await cloneOrder(originalOrder, {
 *   resetToDraft: true,
 *   includeModifications: false
 * }, 'user-456');
 * ```
 */
async function cloneOrder(order, dto, userId) {
    const clonedOrder = JSON.parse(JSON.stringify(order));
    // Generate new IDs
    clonedOrder.orderId = generateOrderId();
    clonedOrder.orderNumber = generateOrderNumber();
    clonedOrder.createdAt = new Date();
    clonedOrder.updatedAt = new Date();
    clonedOrder.createdBy = userId;
    clonedOrder.updatedBy = userId;
    // Update customer if specified
    if (dto.newCustomerId) {
        clonedOrder.customerId = dto.newCustomerId;
    }
    // Reset status if requested
    if (dto.resetToDraft) {
        clonedOrder.status = OrderStatus.DRAFT;
        clonedOrder.stateHistory = [];
    }
    // Clear modifications if not included
    if (!dto.includeModifications) {
        clonedOrder.modifications = [];
        clonedOrder.amendments = [];
    }
    // Reset version
    clonedOrder.version = 1;
    // Clear current hold
    clonedOrder.currentHold = undefined;
    // Add clone metadata
    clonedOrder.metadata = {
        ...clonedOrder.metadata,
        clonedFrom: {
            orderId: order.orderId,
            orderNumber: order.orderNumber,
            clonedAt: new Date(),
            clonedBy: userId,
        },
        tags: dto.tags,
    };
    return clonedOrder;
}
/**
 * 41. Archives an order.
 *
 * @param {Order} order - Order to archive
 * @param {ArchiveOrderDto} dto - Archive options
 * @param {string} userId - User archiving
 * @returns {Promise<Order>} Archived order
 *
 * @example
 * ```typescript
 * const archived = await archiveOrder(order, {
 *   reason: 'Order completed over 90 days ago',
 *   createBackup: true,
 *   retentionDays: 2555
 * }, 'user-456');
 * ```
 */
async function archiveOrder(order, dto, userId) {
    if (order.status === OrderStatus.ARCHIVED) {
        throw new common_1.BadRequestException('Order is already archived');
    }
    // Only archive completed, cancelled, or refunded orders
    const archivableStatuses = [
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
        OrderStatus.REFUNDED,
    ];
    if (!archivableStatuses.includes(order.status)) {
        throw new common_1.BadRequestException('Only completed, cancelled, or refunded orders can be archived');
    }
    const previousStatus = order.status;
    const transition = {
        transitionId: generateTransitionId(),
        orderId: order.orderId,
        fromStatus: previousStatus,
        toStatus: OrderStatus.ARCHIVED,
        timestamp: new Date(),
        triggeredBy: userId,
        triggeredBySystem: false,
        reason: dto.reason,
        validationsPassed: true,
        rollbackAvailable: false,
    };
    order.status = OrderStatus.ARCHIVED;
    order.stateHistory.push(transition);
    order.updatedAt = new Date();
    order.updatedBy = userId;
    order.metadata = {
        ...order.metadata,
        archive: {
            archivedAt: new Date(),
            archivedBy: userId,
            reason: dto.reason,
            retentionDays: dto.retentionDays || 2555, // 7 years default
            createBackup: dto.createBackup,
        },
    };
    return order;
}
/**
 * 42. Generates comprehensive order modification report.
 *
 * @param {Order} order - Order to generate report for
 * @returns {object} Modification report
 *
 * @example
 * ```typescript
 * const report = generateModificationReport(order);
 * console.log(`Total modifications: ${report.totalModifications}`);
 * ```
 */
function generateModificationReport(order) {
    const modificationsByType = {};
    for (const mod of order.modifications) {
        modificationsByType[mod.type] = (modificationsByType[mod.type] || 0) + 1;
    }
    const pendingApprovals = order.modifications.filter(m => m.approvalStatus === ChangeApprovalStatus.PENDING).length;
    const priceImpact = order.modifications
        .filter(m => m.type === OrderModificationType.PRICE_ADJUSTMENT)
        .reduce((sum, m) => sum + (m.newValue - m.previousValue), 0);
    const modificationTimeline = order.modifications
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .map(m => ({
        date: m.timestamp,
        type: m.type,
        description: m.reason || 'No description',
    }));
    return {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        totalModifications: order.modifications.length,
        modificationsByType,
        totalAmendments: order.amendments.length,
        pendingApprovals,
        priceImpact,
        lastModifiedAt: order.updatedAt,
        lastModifiedBy: order.updatedBy,
        modificationTimeline,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Recalculates all order totals after modifications.
 */
function recalculateOrderTotals(order) {
    order.subtotal = order.lineItems.reduce((sum, item) => sum + item.subtotal, 0);
    order.discountTotal = order.lineItems.reduce((sum, item) => sum + item.discountAmount, 0);
    order.taxTotal = order.lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
    order.total = order.subtotal - order.discountTotal + order.taxTotal + (order.shippingCost || 0);
    return order;
}
/**
 * Calculates tax for a line item.
 */
function calculateLineTax(quantity, unitPrice, taxRate = 0.08) {
    return Number(((quantity * unitPrice) * taxRate).toFixed(2));
}
/**
 * Calculates total impact of amendments.
 */
function calculateAmendmentImpact(modifications) {
    let priceDelta = 0;
    let quantityDelta = 0;
    let taxDelta = 0;
    for (const mod of modifications) {
        switch (mod.type) {
            case OrderModificationType.PRICE_ADJUSTMENT:
                priceDelta += (mod.newValue - mod.previousValue);
                break;
            case OrderModificationType.QUANTITY_CHANGE:
                quantityDelta += (mod.newValue - mod.previousValue);
                break;
            case OrderModificationType.TAX_ADJUSTMENT:
                taxDelta += (mod.newValue - mod.previousValue);
                break;
        }
    }
    return { priceDelta, quantityDelta, taxDelta };
}
/**
 * Determines if a state transition can be rolled back.
 */
function canRollbackTransition(fromStatus, toStatus) {
    // Cannot rollback to/from terminal states
    const terminalStates = [
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
        OrderStatus.REFUNDED,
        OrderStatus.ARCHIVED,
    ];
    return !terminalStates.includes(toStatus);
}
/**
 * Generates unique modification ID.
 */
function generateModificationId() {
    return `MOD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates unique amendment ID.
 */
function generateAmendmentId() {
    return `AMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates amendment number.
 */
function generateAmendmentNumber(orderNumber, amendmentCount) {
    return `${orderNumber}-AMD-${String(amendmentCount).padStart(3, '0')}`;
}
/**
 * Generates unique line item ID.
 */
function generateLineItemId() {
    return `LINE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates unique cancellation ID.
 */
function generateCancellationId() {
    return `CANC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates unique refund ID.
 */
function generateRefundId() {
    return `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates unique hold ID.
 */
function generateHoldId() {
    return `HOLD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates unique transition ID.
 */
function generateTransitionId() {
    return `TRANS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates unique audit ID.
 */
function generateAuditId() {
    return `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates unique version ID.
 */
function generateVersionId() {
    return `VER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates unique order ID.
 */
function generateOrderId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Generates unique order number.
 */
function generateOrderNumber() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-6);
    return `ORD-${dateStr}-${timeStr}`;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Order Modifications
    modifyLineItemQuantity,
    adjustLineItemPrice,
    changeDeliveryDate,
    changeOrderCustomer,
    addLineItemToOrder,
    removeLineItemFromOrder,
    updateOrderNotes,
    // Order Amendments & Change Orders
    createOrderAmendment,
    approveAmendment,
    rejectAmendment,
    getCustomerApproval,
    applyAmendmentToOrder,
    calculateChangeImpact,
    generateChangeNotification,
    // Order Cancellations
    cancelOrder,
    partialCancelOrder,
    processRefund,
    calculateRestockingFee,
    validateCancellationEligibility,
    sendCancellationNotification,
    restockCancelledItems,
    // Order Holds & Releases
    placeOrderOnHold,
    releaseOrderHold,
    autoReleaseExpiredHolds,
    extendHoldDuration,
    getOrdersOnHold,
    sendHoldNotification,
    validateHoldEligibility,
    // Order Lifecycle & State Machine
    transitionOrderStatus,
    validateStateTransition,
    getOrderLifecycleTimeline,
    canRollbackOrder,
    rollbackOrderState,
    getCurrentLifecycleStage,
    generateStateMachineDiagram,
    // Order History & Archival
    createOrderAuditEntry,
    getOrderAuditTrail,
    createOrderVersion,
    restoreOrderVersion,
    cloneOrder,
    archiveOrder,
    generateModificationReport,
};
//# sourceMappingURL=order-modification-lifecycle-kit.js.map