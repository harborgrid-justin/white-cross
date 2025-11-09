"use strict";
/**
 * LOC: ORD-VAL-001
 * File: /reuse/order/order-validation-rules-kit.ts
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
 *   - Validation middleware
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
exports.ProductInventory = exports.CustomerCredit = exports.ValidationLog = exports.ValidationRule = exports.CreditCheckDto = exports.ValidateAddressDto = exports.CreateValidationRuleDto = exports.ValidateOrderDto = exports.FraudRiskLevel = exports.CreditCheckResult = exports.RuleOperator = exports.ComplianceValidationType = exports.PaymentValidationType = exports.AddressValidationType = exports.ProductValidationType = exports.CustomerValidationType = exports.ValidationStatus = exports.ValidationSeverity = exports.ValidationRuleType = void 0;
exports.validateCustomerExists = validateCustomerExists;
exports.validateCustomerActive = validateCustomerActive;
exports.validateCustomerCreditLimit = validateCustomerCreditLimit;
exports.validateCustomerNotBlacklisted = validateCustomerNotBlacklisted;
exports.validateCustomerPaymentHistory = validateCustomerPaymentHistory;
exports.validateProductExists = validateProductExists;
exports.validateProductNotDiscontinued = validateProductNotDiscontinued;
exports.validateProductQuantityConstraints = validateProductQuantityConstraints;
exports.validateProductNotRestricted = validateProductNotRestricted;
exports.validatePricing = validatePricing;
exports.validateDiscountAuthorization = validateDiscountAuthorization;
exports.validateLineItemTotals = validateLineItemTotals;
exports.checkProductATP = checkProductATP;
exports.validateInventoryAvailability = validateInventoryAvailability;
exports.validateInventoryReservation = validateInventoryReservation;
exports.validateAddressFormat = validateAddressFormat;
exports.validatePostalCode = validatePostalCode;
exports.validateAddressDeliverable = validateAddressDeliverable;
exports.validateInternationalShipping = validateInternationalShipping;
exports.validatePaymentMethod = validatePaymentMethod;
exports.validatePaymentTerms = validatePaymentTerms;
exports.validatePaymentAmount = validatePaymentAmount;
exports.executeBusinessRules = executeBusinessRules;
exports.evaluateBusinessRule = evaluateBusinessRule;
exports.evaluateRuleCondition = evaluateRuleCondition;
exports.getNestedValue = getNestedValue;
exports.validateOrderLimits = validateOrderLimits;
exports.validateCrossFieldDependencies = validateCrossFieldDependencies;
exports.validateExportControl = validateExportControl;
exports.performFraudCheck = performFraudCheck;
exports.validateTaxExemption = validateTaxExemption;
exports.validateCompleteOrder = validateCompleteOrder;
exports.createValidationLog = createValidationLog;
exports.getValidationSummary = getValidationSummary;
/**
 * File: /reuse/order/order-validation-rules-kit.ts
 * Locator: WC-ORD-VALRUL-001
 * Purpose: Order Validation & Business Rules - Complex validation and rule engine
 *
 * Upstream: Independent utility module for comprehensive order validation
 * Downstream: ../backend/order/*, Order modules, Validation services, Rule engines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for order validation, business rules, constraint checking
 *
 * LLM Context: Enterprise-grade order validation system to compete with SAP, Oracle, and JD Edwards.
 * Provides comprehensive customer validation, product validation, pricing validation, inventory ATP checks,
 * address validation, payment validation, shipping validation, business rule engine, cross-field validation,
 * constraint checking, data integrity validation, regulatory compliance, credit limit checks, tax validation,
 * discount validation, order limit validation, fraud detection, compliance checks, and more.
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
 * Validation rule types
 */
var ValidationRuleType;
(function (ValidationRuleType) {
    ValidationRuleType["CUSTOMER"] = "CUSTOMER";
    ValidationRuleType["PRODUCT"] = "PRODUCT";
    ValidationRuleType["PRICING"] = "PRICING";
    ValidationRuleType["INVENTORY"] = "INVENTORY";
    ValidationRuleType["ADDRESS"] = "ADDRESS";
    ValidationRuleType["PAYMENT"] = "PAYMENT";
    ValidationRuleType["SHIPPING"] = "SHIPPING";
    ValidationRuleType["BUSINESS_RULE"] = "BUSINESS_RULE";
    ValidationRuleType["CROSS_FIELD"] = "CROSS_FIELD";
    ValidationRuleType["CONSTRAINT"] = "CONSTRAINT";
    ValidationRuleType["DATA_INTEGRITY"] = "DATA_INTEGRITY";
    ValidationRuleType["COMPLIANCE"] = "COMPLIANCE";
})(ValidationRuleType || (exports.ValidationRuleType = ValidationRuleType = {}));
/**
 * Validation severity levels
 */
var ValidationSeverity;
(function (ValidationSeverity) {
    ValidationSeverity["ERROR"] = "ERROR";
    ValidationSeverity["WARNING"] = "WARNING";
    ValidationSeverity["INFO"] = "INFO";
    ValidationSeverity["CRITICAL"] = "CRITICAL";
})(ValidationSeverity || (exports.ValidationSeverity = ValidationSeverity = {}));
/**
 * Validation status
 */
var ValidationStatus;
(function (ValidationStatus) {
    ValidationStatus["PENDING"] = "PENDING";
    ValidationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ValidationStatus["PASSED"] = "PASSED";
    ValidationStatus["FAILED"] = "FAILED";
    ValidationStatus["PARTIAL"] = "PARTIAL";
})(ValidationStatus || (exports.ValidationStatus = ValidationStatus = {}));
/**
 * Customer validation types
 */
var CustomerValidationType;
(function (CustomerValidationType) {
    CustomerValidationType["EXISTS"] = "EXISTS";
    CustomerValidationType["ACTIVE"] = "ACTIVE";
    CustomerValidationType["CREDIT_LIMIT"] = "CREDIT_LIMIT";
    CustomerValidationType["CREDIT_HOLD"] = "CREDIT_HOLD";
    CustomerValidationType["BLACKLIST"] = "BLACKLIST";
    CustomerValidationType["FRAUD_SCORE"] = "FRAUD_SCORE";
    CustomerValidationType["PAYMENT_HISTORY"] = "PAYMENT_HISTORY";
    CustomerValidationType["KYC_STATUS"] = "KYC_STATUS";
})(CustomerValidationType || (exports.CustomerValidationType = CustomerValidationType = {}));
/**
 * Product validation types
 */
var ProductValidationType;
(function (ProductValidationType) {
    ProductValidationType["EXISTS"] = "EXISTS";
    ProductValidationType["ACTIVE"] = "ACTIVE";
    ProductValidationType["DISCONTINUED"] = "DISCONTINUED";
    ProductValidationType["RESTRICTED"] = "RESTRICTED";
    ProductValidationType["MINIMUM_ORDER_QTY"] = "MINIMUM_ORDER_QTY";
    ProductValidationType["MAXIMUM_ORDER_QTY"] = "MAXIMUM_ORDER_QTY";
    ProductValidationType["INVENTORY_AVAILABLE"] = "INVENTORY_AVAILABLE";
    ProductValidationType["PRICE_VALID"] = "PRICE_VALID";
})(ProductValidationType || (exports.ProductValidationType = ProductValidationType = {}));
/**
 * Address validation types
 */
var AddressValidationType;
(function (AddressValidationType) {
    AddressValidationType["FORMAT"] = "FORMAT";
    AddressValidationType["POSTAL_CODE"] = "POSTAL_CODE";
    AddressValidationType["DELIVERABLE"] = "DELIVERABLE";
    AddressValidationType["PO_BOX"] = "PO_BOX";
    AddressValidationType["RESTRICTED_AREA"] = "RESTRICTED_AREA";
    AddressValidationType["INTERNATIONAL"] = "INTERNATIONAL";
})(AddressValidationType || (exports.AddressValidationType = AddressValidationType = {}));
/**
 * Payment validation types
 */
var PaymentValidationType;
(function (PaymentValidationType) {
    PaymentValidationType["METHOD_ALLOWED"] = "METHOD_ALLOWED";
    PaymentValidationType["CREDIT_CARD_VALID"] = "CREDIT_CARD_VALID";
    PaymentValidationType["PAYMENT_TERMS"] = "PAYMENT_TERMS";
    PaymentValidationType["AMOUNT_MATCH"] = "AMOUNT_MATCH";
    PaymentValidationType["AUTHORIZATION"] = "AUTHORIZATION";
    PaymentValidationType["FRAUD_CHECK"] = "FRAUD_CHECK";
})(PaymentValidationType || (exports.PaymentValidationType = PaymentValidationType = {}));
/**
 * Compliance validation types
 */
var ComplianceValidationType;
(function (ComplianceValidationType) {
    ComplianceValidationType["EXPORT_CONTROL"] = "EXPORT_CONTROL";
    ComplianceValidationType["SANCTIONS"] = "SANCTIONS";
    ComplianceValidationType["TAX_EXEMPT"] = "TAX_EXEMPT";
    ComplianceValidationType["REGULATORY"] = "REGULATORY";
    ComplianceValidationType["DATA_PRIVACY"] = "DATA_PRIVACY";
    ComplianceValidationType["INDUSTRY_SPECIFIC"] = "INDUSTRY_SPECIFIC";
})(ComplianceValidationType || (exports.ComplianceValidationType = ComplianceValidationType = {}));
/**
 * Rule operator types
 */
var RuleOperator;
(function (RuleOperator) {
    RuleOperator["EQUALS"] = "EQUALS";
    RuleOperator["NOT_EQUALS"] = "NOT_EQUALS";
    RuleOperator["GREATER_THAN"] = "GREATER_THAN";
    RuleOperator["GREATER_THAN_OR_EQUAL"] = "GREATER_THAN_OR_EQUAL";
    RuleOperator["LESS_THAN"] = "LESS_THAN";
    RuleOperator["LESS_THAN_OR_EQUAL"] = "LESS_THAN_OR_EQUAL";
    RuleOperator["BETWEEN"] = "BETWEEN";
    RuleOperator["IN"] = "IN";
    RuleOperator["NOT_IN"] = "NOT_IN";
    RuleOperator["CONTAINS"] = "CONTAINS";
    RuleOperator["REGEX"] = "REGEX";
})(RuleOperator || (exports.RuleOperator = RuleOperator = {}));
/**
 * Credit check result
 */
var CreditCheckResult;
(function (CreditCheckResult) {
    CreditCheckResult["APPROVED"] = "APPROVED";
    CreditCheckResult["DECLINED"] = "DECLINED";
    CreditCheckResult["MANUAL_REVIEW"] = "MANUAL_REVIEW";
    CreditCheckResult["OVER_LIMIT"] = "OVER_LIMIT";
    CreditCheckResult["ON_HOLD"] = "ON_HOLD";
})(CreditCheckResult || (exports.CreditCheckResult = CreditCheckResult = {}));
/**
 * Fraud risk level
 */
var FraudRiskLevel;
(function (FraudRiskLevel) {
    FraudRiskLevel["LOW"] = "LOW";
    FraudRiskLevel["MEDIUM"] = "MEDIUM";
    FraudRiskLevel["HIGH"] = "HIGH";
    FraudRiskLevel["CRITICAL"] = "CRITICAL";
})(FraudRiskLevel || (exports.FraudRiskLevel = FraudRiskLevel = {}));
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
/**
 * Validate order DTO
 */
let ValidateOrderDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _shippingAddress_decorators;
    let _shippingAddress_initializers = [];
    let _shippingAddress_extraInitializers = [];
    let _billingAddress_decorators;
    let _billingAddress_initializers = [];
    let _billingAddress_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class ValidateOrderDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.items = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                this.shippingAddress = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _shippingAddress_initializers, void 0));
                this.billingAddress = (__runInitializers(this, _shippingAddress_extraInitializers), __runInitializers(this, _billingAddress_initializers, void 0));
                this.paymentMethod = (__runInitializers(this, _billingAddress_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                this.currency = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _items_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order line items' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsNotEmpty)()];
            _shippingAddress_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Shipping address' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsOptional)()];
            _billingAddress_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Billing address' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsOptional)()];
            _paymentMethod_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Payment method' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _currency_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Currency code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(3, 3), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _shippingAddress_decorators, { kind: "field", name: "shippingAddress", static: false, private: false, access: { has: obj => "shippingAddress" in obj, get: obj => obj.shippingAddress, set: (obj, value) => { obj.shippingAddress = value; } }, metadata: _metadata }, _shippingAddress_initializers, _shippingAddress_extraInitializers);
            __esDecorate(null, null, _billingAddress_decorators, { kind: "field", name: "billingAddress", static: false, private: false, access: { has: obj => "billingAddress" in obj, get: obj => obj.billingAddress, set: (obj, value) => { obj.billingAddress = value; } }, metadata: _metadata }, _billingAddress_initializers, _billingAddress_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ValidateOrderDto = ValidateOrderDto;
/**
 * Create validation rule DTO
 */
let CreateValidationRuleDto = (() => {
    var _a;
    let _ruleName_decorators;
    let _ruleName_initializers = [];
    let _ruleName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _ruleType_decorators;
    let _ruleType_initializers = [];
    let _ruleType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _condition_decorators;
    let _condition_initializers = [];
    let _condition_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _errorCode_decorators;
    let _errorCode_initializers = [];
    let _errorCode_extraInitializers = [];
    return _a = class CreateValidationRuleDto {
            constructor() {
                this.ruleName = __runInitializers(this, _ruleName_initializers, void 0);
                this.description = (__runInitializers(this, _ruleName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.ruleType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _ruleType_initializers, void 0));
                this.severity = (__runInitializers(this, _ruleType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.condition = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _condition_initializers, void 0));
                this.action = (__runInitializers(this, _condition_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.priority = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.errorCode = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _errorCode_initializers, void 0));
                __runInitializers(this, _errorCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ruleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ruleType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule type', enum: ValidationRuleType }), (0, class_validator_1.IsEnum)(ValidationRuleType), (0, class_validator_1.IsNotEmpty)()];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severity level', enum: ValidationSeverity }), (0, class_validator_1.IsEnum)(ValidationSeverity), (0, class_validator_1.IsNotEmpty)()];
            _condition_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule condition (JSON)' }), (0, class_validator_1.IsNotEmpty)()];
            _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule action (JSON)' }), (0, class_validator_1.IsNotEmpty)()];
            _priority_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Priority (higher = higher priority)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100), (0, class_validator_1.IsOptional)()];
            _errorCode_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Error code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _ruleName_decorators, { kind: "field", name: "ruleName", static: false, private: false, access: { has: obj => "ruleName" in obj, get: obj => obj.ruleName, set: (obj, value) => { obj.ruleName = value; } }, metadata: _metadata }, _ruleName_initializers, _ruleName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _ruleType_decorators, { kind: "field", name: "ruleType", static: false, private: false, access: { has: obj => "ruleType" in obj, get: obj => obj.ruleType, set: (obj, value) => { obj.ruleType = value; } }, metadata: _metadata }, _ruleType_initializers, _ruleType_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _condition_decorators, { kind: "field", name: "condition", static: false, private: false, access: { has: obj => "condition" in obj, get: obj => obj.condition, set: (obj, value) => { obj.condition = value; } }, metadata: _metadata }, _condition_initializers, _condition_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _errorCode_decorators, { kind: "field", name: "errorCode", static: false, private: false, access: { has: obj => "errorCode" in obj, get: obj => obj.errorCode, set: (obj, value) => { obj.errorCode = value; } }, metadata: _metadata }, _errorCode_initializers, _errorCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateValidationRuleDto = CreateValidationRuleDto;
/**
 * Address validation DTO
 */
let ValidateAddressDto = (() => {
    var _a;
    let _addressLine1_decorators;
    let _addressLine1_initializers = [];
    let _addressLine1_extraInitializers = [];
    let _addressLine2_decorators;
    let _addressLine2_initializers = [];
    let _addressLine2_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _stateProvince_decorators;
    let _stateProvince_initializers = [];
    let _stateProvince_extraInitializers = [];
    let _postalCode_decorators;
    let _postalCode_initializers = [];
    let _postalCode_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    return _a = class ValidateAddressDto {
            constructor() {
                this.addressLine1 = __runInitializers(this, _addressLine1_initializers, void 0);
                this.addressLine2 = (__runInitializers(this, _addressLine1_extraInitializers), __runInitializers(this, _addressLine2_initializers, void 0));
                this.city = (__runInitializers(this, _addressLine2_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.stateProvince = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _stateProvince_initializers, void 0));
                this.postalCode = (__runInitializers(this, _stateProvince_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
                this.country = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                __runInitializers(this, _country_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _addressLine1_decorators = [(0, swagger_1.ApiProperty)({ description: 'Address line 1' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _addressLine2_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Address line 2' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _city_decorators = [(0, swagger_1.ApiProperty)({ description: 'City' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _stateProvince_decorators = [(0, swagger_1.ApiProperty)({ description: 'State/Province' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _postalCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Postal code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _country_decorators = [(0, swagger_1.ApiProperty)({ description: 'Country code (ISO 2-letter)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(2, 2), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _addressLine1_decorators, { kind: "field", name: "addressLine1", static: false, private: false, access: { has: obj => "addressLine1" in obj, get: obj => obj.addressLine1, set: (obj, value) => { obj.addressLine1 = value; } }, metadata: _metadata }, _addressLine1_initializers, _addressLine1_extraInitializers);
            __esDecorate(null, null, _addressLine2_decorators, { kind: "field", name: "addressLine2", static: false, private: false, access: { has: obj => "addressLine2" in obj, get: obj => obj.addressLine2, set: (obj, value) => { obj.addressLine2 = value; } }, metadata: _metadata }, _addressLine2_initializers, _addressLine2_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _stateProvince_decorators, { kind: "field", name: "stateProvince", static: false, private: false, access: { has: obj => "stateProvince" in obj, get: obj => obj.stateProvince, set: (obj, value) => { obj.stateProvince = value; } }, metadata: _metadata }, _stateProvince_initializers, _stateProvince_extraInitializers);
            __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: obj => "postalCode" in obj, get: obj => obj.postalCode, set: (obj, value) => { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ValidateAddressDto = ValidateAddressDto;
/**
 * Credit check DTO
 */
let CreditCheckDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _orderAmount_decorators;
    let _orderAmount_initializers = [];
    let _orderAmount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class CreditCheckDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.orderAmount = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _orderAmount_initializers, void 0));
                this.currency = (__runInitializers(this, _orderAmount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _orderAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsNotEmpty)()];
            _currency_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Currency code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(3, 3), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _orderAmount_decorators, { kind: "field", name: "orderAmount", static: false, private: false, access: { has: obj => "orderAmount" in obj, get: obj => obj.orderAmount, set: (obj, value) => { obj.orderAmount = value; } }, metadata: _metadata }, _orderAmount_initializers, _orderAmount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreditCheckDto = CreditCheckDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Validation rule model
 */
let ValidationRule = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'validation_rules',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['ruleType'] },
                { fields: ['severity'] },
                { fields: ['isActive'] },
                { fields: ['priority'] },
                {
                    fields: ['ruleType', 'isActive', 'priority'],
                    name: 'idx_validation_rules_lookup'
                },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _ruleId_decorators;
    let _ruleId_initializers = [];
    let _ruleId_extraInitializers = [];
    let _ruleCode_decorators;
    let _ruleCode_initializers = [];
    let _ruleCode_extraInitializers = [];
    let _ruleName_decorators;
    let _ruleName_initializers = [];
    let _ruleName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _ruleType_decorators;
    let _ruleType_initializers = [];
    let _ruleType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _condition_decorators;
    let _condition_initializers = [];
    let _condition_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _errorCode_decorators;
    let _errorCode_initializers = [];
    let _errorCode_extraInitializers = [];
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
    var ValidationRule = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.ruleId = __runInitializers(this, _ruleId_initializers, void 0);
            this.ruleCode = (__runInitializers(this, _ruleId_extraInitializers), __runInitializers(this, _ruleCode_initializers, void 0));
            this.ruleName = (__runInitializers(this, _ruleCode_extraInitializers), __runInitializers(this, _ruleName_initializers, void 0));
            this.description = (__runInitializers(this, _ruleName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.ruleType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _ruleType_initializers, void 0));
            this.severity = (__runInitializers(this, _ruleType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.condition = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _condition_initializers, void 0));
            this.action = (__runInitializers(this, _condition_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.priority = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.isActive = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.errorCode = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _errorCode_initializers, void 0));
            this.customFields = (__runInitializers(this, _errorCode_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
            this.createdBy = (__runInitializers(this, _customFields_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ValidationRule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _ruleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation rule ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _ruleCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule code (unique)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index];
        _ruleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _ruleType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule type', enum: ValidationRuleType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ValidationRuleType)),
                allowNull: false,
            })];
        _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severity level', enum: ValidationSeverity }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ValidationSeverity)),
                allowNull: false,
            })];
        _condition_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule condition (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule action (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority (higher = higher priority)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 50,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _errorCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error code' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
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
        __esDecorate(null, null, _ruleId_decorators, { kind: "field", name: "ruleId", static: false, private: false, access: { has: obj => "ruleId" in obj, get: obj => obj.ruleId, set: (obj, value) => { obj.ruleId = value; } }, metadata: _metadata }, _ruleId_initializers, _ruleId_extraInitializers);
        __esDecorate(null, null, _ruleCode_decorators, { kind: "field", name: "ruleCode", static: false, private: false, access: { has: obj => "ruleCode" in obj, get: obj => obj.ruleCode, set: (obj, value) => { obj.ruleCode = value; } }, metadata: _metadata }, _ruleCode_initializers, _ruleCode_extraInitializers);
        __esDecorate(null, null, _ruleName_decorators, { kind: "field", name: "ruleName", static: false, private: false, access: { has: obj => "ruleName" in obj, get: obj => obj.ruleName, set: (obj, value) => { obj.ruleName = value; } }, metadata: _metadata }, _ruleName_initializers, _ruleName_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _ruleType_decorators, { kind: "field", name: "ruleType", static: false, private: false, access: { has: obj => "ruleType" in obj, get: obj => obj.ruleType, set: (obj, value) => { obj.ruleType = value; } }, metadata: _metadata }, _ruleType_initializers, _ruleType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _condition_decorators, { kind: "field", name: "condition", static: false, private: false, access: { has: obj => "condition" in obj, get: obj => obj.condition, set: (obj, value) => { obj.condition = value; } }, metadata: _metadata }, _condition_initializers, _condition_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _errorCode_decorators, { kind: "field", name: "errorCode", static: false, private: false, access: { has: obj => "errorCode" in obj, get: obj => obj.errorCode, set: (obj, value) => { obj.errorCode = value; } }, metadata: _metadata }, _errorCode_initializers, _errorCode_extraInitializers);
        __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ValidationRule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ValidationRule = _classThis;
})();
exports.ValidationRule = ValidationRule;
/**
 * Validation log model for audit trail
 */
let ValidationLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'validation_logs',
            timestamps: true,
            indexes: [
                { fields: ['orderId'] },
                { fields: ['customerId'] },
                { fields: ['validationStatus'] },
                { fields: ['severity'] },
                { fields: ['createdAt'] },
                { fields: ['orderId', 'validationStatus'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _logId_decorators;
    let _logId_initializers = [];
    let _logId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _ruleId_decorators;
    let _ruleId_initializers = [];
    let _ruleId_extraInitializers = [];
    let _ruleType_decorators;
    let _ruleType_initializers = [];
    let _ruleType_extraInitializers = [];
    let _validationStatus_decorators;
    let _validationStatus_initializers = [];
    let _validationStatus_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _fieldName_decorators;
    let _fieldName_initializers = [];
    let _fieldName_extraInitializers = [];
    let _errorCode_decorators;
    let _errorCode_initializers = [];
    let _errorCode_extraInitializers = [];
    let _validationData_decorators;
    let _validationData_initializers = [];
    let _validationData_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var ValidationLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.logId = __runInitializers(this, _logId_initializers, void 0);
            this.orderId = (__runInitializers(this, _logId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.customerId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.ruleId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _ruleId_initializers, void 0));
            this.ruleType = (__runInitializers(this, _ruleId_extraInitializers), __runInitializers(this, _ruleType_initializers, void 0));
            this.validationStatus = (__runInitializers(this, _ruleType_extraInitializers), __runInitializers(this, _validationStatus_initializers, void 0));
            this.severity = (__runInitializers(this, _validationStatus_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.message = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.fieldName = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _fieldName_initializers, void 0));
            this.errorCode = (__runInitializers(this, _fieldName_extraInitializers), __runInitializers(this, _errorCode_initializers, void 0));
            this.validationData = (__runInitializers(this, _errorCode_extraInitializers), __runInitializers(this, _validationData_initializers, void 0));
            this.createdAt = (__runInitializers(this, _validationData_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ValidationLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _logId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation log ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _ruleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            })];
        _ruleType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule type', enum: ValidationRuleType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ValidationRuleType)),
                allowNull: false,
            })];
        _validationStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation status', enum: ValidationStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ValidationStatus)),
                allowNull: false,
            })];
        _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severity', enum: ValidationSeverity }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ValidationSeverity)),
                allowNull: false,
            })];
        _message_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation message' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _fieldName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Field name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _errorCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error code' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _validationData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation data (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _logId_decorators, { kind: "field", name: "logId", static: false, private: false, access: { has: obj => "logId" in obj, get: obj => obj.logId, set: (obj, value) => { obj.logId = value; } }, metadata: _metadata }, _logId_initializers, _logId_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _ruleId_decorators, { kind: "field", name: "ruleId", static: false, private: false, access: { has: obj => "ruleId" in obj, get: obj => obj.ruleId, set: (obj, value) => { obj.ruleId = value; } }, metadata: _metadata }, _ruleId_initializers, _ruleId_extraInitializers);
        __esDecorate(null, null, _ruleType_decorators, { kind: "field", name: "ruleType", static: false, private: false, access: { has: obj => "ruleType" in obj, get: obj => obj.ruleType, set: (obj, value) => { obj.ruleType = value; } }, metadata: _metadata }, _ruleType_initializers, _ruleType_extraInitializers);
        __esDecorate(null, null, _validationStatus_decorators, { kind: "field", name: "validationStatus", static: false, private: false, access: { has: obj => "validationStatus" in obj, get: obj => obj.validationStatus, set: (obj, value) => { obj.validationStatus = value; } }, metadata: _metadata }, _validationStatus_initializers, _validationStatus_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _fieldName_decorators, { kind: "field", name: "fieldName", static: false, private: false, access: { has: obj => "fieldName" in obj, get: obj => obj.fieldName, set: (obj, value) => { obj.fieldName = value; } }, metadata: _metadata }, _fieldName_initializers, _fieldName_extraInitializers);
        __esDecorate(null, null, _errorCode_decorators, { kind: "field", name: "errorCode", static: false, private: false, access: { has: obj => "errorCode" in obj, get: obj => obj.errorCode, set: (obj, value) => { obj.errorCode = value; } }, metadata: _metadata }, _errorCode_initializers, _errorCode_extraInitializers);
        __esDecorate(null, null, _validationData_decorators, { kind: "field", name: "validationData", static: false, private: false, access: { has: obj => "validationData" in obj, get: obj => obj.validationData, set: (obj, value) => { obj.validationData = value; } }, metadata: _metadata }, _validationData_initializers, _validationData_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ValidationLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ValidationLog = _classThis;
})();
exports.ValidationLog = ValidationLog;
/**
 * Customer credit model
 */
let CustomerCredit = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'customer_credit',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['customerId'], unique: true },
                { fields: ['creditStatus'] },
                { fields: ['isOnHold'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _creditId_decorators;
    let _creditId_initializers = [];
    let _creditId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _creditLimit_decorators;
    let _creditLimit_initializers = [];
    let _creditLimit_extraInitializers = [];
    let _availableCredit_decorators;
    let _availableCredit_initializers = [];
    let _availableCredit_extraInitializers = [];
    let _outstandingBalance_decorators;
    let _outstandingBalance_initializers = [];
    let _outstandingBalance_extraInitializers = [];
    let _creditStatus_decorators;
    let _creditStatus_initializers = [];
    let _creditStatus_extraInitializers = [];
    let _isOnHold_decorators;
    let _isOnHold_initializers = [];
    let _isOnHold_extraInitializers = [];
    let _lastReviewDate_decorators;
    let _lastReviewDate_initializers = [];
    let _lastReviewDate_extraInitializers = [];
    let _creditScore_decorators;
    let _creditScore_initializers = [];
    let _creditScore_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CustomerCredit = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.creditId = __runInitializers(this, _creditId_initializers, void 0);
            this.customerId = (__runInitializers(this, _creditId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.creditLimit = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _creditLimit_initializers, void 0));
            this.availableCredit = (__runInitializers(this, _creditLimit_extraInitializers), __runInitializers(this, _availableCredit_initializers, void 0));
            this.outstandingBalance = (__runInitializers(this, _availableCredit_extraInitializers), __runInitializers(this, _outstandingBalance_initializers, void 0));
            this.creditStatus = (__runInitializers(this, _outstandingBalance_extraInitializers), __runInitializers(this, _creditStatus_initializers, void 0));
            this.isOnHold = (__runInitializers(this, _creditStatus_extraInitializers), __runInitializers(this, _isOnHold_initializers, void 0));
            this.lastReviewDate = (__runInitializers(this, _isOnHold_extraInitializers), __runInitializers(this, _lastReviewDate_initializers, void 0));
            this.creditScore = (__runInitializers(this, _lastReviewDate_extraInitializers), __runInitializers(this, _creditScore_initializers, void 0));
            this.createdAt = (__runInitializers(this, _creditScore_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CustomerCredit");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _creditId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit record ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            })];
        _creditLimit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit limit' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _availableCredit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Available credit' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _outstandingBalance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Outstanding balance' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _creditStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                defaultValue: 'ACTIVE',
            })];
        _isOnHold_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is on credit hold' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            })];
        _lastReviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last credit review date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _creditScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit score' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _creditId_decorators, { kind: "field", name: "creditId", static: false, private: false, access: { has: obj => "creditId" in obj, get: obj => obj.creditId, set: (obj, value) => { obj.creditId = value; } }, metadata: _metadata }, _creditId_initializers, _creditId_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _creditLimit_decorators, { kind: "field", name: "creditLimit", static: false, private: false, access: { has: obj => "creditLimit" in obj, get: obj => obj.creditLimit, set: (obj, value) => { obj.creditLimit = value; } }, metadata: _metadata }, _creditLimit_initializers, _creditLimit_extraInitializers);
        __esDecorate(null, null, _availableCredit_decorators, { kind: "field", name: "availableCredit", static: false, private: false, access: { has: obj => "availableCredit" in obj, get: obj => obj.availableCredit, set: (obj, value) => { obj.availableCredit = value; } }, metadata: _metadata }, _availableCredit_initializers, _availableCredit_extraInitializers);
        __esDecorate(null, null, _outstandingBalance_decorators, { kind: "field", name: "outstandingBalance", static: false, private: false, access: { has: obj => "outstandingBalance" in obj, get: obj => obj.outstandingBalance, set: (obj, value) => { obj.outstandingBalance = value; } }, metadata: _metadata }, _outstandingBalance_initializers, _outstandingBalance_extraInitializers);
        __esDecorate(null, null, _creditStatus_decorators, { kind: "field", name: "creditStatus", static: false, private: false, access: { has: obj => "creditStatus" in obj, get: obj => obj.creditStatus, set: (obj, value) => { obj.creditStatus = value; } }, metadata: _metadata }, _creditStatus_initializers, _creditStatus_extraInitializers);
        __esDecorate(null, null, _isOnHold_decorators, { kind: "field", name: "isOnHold", static: false, private: false, access: { has: obj => "isOnHold" in obj, get: obj => obj.isOnHold, set: (obj, value) => { obj.isOnHold = value; } }, metadata: _metadata }, _isOnHold_initializers, _isOnHold_extraInitializers);
        __esDecorate(null, null, _lastReviewDate_decorators, { kind: "field", name: "lastReviewDate", static: false, private: false, access: { has: obj => "lastReviewDate" in obj, get: obj => obj.lastReviewDate, set: (obj, value) => { obj.lastReviewDate = value; } }, metadata: _metadata }, _lastReviewDate_initializers, _lastReviewDate_extraInitializers);
        __esDecorate(null, null, _creditScore_decorators, { kind: "field", name: "creditScore", static: false, private: false, access: { has: obj => "creditScore" in obj, get: obj => obj.creditScore, set: (obj, value) => { obj.creditScore = value; } }, metadata: _metadata }, _creditScore_initializers, _creditScore_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CustomerCredit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CustomerCredit = _classThis;
})();
exports.CustomerCredit = CustomerCredit;
/**
 * Product inventory model for ATP checks
 */
let ProductInventory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'product_inventory',
            timestamps: true,
            indexes: [
                { fields: ['productId'] },
                { fields: ['warehouseId'] },
                { fields: ['productId', 'warehouseId'] },
                { fields: ['isActive'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _inventoryId_decorators;
    let _inventoryId_initializers = [];
    let _inventoryId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _warehouseId_decorators;
    let _warehouseId_initializers = [];
    let _warehouseId_extraInitializers = [];
    let _onHandQuantity_decorators;
    let _onHandQuantity_initializers = [];
    let _onHandQuantity_extraInitializers = [];
    let _availableQuantity_decorators;
    let _availableQuantity_initializers = [];
    let _availableQuantity_extraInitializers = [];
    let _reservedQuantity_decorators;
    let _reservedQuantity_initializers = [];
    let _reservedQuantity_extraInitializers = [];
    let _onOrderQuantity_decorators;
    let _onOrderQuantity_initializers = [];
    let _onOrderQuantity_extraInitializers = [];
    let _safetyStock_decorators;
    let _safetyStock_initializers = [];
    let _safetyStock_extraInitializers = [];
    let _reorderPoint_decorators;
    let _reorderPoint_initializers = [];
    let _reorderPoint_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _lastCountDate_decorators;
    let _lastCountDate_initializers = [];
    let _lastCountDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ProductInventory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.inventoryId = __runInitializers(this, _inventoryId_initializers, void 0);
            this.productId = (__runInitializers(this, _inventoryId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.warehouseId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _warehouseId_initializers, void 0));
            this.onHandQuantity = (__runInitializers(this, _warehouseId_extraInitializers), __runInitializers(this, _onHandQuantity_initializers, void 0));
            this.availableQuantity = (__runInitializers(this, _onHandQuantity_extraInitializers), __runInitializers(this, _availableQuantity_initializers, void 0));
            this.reservedQuantity = (__runInitializers(this, _availableQuantity_extraInitializers), __runInitializers(this, _reservedQuantity_initializers, void 0));
            this.onOrderQuantity = (__runInitializers(this, _reservedQuantity_extraInitializers), __runInitializers(this, _onOrderQuantity_initializers, void 0));
            this.safetyStock = (__runInitializers(this, _onOrderQuantity_extraInitializers), __runInitializers(this, _safetyStock_initializers, void 0));
            this.reorderPoint = (__runInitializers(this, _safetyStock_extraInitializers), __runInitializers(this, _reorderPoint_initializers, void 0));
            this.isActive = (__runInitializers(this, _reorderPoint_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.lastCountDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _lastCountDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastCountDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ProductInventory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _inventoryId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inventory ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _warehouseId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warehouse ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _onHandQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'On-hand quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _availableQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Available quantity (ATP)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _reservedQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reserved quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _onOrderQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'On-order quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _safetyStock_decorators = [(0, swagger_1.ApiProperty)({ description: 'Safety stock level' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _reorderPoint_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reorder point' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _lastCountDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last count date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _inventoryId_decorators, { kind: "field", name: "inventoryId", static: false, private: false, access: { has: obj => "inventoryId" in obj, get: obj => obj.inventoryId, set: (obj, value) => { obj.inventoryId = value; } }, metadata: _metadata }, _inventoryId_initializers, _inventoryId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: obj => "warehouseId" in obj, get: obj => obj.warehouseId, set: (obj, value) => { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
        __esDecorate(null, null, _onHandQuantity_decorators, { kind: "field", name: "onHandQuantity", static: false, private: false, access: { has: obj => "onHandQuantity" in obj, get: obj => obj.onHandQuantity, set: (obj, value) => { obj.onHandQuantity = value; } }, metadata: _metadata }, _onHandQuantity_initializers, _onHandQuantity_extraInitializers);
        __esDecorate(null, null, _availableQuantity_decorators, { kind: "field", name: "availableQuantity", static: false, private: false, access: { has: obj => "availableQuantity" in obj, get: obj => obj.availableQuantity, set: (obj, value) => { obj.availableQuantity = value; } }, metadata: _metadata }, _availableQuantity_initializers, _availableQuantity_extraInitializers);
        __esDecorate(null, null, _reservedQuantity_decorators, { kind: "field", name: "reservedQuantity", static: false, private: false, access: { has: obj => "reservedQuantity" in obj, get: obj => obj.reservedQuantity, set: (obj, value) => { obj.reservedQuantity = value; } }, metadata: _metadata }, _reservedQuantity_initializers, _reservedQuantity_extraInitializers);
        __esDecorate(null, null, _onOrderQuantity_decorators, { kind: "field", name: "onOrderQuantity", static: false, private: false, access: { has: obj => "onOrderQuantity" in obj, get: obj => obj.onOrderQuantity, set: (obj, value) => { obj.onOrderQuantity = value; } }, metadata: _metadata }, _onOrderQuantity_initializers, _onOrderQuantity_extraInitializers);
        __esDecorate(null, null, _safetyStock_decorators, { kind: "field", name: "safetyStock", static: false, private: false, access: { has: obj => "safetyStock" in obj, get: obj => obj.safetyStock, set: (obj, value) => { obj.safetyStock = value; } }, metadata: _metadata }, _safetyStock_initializers, _safetyStock_extraInitializers);
        __esDecorate(null, null, _reorderPoint_decorators, { kind: "field", name: "reorderPoint", static: false, private: false, access: { has: obj => "reorderPoint" in obj, get: obj => obj.reorderPoint, set: (obj, value) => { obj.reorderPoint = value; } }, metadata: _metadata }, _reorderPoint_initializers, _reorderPoint_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _lastCountDate_decorators, { kind: "field", name: "lastCountDate", static: false, private: false, access: { has: obj => "lastCountDate" in obj, get: obj => obj.lastCountDate, set: (obj, value) => { obj.lastCountDate = value; } }, metadata: _metadata }, _lastCountDate_initializers, _lastCountDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductInventory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductInventory = _classThis;
})();
exports.ProductInventory = ProductInventory;
// ============================================================================
// UTILITY FUNCTIONS - CUSTOMER VALIDATION
// ============================================================================
/**
 * Validate customer exists and is active
 *
 * @param customerId - Customer ID to validate
 * @returns Validation result
 *
 * @example
 * const result = await validateCustomerExists('CUST-123');
 */
async function validateCustomerExists(customerId) {
    try {
        // In production, this would query actual Customer model
        // Mock validation for now
        const customerExists = true; // await Customer.findByPk(customerId)
        if (!customerExists) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.CUSTOMER,
                message: `Customer ${customerId} does not exist`,
                fieldName: 'customerId',
                errorCode: 'CUSTOMER_NOT_FOUND',
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.CUSTOMER,
            message: 'Customer exists and is valid',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Customer validation failed: ${error.message}`);
    }
}
/**
 * Validate customer is active and not on hold
 *
 * @param customerId - Customer ID to validate
 * @returns Validation result
 *
 * @example
 * const result = await validateCustomerActive('CUST-123');
 */
async function validateCustomerActive(customerId) {
    try {
        // Mock validation - in production, query Customer model
        const customer = { isActive: true, status: 'ACTIVE' };
        if (!customer.isActive || customer.status !== 'ACTIVE') {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.CUSTOMER,
                message: `Customer ${customerId} is not active`,
                fieldName: 'customerId',
                errorCode: 'CUSTOMER_INACTIVE',
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.CUSTOMER,
            message: 'Customer is active',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Customer active validation failed: ${error.message}`);
    }
}
/**
 * Validate customer credit limit
 *
 * @param context - Credit check context
 * @returns Validation result with credit check details
 *
 * @example
 * const result = await validateCustomerCreditLimit({ customerId: 'CUST-123', orderAmount: 5000 });
 */
async function validateCustomerCreditLimit(context) {
    try {
        const customerCredit = await CustomerCredit.findOne({
            where: { customerId: context.customerId },
        });
        if (!customerCredit) {
            return {
                isValid: false,
                severity: ValidationSeverity.WARNING,
                ruleType: ValidationRuleType.CUSTOMER,
                message: 'No credit limit established for customer',
                errorCode: 'NO_CREDIT_LIMIT',
                creditCheckResult: CreditCheckResult.MANUAL_REVIEW,
            };
        }
        if (customerCredit.isOnHold) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.CUSTOMER,
                message: 'Customer is on credit hold',
                errorCode: 'CREDIT_HOLD',
                creditCheckResult: CreditCheckResult.ON_HOLD,
            };
        }
        const totalExposure = customerCredit.outstandingBalance + context.orderAmount;
        if (totalExposure > customerCredit.creditLimit) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.CUSTOMER,
                message: `Order amount exceeds credit limit. Available: ${customerCredit.availableCredit}, Required: ${context.orderAmount}`,
                errorCode: 'CREDIT_LIMIT_EXCEEDED',
                creditCheckResult: CreditCheckResult.OVER_LIMIT,
                metadata: {
                    creditLimit: customerCredit.creditLimit,
                    availableCredit: customerCredit.availableCredit,
                    outstandingBalance: customerCredit.outstandingBalance,
                    requestedAmount: context.orderAmount,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.CUSTOMER,
            message: 'Credit check passed',
            creditCheckResult: CreditCheckResult.APPROVED,
            metadata: {
                availableCredit: customerCredit.availableCredit,
            },
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Credit limit validation failed: ${error.message}`);
    }
}
/**
 * Validate customer is not blacklisted
 *
 * @param customerId - Customer ID
 * @returns Validation result
 *
 * @example
 * const result = await validateCustomerNotBlacklisted('CUST-123');
 */
async function validateCustomerNotBlacklisted(customerId) {
    try {
        // Mock blacklist check - in production, query blacklist table
        const isBlacklisted = false;
        if (isBlacklisted) {
            return {
                isValid: false,
                severity: ValidationSeverity.CRITICAL,
                ruleType: ValidationRuleType.CUSTOMER,
                message: 'Customer is blacklisted',
                errorCode: 'CUSTOMER_BLACKLISTED',
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.CUSTOMER,
            message: 'Customer is not blacklisted',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Blacklist validation failed: ${error.message}`);
    }
}
/**
 * Validate customer payment history
 *
 * @param customerId - Customer ID
 * @returns Validation result with payment history score
 *
 * @example
 * const result = await validateCustomerPaymentHistory('CUST-123');
 */
async function validateCustomerPaymentHistory(customerId) {
    try {
        // Mock payment history check - in production, calculate from payment records
        const paymentScore = 85; // 0-100 scale
        const daysPayableOutstanding = 35;
        const latePaymentCount = 2;
        if (paymentScore < 50) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.CUSTOMER,
                message: 'Poor payment history - manual review required',
                errorCode: 'POOR_PAYMENT_HISTORY',
                metadata: {
                    paymentScore,
                    daysPayableOutstanding,
                    latePaymentCount,
                },
            };
        }
        if (paymentScore < 70) {
            return {
                isValid: true,
                severity: ValidationSeverity.WARNING,
                ruleType: ValidationRuleType.CUSTOMER,
                message: 'Fair payment history - monitor closely',
                metadata: {
                    paymentScore,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.CUSTOMER,
            message: 'Good payment history',
            metadata: {
                paymentScore,
            },
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Payment history validation failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - PRODUCT VALIDATION
// ============================================================================
/**
 * Validate product exists and is active
 *
 * @param productId - Product ID to validate
 * @returns Validation result
 *
 * @example
 * const result = await validateProductExists('PROD-123');
 */
async function validateProductExists(productId) {
    try {
        // Mock product validation - in production, query Product model
        const productExists = true;
        if (!productExists) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PRODUCT,
                message: `Product ${productId} does not exist`,
                fieldName: 'productId',
                errorCode: 'PRODUCT_NOT_FOUND',
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PRODUCT,
            message: 'Product exists',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Product validation failed: ${error.message}`);
    }
}
/**
 * Validate product is not discontinued
 *
 * @param productId - Product ID
 * @returns Validation result
 *
 * @example
 * const result = await validateProductNotDiscontinued('PROD-123');
 */
async function validateProductNotDiscontinued(productId) {
    try {
        // Mock discontinuation check
        const product = { isDiscontinued: false, discontinuedDate: null };
        if (product.isDiscontinued) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PRODUCT,
                message: `Product ${productId} is discontinued`,
                errorCode: 'PRODUCT_DISCONTINUED',
                metadata: {
                    discontinuedDate: product.discontinuedDate,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PRODUCT,
            message: 'Product is active',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Product discontinued check failed: ${error.message}`);
    }
}
/**
 * Validate product quantity constraints (min/max order qty)
 *
 * @param productId - Product ID
 * @param quantity - Ordered quantity
 * @returns Validation result
 *
 * @example
 * const result = await validateProductQuantityConstraints('PROD-123', 50);
 */
async function validateProductQuantityConstraints(productId, quantity) {
    try {
        // Mock product constraints
        const product = {
            minimumOrderQuantity: 10,
            maximumOrderQuantity: 1000,
            orderQuantityMultiple: 5,
        };
        if (quantity < product.minimumOrderQuantity) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PRODUCT,
                message: `Quantity ${quantity} is below minimum order quantity of ${product.minimumOrderQuantity}`,
                errorCode: 'QUANTITY_BELOW_MINIMUM',
                metadata: {
                    minimumOrderQuantity: product.minimumOrderQuantity,
                },
            };
        }
        if (quantity > product.maximumOrderQuantity) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PRODUCT,
                message: `Quantity ${quantity} exceeds maximum order quantity of ${product.maximumOrderQuantity}`,
                errorCode: 'QUANTITY_EXCEEDS_MAXIMUM',
                metadata: {
                    maximumOrderQuantity: product.maximumOrderQuantity,
                },
            };
        }
        if (quantity % product.orderQuantityMultiple !== 0) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PRODUCT,
                message: `Quantity must be a multiple of ${product.orderQuantityMultiple}`,
                errorCode: 'INVALID_QUANTITY_MULTIPLE',
                metadata: {
                    orderQuantityMultiple: product.orderQuantityMultiple,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PRODUCT,
            message: 'Quantity constraints satisfied',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Quantity constraint validation failed: ${error.message}`);
    }
}
/**
 * Validate product is not restricted for customer
 *
 * @param productId - Product ID
 * @param customerId - Customer ID
 * @returns Validation result
 *
 * @example
 * const result = await validateProductNotRestricted('PROD-123', 'CUST-456');
 */
async function validateProductNotRestricted(productId, customerId) {
    try {
        // Mock restriction check - in production, query product restrictions table
        const isRestricted = false;
        if (isRestricted) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PRODUCT,
                message: 'Product is restricted for this customer',
                errorCode: 'PRODUCT_RESTRICTED',
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PRODUCT,
            message: 'Product is not restricted',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Product restriction validation failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - PRICING VALIDATION
// ============================================================================
/**
 * Validate pricing is within acceptable range
 *
 * @param productId - Product ID
 * @param unitPrice - Quoted unit price
 * @returns Validation result
 *
 * @example
 * const result = await validatePricing('PROD-123', 99.99);
 */
async function validatePricing(productId, unitPrice) {
    try {
        // Mock pricing validation
        const product = {
            listPrice: 100.00,
            minimumPrice: 80.00,
            maximumDiscountPercent: 25,
        };
        const discountPercent = ((product.listPrice - unitPrice) / product.listPrice) * 100;
        if (unitPrice < product.minimumPrice) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PRICING,
                message: `Price ${unitPrice} is below minimum allowed price of ${product.minimumPrice}`,
                errorCode: 'PRICE_BELOW_MINIMUM',
                metadata: {
                    minimumPrice: product.minimumPrice,
                    quotedPrice: unitPrice,
                },
            };
        }
        if (discountPercent > product.maximumDiscountPercent) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PRICING,
                message: `Discount of ${discountPercent.toFixed(2)}% exceeds maximum allowed of ${product.maximumDiscountPercent}%`,
                errorCode: 'DISCOUNT_EXCEEDS_MAXIMUM',
                metadata: {
                    maximumDiscountPercent: product.maximumDiscountPercent,
                    actualDiscountPercent: discountPercent,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PRICING,
            message: 'Pricing is valid',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Pricing validation failed: ${error.message}`);
    }
}
/**
 * Validate discount authorization
 *
 * @param discountPercent - Discount percentage
 * @param userId - User ID requesting discount
 * @returns Validation result
 *
 * @example
 * const result = await validateDiscountAuthorization(15, 'user-123');
 */
async function validateDiscountAuthorization(discountPercent, userId) {
    try {
        // Mock authorization levels
        const userDiscountAuthority = 10; // Max discount % user can authorize
        if (discountPercent > userDiscountAuthority) {
            return {
                isValid: false,
                severity: ValidationSeverity.WARNING,
                ruleType: ValidationRuleType.PRICING,
                message: `Discount of ${discountPercent}% requires manager approval`,
                errorCode: 'DISCOUNT_REQUIRES_APPROVAL',
                metadata: {
                    userAuthority: userDiscountAuthority,
                    requestedDiscount: discountPercent,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PRICING,
            message: 'Discount is authorized',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Discount authorization validation failed: ${error.message}`);
    }
}
/**
 * Validate line item totals match calculated amounts
 *
 * @param items - Order line items
 * @returns Validation result
 *
 * @example
 * const result = validateLineItemTotals(orderItems);
 */
function validateLineItemTotals(items) {
    try {
        for (const item of items) {
            const calculatedTotal = item.quantity * item.unitPrice * (1 - (item.discountPercent || 0) / 100);
            const tolerance = 0.01; // Allow 1 cent rounding difference
            if (Math.abs(calculatedTotal - item.lineTotal) > tolerance) {
                return {
                    isValid: false,
                    severity: ValidationSeverity.ERROR,
                    ruleType: ValidationRuleType.PRICING,
                    message: `Line ${item.lineNumber} total mismatch. Expected: ${calculatedTotal.toFixed(2)}, Got: ${item.lineTotal.toFixed(2)}`,
                    errorCode: 'LINE_TOTAL_MISMATCH',
                    fieldName: `items[${item.lineNumber}].lineTotal`,
                    metadata: {
                        lineNumber: item.lineNumber,
                        calculatedTotal,
                        providedTotal: item.lineTotal,
                    },
                };
            }
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PRICING,
            message: 'All line totals are correct',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Line total validation failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - INVENTORY VALIDATION (ATP)
// ============================================================================
/**
 * Check Available-to-Promise (ATP) for product
 *
 * @param productId - Product ID
 * @param requestedQuantity - Requested quantity
 * @param warehouseId - Warehouse ID (optional)
 * @returns ATP check result
 *
 * @example
 * const result = await checkProductATP('PROD-123', 50, 'WH-001');
 */
async function checkProductATP(productId, requestedQuantity, warehouseId) {
    try {
        const whereClause = {
            productId,
            isActive: true,
        };
        if (warehouseId) {
            whereClause.warehouseId = warehouseId;
        }
        const inventoryRecords = await ProductInventory.findAll({
            where: whereClause,
            order: [['availableQuantity', 'DESC']],
        });
        if (inventoryRecords.length === 0) {
            return {
                productId,
                requestedQuantity,
                availableQuantity: 0,
                promisedQuantity: 0,
                backorderQuantity: requestedQuantity,
                promiseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            };
        }
        let totalAvailable = 0;
        let selectedWarehouse;
        for (const record of inventoryRecords) {
            totalAvailable += record.availableQuantity;
            if (record.availableQuantity >= requestedQuantity && !selectedWarehouse) {
                selectedWarehouse = record.warehouseId;
            }
        }
        const promisedQuantity = Math.min(totalAvailable, requestedQuantity);
        const backorderQuantity = Math.max(0, requestedQuantity - promisedQuantity);
        return {
            productId,
            requestedQuantity,
            availableQuantity: totalAvailable,
            promisedQuantity,
            backorderQuantity,
            promiseDate: backorderQuantity > 0 ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : new Date(),
            warehouseId: selectedWarehouse,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`ATP check failed: ${error.message}`);
    }
}
/**
 * Validate inventory availability for entire order
 *
 * @param items - Order line items
 * @returns Validation result with ATP details
 *
 * @example
 * const result = await validateInventoryAvailability(orderItems);
 */
async function validateInventoryAvailability(items) {
    try {
        const atpResults = [];
        let hasBackorders = false;
        for (const item of items) {
            const atpResult = await checkProductATP(item.productId, item.quantity);
            atpResults.push(atpResult);
            if (atpResult.backorderQuantity > 0) {
                hasBackorders = true;
            }
        }
        if (hasBackorders) {
            return {
                isValid: true,
                severity: ValidationSeverity.WARNING,
                ruleType: ValidationRuleType.INVENTORY,
                message: 'Some items have insufficient inventory and will be backordered',
                errorCode: 'PARTIAL_BACKORDER',
                metadata: {
                    atpResults,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.INVENTORY,
            message: 'All items are available',
            metadata: {
                atpResults,
            },
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Inventory validation failed: ${error.message}`);
    }
}
/**
 * Validate inventory reservation
 *
 * @param productId - Product ID
 * @param quantity - Quantity to reserve
 * @param warehouseId - Warehouse ID
 * @param transaction - Sequelize transaction
 * @returns Validation result
 *
 * @example
 * const result = await validateInventoryReservation('PROD-123', 10, 'WH-001', t);
 */
async function validateInventoryReservation(productId, quantity, warehouseId, transaction) {
    try {
        const inventory = await ProductInventory.findOne({
            where: {
                productId,
                warehouseId,
                isActive: true,
            },
            lock: transaction?.LOCK.UPDATE,
            transaction,
        });
        if (!inventory) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.INVENTORY,
                message: 'Product not found in warehouse inventory',
                errorCode: 'INVENTORY_NOT_FOUND',
            };
        }
        if (inventory.availableQuantity < quantity) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.INVENTORY,
                message: `Insufficient inventory. Available: ${inventory.availableQuantity}, Requested: ${quantity}`,
                errorCode: 'INSUFFICIENT_INVENTORY',
                metadata: {
                    availableQuantity: inventory.availableQuantity,
                    requestedQuantity: quantity,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.INVENTORY,
            message: 'Inventory can be reserved',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Inventory reservation validation failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - ADDRESS VALIDATION
// ============================================================================
/**
 * Validate address format and completeness
 *
 * @param address - Address to validate
 * @returns Validation result
 *
 * @example
 * const result = validateAddressFormat(shippingAddress);
 */
function validateAddressFormat(address) {
    try {
        const errors = [];
        if (!address.addressLine1 || address.addressLine1.trim().length === 0) {
            errors.push('Address line 1 is required');
        }
        if (!address.city || address.city.trim().length === 0) {
            errors.push('City is required');
        }
        if (!address.stateProvince || address.stateProvince.trim().length === 0) {
            errors.push('State/Province is required');
        }
        if (!address.postalCode || address.postalCode.trim().length === 0) {
            errors.push('Postal code is required');
        }
        if (!address.country || address.country.length !== 2) {
            errors.push('Valid 2-letter country code is required');
        }
        if (errors.length > 0) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.ADDRESS,
                message: errors.join('; '),
                errorCode: 'INVALID_ADDRESS_FORMAT',
                metadata: {
                    errors,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.ADDRESS,
            message: 'Address format is valid',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Address format validation failed: ${error.message}`);
    }
}
/**
 * Validate postal code format for country
 *
 * @param postalCode - Postal code
 * @param country - Country code (ISO 2-letter)
 * @returns Validation result
 *
 * @example
 * const result = validatePostalCode('12345', 'US');
 */
function validatePostalCode(postalCode, country) {
    try {
        const postalCodePatterns = {
            US: /^\d{5}(-\d{4})?$/,
            CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
            UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
            DE: /^\d{5}$/,
            FR: /^\d{5}$/,
            JP: /^\d{3}-\d{4}$/,
            AU: /^\d{4}$/,
        };
        const pattern = postalCodePatterns[country.toUpperCase()];
        if (!pattern) {
            return {
                isValid: true,
                severity: ValidationSeverity.INFO,
                ruleType: ValidationRuleType.ADDRESS,
                message: 'Postal code pattern not available for country',
            };
        }
        if (!pattern.test(postalCode)) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.ADDRESS,
                message: `Invalid postal code format for ${country}`,
                errorCode: 'INVALID_POSTAL_CODE',
                fieldName: 'postalCode',
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.ADDRESS,
            message: 'Postal code format is valid',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Postal code validation failed: ${error.message}`);
    }
}
/**
 * Validate address is deliverable
 *
 * @param address - Address to validate
 * @returns Validation result
 *
 * @example
 * const result = await validateAddressDeliverable(shippingAddress);
 */
async function validateAddressDeliverable(address) {
    try {
        // Mock deliverability check - in production, integrate with address validation service
        const isDeliverable = true;
        const isPOBox = address.isPoBox || /P\.?O\.?\s*BOX/i.test(address.addressLine1);
        if (isPOBox) {
            return {
                isValid: true,
                severity: ValidationSeverity.WARNING,
                ruleType: ValidationRuleType.ADDRESS,
                message: 'Address is a PO Box - some shipping methods may not be available',
                errorCode: 'PO_BOX_ADDRESS',
                metadata: {
                    isPOBox: true,
                },
            };
        }
        if (!isDeliverable) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.ADDRESS,
                message: 'Address is not deliverable',
                errorCode: 'UNDELIVERABLE_ADDRESS',
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.ADDRESS,
            message: 'Address is deliverable',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Address deliverability validation failed: ${error.message}`);
    }
}
/**
 * Validate international shipping allowed
 *
 * @param destinationCountry - Destination country code
 * @param productIds - Array of product IDs
 * @returns Validation result
 *
 * @example
 * const result = await validateInternationalShipping('CA', ['PROD-1', 'PROD-2']);
 */
async function validateInternationalShipping(destinationCountry, productIds) {
    try {
        // Mock international shipping validation
        const domesticCountry = 'US';
        const isInternational = destinationCountry !== domesticCountry;
        if (isInternational) {
            // Check if products can be shipped internationally
            const restrictedProducts = []; // In production, query product restrictions
            if (restrictedProducts.length > 0) {
                return {
                    isValid: false,
                    severity: ValidationSeverity.ERROR,
                    ruleType: ValidationRuleType.SHIPPING,
                    message: `Some products cannot be shipped internationally: ${restrictedProducts.join(', ')}`,
                    errorCode: 'INTERNATIONAL_SHIPPING_RESTRICTED',
                    metadata: {
                        restrictedProducts,
                    },
                };
            }
            return {
                isValid: true,
                severity: ValidationSeverity.WARNING,
                ruleType: ValidationRuleType.SHIPPING,
                message: 'International shipment - additional fees and customs may apply',
                metadata: {
                    isInternational: true,
                    destinationCountry,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.SHIPPING,
            message: 'Domestic shipment',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`International shipping validation failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - PAYMENT VALIDATION
// ============================================================================
/**
 * Validate payment method is allowed for customer
 *
 * @param customerId - Customer ID
 * @param paymentMethod - Payment method code
 * @returns Validation result
 *
 * @example
 * const result = await validatePaymentMethod('CUST-123', 'CREDIT_CARD');
 */
async function validatePaymentMethod(customerId, paymentMethod) {
    try {
        // Mock payment method validation
        const allowedMethods = ['CREDIT_CARD', 'NET_30', 'NET_60', 'PREPAID'];
        if (!allowedMethods.includes(paymentMethod)) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PAYMENT,
                message: `Payment method ${paymentMethod} is not allowed for this customer`,
                errorCode: 'PAYMENT_METHOD_NOT_ALLOWED',
                metadata: {
                    allowedMethods,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PAYMENT,
            message: 'Payment method is valid',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Payment method validation failed: ${error.message}`);
    }
}
/**
 * Validate payment terms eligibility
 *
 * @param customerId - Customer ID
 * @param paymentTerms - Requested payment terms
 * @returns Validation result
 *
 * @example
 * const result = await validatePaymentTerms('CUST-123', 'NET_60');
 */
async function validatePaymentTerms(customerId, paymentTerms) {
    try {
        // Mock payment terms validation
        const customerCredit = await CustomerCredit.findOne({
            where: { customerId },
        });
        if (!customerCredit) {
            if (paymentTerms !== 'PREPAID' && paymentTerms !== 'COD') {
                return {
                    isValid: false,
                    severity: ValidationSeverity.ERROR,
                    ruleType: ValidationRuleType.PAYMENT,
                    message: 'Customer not approved for credit terms',
                    errorCode: 'CREDIT_TERMS_NOT_APPROVED',
                };
            }
        }
        if (customerCredit?.isOnHold && paymentTerms !== 'PREPAID') {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PAYMENT,
                message: 'Customer on credit hold - prepayment required',
                errorCode: 'PREPAYMENT_REQUIRED',
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PAYMENT,
            message: 'Payment terms are valid',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Payment terms validation failed: ${error.message}`);
    }
}
/**
 * Validate payment amount matches order total
 *
 * @param paymentAmount - Payment amount
 * @param orderTotal - Order total
 * @returns Validation result
 *
 * @example
 * const result = validatePaymentAmount(1000.00, 1000.00);
 */
function validatePaymentAmount(paymentAmount, orderTotal) {
    try {
        const tolerance = 0.01; // Allow 1 cent rounding difference
        if (Math.abs(paymentAmount - orderTotal) > tolerance) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.PAYMENT,
                message: `Payment amount ${paymentAmount} does not match order total ${orderTotal}`,
                errorCode: 'PAYMENT_AMOUNT_MISMATCH',
                metadata: {
                    paymentAmount,
                    orderTotal,
                    difference: paymentAmount - orderTotal,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.PAYMENT,
            message: 'Payment amount is correct',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Payment amount validation failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - BUSINESS RULES & CONSTRAINTS
// ============================================================================
/**
 * Execute business rule engine for order validation
 *
 * @param context - Validation context
 * @returns Array of validation results
 *
 * @example
 * const results = await executeBusinessRules(validationContext);
 */
async function executeBusinessRules(context) {
    try {
        const rules = await ValidationRule.findAll({
            where: {
                isActive: true,
            },
            order: [['priority', 'DESC']],
        });
        const results = [];
        for (const rule of rules) {
            const ruleResult = evaluateBusinessRule(rule, context);
            if (!ruleResult.isValid || ruleResult.severity !== ValidationSeverity.INFO) {
                results.push(ruleResult);
            }
        }
        return results;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Business rules execution failed: ${error.message}`);
    }
}
/**
 * Evaluate single business rule
 *
 * @param rule - Business rule
 * @param context - Validation context
 * @returns Validation result
 *
 * @example
 * const result = evaluateBusinessRule(rule, context);
 */
function evaluateBusinessRule(rule, context) {
    try {
        const conditionMet = evaluateRuleCondition(rule.condition, context);
        if (conditionMet) {
            return {
                isValid: rule.action.actionType !== 'BLOCK',
                severity: rule.severity,
                ruleType: rule.ruleType,
                message: rule.action.message,
                errorCode: rule.errorCode,
                metadata: {
                    ruleId: rule.ruleId,
                    ruleName: rule.ruleName,
                    actionType: rule.action.actionType,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: rule.ruleType,
            message: 'Rule condition not met',
        };
    }
    catch (error) {
        return {
            isValid: false,
            severity: ValidationSeverity.ERROR,
            ruleType: ValidationRuleType.BUSINESS_RULE,
            message: `Rule evaluation error: ${error.message}`,
            errorCode: 'RULE_EVALUATION_ERROR',
        };
    }
}
/**
 * Evaluate rule condition against context
 *
 * @param condition - Rule condition
 * @param context - Validation context
 * @returns True if condition is met
 *
 * @example
 * const met = evaluateRuleCondition(condition, context);
 */
function evaluateRuleCondition(condition, context) {
    try {
        const contextValue = getNestedValue(context, condition.field);
        const conditionValue = condition.value;
        let result = false;
        switch (condition.operator) {
            case RuleOperator.EQUALS:
                result = contextValue === conditionValue;
                break;
            case RuleOperator.NOT_EQUALS:
                result = contextValue !== conditionValue;
                break;
            case RuleOperator.GREATER_THAN:
                result = Number(contextValue) > Number(conditionValue);
                break;
            case RuleOperator.GREATER_THAN_OR_EQUAL:
                result = Number(contextValue) >= Number(conditionValue);
                break;
            case RuleOperator.LESS_THAN:
                result = Number(contextValue) < Number(conditionValue);
                break;
            case RuleOperator.LESS_THAN_OR_EQUAL:
                result = Number(contextValue) <= Number(conditionValue);
                break;
            case RuleOperator.BETWEEN:
                if (Array.isArray(conditionValue) && conditionValue.length === 2) {
                    result = Number(contextValue) >= Number(conditionValue[0]) &&
                        Number(contextValue) <= Number(conditionValue[1]);
                }
                break;
            case RuleOperator.IN:
                result = Array.isArray(conditionValue) && conditionValue.includes(contextValue);
                break;
            case RuleOperator.NOT_IN:
                result = Array.isArray(conditionValue) && !conditionValue.includes(contextValue);
                break;
            case RuleOperator.CONTAINS:
                result = String(contextValue).includes(String(conditionValue));
                break;
            case RuleOperator.REGEX:
                result = new RegExp(String(conditionValue)).test(String(contextValue));
                break;
            default:
                result = false;
        }
        // Handle nested conditions
        if (condition.nestedConditions && condition.nestedConditions.length > 0) {
            const nestedResults = condition.nestedConditions.map(nc => evaluateRuleCondition(nc, context));
            if (condition.logicalOperator === 'AND') {
                result = result && nestedResults.every(r => r);
            }
            else if (condition.logicalOperator === 'OR') {
                result = result || nestedResults.some(r => r);
            }
            else if (condition.logicalOperator === 'NOT') {
                result = result && !nestedResults.some(r => r);
            }
        }
        return result;
    }
    catch (error) {
        return false;
    }
}
/**
 * Get nested value from object by path
 *
 * @param obj - Object to query
 * @param path - Dot-notation path (e.g., 'shippingAddress.country')
 * @returns Value at path
 *
 * @example
 * const value = getNestedValue(context, 'shippingAddress.country');
 */
function getNestedValue(obj, path) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        }
        else {
            return undefined;
        }
    }
    return current;
}
/**
 * Validate order does not exceed customer order limits
 *
 * @param customerId - Customer ID
 * @param orderTotal - Order total amount
 * @returns Validation result
 *
 * @example
 * const result = await validateOrderLimits('CUST-123', 10000);
 */
async function validateOrderLimits(customerId, orderTotal) {
    try {
        // Mock order limits validation
        const customerLimits = {
            maxOrderAmount: 50000,
            maxDailyOrderAmount: 100000,
            maxMonthlyOrderAmount: 500000,
        };
        if (orderTotal > customerLimits.maxOrderAmount) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.CONSTRAINT,
                message: `Order amount ${orderTotal} exceeds maximum order limit of ${customerLimits.maxOrderAmount}`,
                errorCode: 'ORDER_LIMIT_EXCEEDED',
                metadata: {
                    maxOrderAmount: customerLimits.maxOrderAmount,
                    orderTotal,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.CONSTRAINT,
            message: 'Order limits validated',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Order limits validation failed: ${error.message}`);
    }
}
/**
 * Validate cross-field dependencies (e.g., shipping method requires address type)
 *
 * @param context - Validation context
 * @returns Validation result
 *
 * @example
 * const result = validateCrossFieldDependencies(context);
 */
function validateCrossFieldDependencies(context) {
    try {
        const errors = [];
        // Example: Express shipping requires non-PO Box address
        if (context.metadata?.shippingMethod === 'EXPRESS' || context.metadata?.shippingMethod === 'OVERNIGHT') {
            if (context.shippingAddress?.isPoBox) {
                errors.push('Express/Overnight shipping cannot be used with PO Box addresses');
            }
        }
        // Example: International orders require additional documentation
        if (context.shippingAddress?.country !== 'US' && !context.metadata?.customsDocuments) {
            errors.push('International orders require customs documentation');
        }
        if (errors.length > 0) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.CROSS_FIELD,
                message: errors.join('; '),
                errorCode: 'CROSS_FIELD_VALIDATION_FAILED',
                metadata: {
                    errors,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.CROSS_FIELD,
            message: 'Cross-field validation passed',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Cross-field validation failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - COMPLIANCE & FRAUD
// ============================================================================
/**
 * Validate export control compliance
 *
 * @param destinationCountry - Destination country code
 * @param productIds - Array of product IDs
 * @returns Validation result
 *
 * @example
 * const result = await validateExportControl('IR', ['PROD-123']);
 */
async function validateExportControl(destinationCountry, productIds) {
    try {
        // Mock export control validation
        const sanctionedCountries = ['IR', 'KP', 'SY', 'CU'];
        const controlledProducts = [];
        if (sanctionedCountries.includes(destinationCountry.toUpperCase())) {
            return {
                isValid: false,
                severity: ValidationSeverity.CRITICAL,
                ruleType: ValidationRuleType.COMPLIANCE,
                message: `Shipment to ${destinationCountry} is restricted due to sanctions`,
                errorCode: 'SANCTIONED_COUNTRY',
                metadata: {
                    destinationCountry,
                },
            };
        }
        if (controlledProducts.length > 0) {
            return {
                isValid: false,
                severity: ValidationSeverity.CRITICAL,
                ruleType: ValidationRuleType.COMPLIANCE,
                message: 'Some products require export license',
                errorCode: 'EXPORT_LICENSE_REQUIRED',
                metadata: {
                    controlledProducts,
                },
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.COMPLIANCE,
            message: 'Export control validation passed',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Export control validation failed: ${error.message}`);
    }
}
/**
 * Perform fraud risk assessment
 *
 * @param context - Validation context
 * @returns Fraud check result
 *
 * @example
 * const result = await performFraudCheck(context);
 */
async function performFraudCheck(context) {
    try {
        let riskScore = 0;
        const flags = [];
        const recommendations = [];
        // Check for high-value order
        if (context.orderTotal > 10000) {
            riskScore += 20;
            flags.push('High-value order');
        }
        // Check for address mismatch
        if (context.billingAddress && context.shippingAddress) {
            if (context.billingAddress.country !== context.shippingAddress.country) {
                riskScore += 30;
                flags.push('Billing and shipping countries differ');
            }
        }
        // Check for new customer
        // In production, check customer history
        const isNewCustomer = false;
        if (isNewCustomer) {
            riskScore += 15;
            flags.push('New customer');
            recommendations.push('Verify customer identity');
        }
        // Determine risk level
        let riskLevel;
        if (riskScore >= 75) {
            riskLevel = FraudRiskLevel.CRITICAL;
            recommendations.push('Block order and conduct manual review');
        }
        else if (riskScore >= 50) {
            riskLevel = FraudRiskLevel.HIGH;
            recommendations.push('Require manager approval');
        }
        else if (riskScore >= 25) {
            riskLevel = FraudRiskLevel.MEDIUM;
            recommendations.push('Enhanced verification recommended');
        }
        else {
            riskLevel = FraudRiskLevel.LOW;
        }
        return {
            riskLevel,
            riskScore,
            flags,
            recommendations,
            requiresManualReview: riskScore >= 50,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Fraud check failed: ${error.message}`);
    }
}
/**
 * Validate tax exemption certificate
 *
 * @param customerId - Customer ID
 * @param exemptionCertNumber - Tax exemption certificate number
 * @param state - State/province where exemption applies
 * @returns Validation result
 *
 * @example
 * const result = await validateTaxExemption('CUST-123', 'TX-12345', 'TX');
 */
async function validateTaxExemption(customerId, exemptionCertNumber, state) {
    try {
        // Mock tax exemption validation
        // In production, verify against tax exemption database
        const exemptionValid = true;
        const exemptionExpired = false;
        if (!exemptionValid) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.COMPLIANCE,
                message: 'Tax exemption certificate is not valid',
                errorCode: 'INVALID_TAX_EXEMPTION',
            };
        }
        if (exemptionExpired) {
            return {
                isValid: false,
                severity: ValidationSeverity.ERROR,
                ruleType: ValidationRuleType.COMPLIANCE,
                message: 'Tax exemption certificate has expired',
                errorCode: 'TAX_EXEMPTION_EXPIRED',
            };
        }
        return {
            isValid: true,
            severity: ValidationSeverity.INFO,
            ruleType: ValidationRuleType.COMPLIANCE,
            message: 'Tax exemption is valid',
            metadata: {
                exemptionCertNumber,
                state,
            },
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Tax exemption validation failed: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - COMPREHENSIVE ORDER VALIDATION
// ============================================================================
/**
 * Perform comprehensive order validation
 *
 * @param orderData - Order validation DTO
 * @returns Array of all validation results
 *
 * @example
 * const results = await validateCompleteOrder(orderDto);
 */
async function validateCompleteOrder(orderData) {
    try {
        const results = [];
        // Customer validations
        results.push(await validateCustomerExists(orderData.customerId));
        results.push(await validateCustomerActive(orderData.customerId));
        results.push(await validateCustomerNotBlacklisted(orderData.customerId));
        // Calculate order total
        const orderTotal = orderData.items.reduce((sum, item) => sum + item.lineTotal, 0);
        // Credit check
        if (orderTotal > 0) {
            const creditCheck = await validateCustomerCreditLimit({
                customerId: orderData.customerId,
                orderAmount: orderTotal,
                currency: orderData.currency || 'USD',
            });
            results.push(creditCheck);
        }
        // Product and inventory validations
        for (const item of orderData.items) {
            results.push(await validateProductExists(item.productId));
            results.push(await validateProductNotDiscontinued(item.productId));
            results.push(await validateProductQuantityConstraints(item.productId, item.quantity));
            results.push(await validatePricing(item.productId, item.unitPrice));
        }
        // Inventory availability
        results.push(await validateInventoryAvailability(orderData.items));
        // Line totals validation
        results.push(validateLineItemTotals(orderData.items));
        // Address validations
        if (orderData.shippingAddress) {
            results.push(validateAddressFormat(orderData.shippingAddress));
            results.push(validatePostalCode(orderData.shippingAddress.postalCode, orderData.shippingAddress.country));
            results.push(await validateAddressDeliverable(orderData.shippingAddress));
        }
        if (orderData.billingAddress) {
            results.push(validateAddressFormat(orderData.billingAddress));
        }
        // Payment validations
        if (orderData.paymentMethod) {
            results.push(await validatePaymentMethod(orderData.customerId, orderData.paymentMethod));
        }
        // Business rules
        const context = {
            customerId: orderData.customerId,
            orderDate: new Date(),
            orderTotal,
            currency: orderData.currency || 'USD',
            shippingAddress: orderData.shippingAddress,
            billingAddress: orderData.billingAddress,
            paymentMethod: orderData.paymentMethod,
            items: orderData.items,
        };
        const businessRuleResults = await executeBusinessRules(context);
        results.push(...businessRuleResults);
        // Fraud check
        const fraudCheck = await performFraudCheck(context);
        if (fraudCheck.requiresManualReview) {
            results.push({
                isValid: false,
                severity: ValidationSeverity.WARNING,
                ruleType: ValidationRuleType.COMPLIANCE,
                message: `Fraud risk level: ${fraudCheck.riskLevel}. ${fraudCheck.recommendations.join('; ')}`,
                errorCode: 'FRAUD_RISK_DETECTED',
                metadata: fraudCheck,
            });
        }
        return results;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Complete order validation failed: ${error.message}`);
    }
}
/**
 * Create validation log entry
 *
 * @param result - Validation result
 * @param orderId - Order ID (optional)
 * @param customerId - Customer ID (optional)
 * @returns Created validation log
 *
 * @example
 * const log = await createValidationLog(validationResult, 'ORD-123', 'CUST-456');
 */
async function createValidationLog(result, orderId, customerId) {
    try {
        const log = await ValidationLog.create({
            orderId,
            customerId,
            ruleType: result.ruleType,
            validationStatus: result.isValid ? ValidationStatus.PASSED : ValidationStatus.FAILED,
            severity: result.severity,
            message: result.message,
            fieldName: result.fieldName,
            errorCode: result.errorCode,
            validationData: result.metadata,
        });
        return log;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create validation log: ${error.message}`);
    }
}
/**
 * Get validation summary for order
 *
 * @param validationResults - Array of validation results
 * @returns Validation summary with counts and overall status
 *
 * @example
 * const summary = getValidationSummary(results);
 */
function getValidationSummary(validationResults) {
    const errors = validationResults.filter(r => !r.isValid && r.severity === ValidationSeverity.ERROR);
    const criticals = validationResults.filter(r => !r.isValid && r.severity === ValidationSeverity.CRITICAL);
    const warnings = validationResults.filter(r => r.severity === ValidationSeverity.WARNING);
    const passed = validationResults.filter(r => r.isValid);
    let overallStatus;
    if (errors.length > 0 || criticals.length > 0) {
        overallStatus = 'FAILED';
    }
    else if (warnings.length > 0) {
        overallStatus = 'WARNING';
    }
    else {
        overallStatus = 'PASSED';
    }
    return {
        overallStatus,
        totalChecks: validationResults.length,
        passed: passed.length,
        failed: errors.length + criticals.length,
        warnings: warnings.length,
        errors: [...errors, ...criticals],
        warnings_list: warnings,
    };
}
//# sourceMappingURL=order-validation-rules-kit.js.map