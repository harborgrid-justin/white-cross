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
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Validation rule types
 */
export declare enum ValidationRuleType {
    CUSTOMER = "CUSTOMER",
    PRODUCT = "PRODUCT",
    PRICING = "PRICING",
    INVENTORY = "INVENTORY",
    ADDRESS = "ADDRESS",
    PAYMENT = "PAYMENT",
    SHIPPING = "SHIPPING",
    BUSINESS_RULE = "BUSINESS_RULE",
    CROSS_FIELD = "CROSS_FIELD",
    CONSTRAINT = "CONSTRAINT",
    DATA_INTEGRITY = "DATA_INTEGRITY",
    COMPLIANCE = "COMPLIANCE"
}
/**
 * Validation severity levels
 */
export declare enum ValidationSeverity {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    CRITICAL = "CRITICAL"
}
/**
 * Validation status
 */
export declare enum ValidationStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    PASSED = "PASSED",
    FAILED = "FAILED",
    PARTIAL = "PARTIAL"
}
/**
 * Customer validation types
 */
export declare enum CustomerValidationType {
    EXISTS = "EXISTS",
    ACTIVE = "ACTIVE",
    CREDIT_LIMIT = "CREDIT_LIMIT",
    CREDIT_HOLD = "CREDIT_HOLD",
    BLACKLIST = "BLACKLIST",
    FRAUD_SCORE = "FRAUD_SCORE",
    PAYMENT_HISTORY = "PAYMENT_HISTORY",
    KYC_STATUS = "KYC_STATUS"
}
/**
 * Product validation types
 */
export declare enum ProductValidationType {
    EXISTS = "EXISTS",
    ACTIVE = "ACTIVE",
    DISCONTINUED = "DISCONTINUED",
    RESTRICTED = "RESTRICTED",
    MINIMUM_ORDER_QTY = "MINIMUM_ORDER_QTY",
    MAXIMUM_ORDER_QTY = "MAXIMUM_ORDER_QTY",
    INVENTORY_AVAILABLE = "INVENTORY_AVAILABLE",
    PRICE_VALID = "PRICE_VALID"
}
/**
 * Address validation types
 */
export declare enum AddressValidationType {
    FORMAT = "FORMAT",
    POSTAL_CODE = "POSTAL_CODE",
    DELIVERABLE = "DELIVERABLE",
    PO_BOX = "PO_BOX",
    RESTRICTED_AREA = "RESTRICTED_AREA",
    INTERNATIONAL = "INTERNATIONAL"
}
/**
 * Payment validation types
 */
export declare enum PaymentValidationType {
    METHOD_ALLOWED = "METHOD_ALLOWED",
    CREDIT_CARD_VALID = "CREDIT_CARD_VALID",
    PAYMENT_TERMS = "PAYMENT_TERMS",
    AMOUNT_MATCH = "AMOUNT_MATCH",
    AUTHORIZATION = "AUTHORIZATION",
    FRAUD_CHECK = "FRAUD_CHECK"
}
/**
 * Compliance validation types
 */
export declare enum ComplianceValidationType {
    EXPORT_CONTROL = "EXPORT_CONTROL",
    SANCTIONS = "SANCTIONS",
    TAX_EXEMPT = "TAX_EXEMPT",
    REGULATORY = "REGULATORY",
    DATA_PRIVACY = "DATA_PRIVACY",
    INDUSTRY_SPECIFIC = "INDUSTRY_SPECIFIC"
}
/**
 * Rule operator types
 */
export declare enum RuleOperator {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    GREATER_THAN = "GREATER_THAN",
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
    LESS_THAN = "LESS_THAN",
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
    BETWEEN = "BETWEEN",
    IN = "IN",
    NOT_IN = "NOT_IN",
    CONTAINS = "CONTAINS",
    REGEX = "REGEX"
}
/**
 * Credit check result
 */
export declare enum CreditCheckResult {
    APPROVED = "APPROVED",
    DECLINED = "DECLINED",
    MANUAL_REVIEW = "MANUAL_REVIEW",
    OVER_LIMIT = "OVER_LIMIT",
    ON_HOLD = "ON_HOLD"
}
/**
 * Fraud risk level
 */
export declare enum FraudRiskLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    severity: ValidationSeverity;
    ruleType: ValidationRuleType;
    message: string;
    fieldName?: string;
    errorCode?: string;
    metadata?: Record<string, unknown>;
}
/**
 * Validation context for rule evaluation
 */
export interface ValidationContext {
    orderId?: string;
    customerId: string;
    orderDate: Date;
    orderTotal: number;
    currency: string;
    shippingAddress?: Address;
    billingAddress?: Address;
    paymentMethod?: string;
    items: OrderLineItem[];
    metadata?: Record<string, unknown>;
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
    isPoBox?: boolean;
    isValidated?: boolean;
}
/**
 * Order line item
 */
export interface OrderLineItem {
    lineNumber: number;
    productId: string;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    taxAmount?: number;
    lineTotal: number;
}
/**
 * Business rule definition
 */
export interface BusinessRule {
    ruleId: string;
    ruleName: string;
    ruleType: ValidationRuleType;
    condition: RuleCondition;
    action: RuleAction;
    priority: number;
    isActive: boolean;
}
/**
 * Rule condition
 */
export interface RuleCondition {
    field: string;
    operator: RuleOperator;
    value: unknown;
    logicalOperator?: 'AND' | 'OR' | 'NOT';
    nestedConditions?: RuleCondition[];
}
/**
 * Rule action
 */
export interface RuleAction {
    actionType: 'BLOCK' | 'WARN' | 'APPROVE' | 'MODIFY' | 'NOTIFY';
    message: string;
    modifyFields?: Record<string, unknown>;
    notifyUsers?: string[];
}
/**
 * Credit check context
 */
export interface CreditCheckContext {
    customerId: string;
    orderAmount: number;
    currency: string;
    existingOrders?: number;
    outstandingBalance?: number;
}
/**
 * ATP (Available-to-Promise) check result
 */
export interface ATPCheckResult {
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
    promisedQuantity: number;
    backorderQuantity: number;
    promiseDate?: Date;
    warehouseId?: string;
}
/**
 * Fraud check result
 */
export interface FraudCheckResult {
    riskLevel: FraudRiskLevel;
    riskScore: number;
    flags: string[];
    recommendations: string[];
    requiresManualReview: boolean;
}
/**
 * Validate order DTO
 */
export declare class ValidateOrderDto {
    customerId: string;
    items: OrderLineItem[];
    shippingAddress?: Address;
    billingAddress?: Address;
    paymentMethod?: string;
    currency?: string;
}
/**
 * Create validation rule DTO
 */
export declare class CreateValidationRuleDto {
    ruleName: string;
    description?: string;
    ruleType: ValidationRuleType;
    severity: ValidationSeverity;
    condition: RuleCondition;
    action: RuleAction;
    priority?: number;
    errorCode?: string;
}
/**
 * Address validation DTO
 */
export declare class ValidateAddressDto {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
}
/**
 * Credit check DTO
 */
export declare class CreditCheckDto {
    customerId: string;
    orderAmount: number;
    currency?: string;
}
/**
 * Validation rule model
 */
export declare class ValidationRule extends Model {
    ruleId: string;
    ruleCode: string;
    ruleName: string;
    description: string;
    ruleType: ValidationRuleType;
    severity: ValidationSeverity;
    condition: RuleCondition;
    action: RuleAction;
    priority: number;
    isActive: boolean;
    errorCode: string;
    customFields: Record<string, unknown>;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Validation log model for audit trail
 */
export declare class ValidationLog extends Model {
    logId: string;
    orderId: string;
    customerId: string;
    ruleId: string;
    ruleType: ValidationRuleType;
    validationStatus: ValidationStatus;
    severity: ValidationSeverity;
    message: string;
    fieldName: string;
    errorCode: string;
    validationData: Record<string, unknown>;
    createdAt: Date;
}
/**
 * Customer credit model
 */
export declare class CustomerCredit extends Model {
    creditId: string;
    customerId: string;
    creditLimit: number;
    availableCredit: number;
    outstandingBalance: number;
    creditStatus: string;
    isOnHold: boolean;
    lastReviewDate: Date;
    creditScore: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Product inventory model for ATP checks
 */
export declare class ProductInventory extends Model {
    inventoryId: string;
    productId: string;
    warehouseId: string;
    onHandQuantity: number;
    availableQuantity: number;
    reservedQuantity: number;
    onOrderQuantity: number;
    safetyStock: number;
    reorderPoint: number;
    isActive: boolean;
    lastCountDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Validate customer exists and is active
 *
 * @param customerId - Customer ID to validate
 * @returns Validation result
 *
 * @example
 * const result = await validateCustomerExists('CUST-123');
 */
export declare function validateCustomerExists(customerId: string): Promise<ValidationResult>;
/**
 * Validate customer is active and not on hold
 *
 * @param customerId - Customer ID to validate
 * @returns Validation result
 *
 * @example
 * const result = await validateCustomerActive('CUST-123');
 */
export declare function validateCustomerActive(customerId: string): Promise<ValidationResult>;
/**
 * Validate customer credit limit
 *
 * @param context - Credit check context
 * @returns Validation result with credit check details
 *
 * @example
 * const result = await validateCustomerCreditLimit({ customerId: 'CUST-123', orderAmount: 5000 });
 */
export declare function validateCustomerCreditLimit(context: CreditCheckContext): Promise<ValidationResult & {
    creditCheckResult?: CreditCheckResult;
}>;
/**
 * Validate customer is not blacklisted
 *
 * @param customerId - Customer ID
 * @returns Validation result
 *
 * @example
 * const result = await validateCustomerNotBlacklisted('CUST-123');
 */
export declare function validateCustomerNotBlacklisted(customerId: string): Promise<ValidationResult>;
/**
 * Validate customer payment history
 *
 * @param customerId - Customer ID
 * @returns Validation result with payment history score
 *
 * @example
 * const result = await validateCustomerPaymentHistory('CUST-123');
 */
export declare function validateCustomerPaymentHistory(customerId: string): Promise<ValidationResult>;
/**
 * Validate product exists and is active
 *
 * @param productId - Product ID to validate
 * @returns Validation result
 *
 * @example
 * const result = await validateProductExists('PROD-123');
 */
export declare function validateProductExists(productId: string): Promise<ValidationResult>;
/**
 * Validate product is not discontinued
 *
 * @param productId - Product ID
 * @returns Validation result
 *
 * @example
 * const result = await validateProductNotDiscontinued('PROD-123');
 */
export declare function validateProductNotDiscontinued(productId: string): Promise<ValidationResult>;
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
export declare function validateProductQuantityConstraints(productId: string, quantity: number): Promise<ValidationResult>;
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
export declare function validateProductNotRestricted(productId: string, customerId: string): Promise<ValidationResult>;
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
export declare function validatePricing(productId: string, unitPrice: number): Promise<ValidationResult>;
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
export declare function validateDiscountAuthorization(discountPercent: number, userId: string): Promise<ValidationResult>;
/**
 * Validate line item totals match calculated amounts
 *
 * @param items - Order line items
 * @returns Validation result
 *
 * @example
 * const result = validateLineItemTotals(orderItems);
 */
export declare function validateLineItemTotals(items: OrderLineItem[]): ValidationResult;
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
export declare function checkProductATP(productId: string, requestedQuantity: number, warehouseId?: string): Promise<ATPCheckResult>;
/**
 * Validate inventory availability for entire order
 *
 * @param items - Order line items
 * @returns Validation result with ATP details
 *
 * @example
 * const result = await validateInventoryAvailability(orderItems);
 */
export declare function validateInventoryAvailability(items: OrderLineItem[]): Promise<ValidationResult>;
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
export declare function validateInventoryReservation(productId: string, quantity: number, warehouseId: string, transaction?: Transaction): Promise<ValidationResult>;
/**
 * Validate address format and completeness
 *
 * @param address - Address to validate
 * @returns Validation result
 *
 * @example
 * const result = validateAddressFormat(shippingAddress);
 */
export declare function validateAddressFormat(address: Address): ValidationResult;
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
export declare function validatePostalCode(postalCode: string, country: string): ValidationResult;
/**
 * Validate address is deliverable
 *
 * @param address - Address to validate
 * @returns Validation result
 *
 * @example
 * const result = await validateAddressDeliverable(shippingAddress);
 */
export declare function validateAddressDeliverable(address: Address): Promise<ValidationResult>;
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
export declare function validateInternationalShipping(destinationCountry: string, productIds: string[]): Promise<ValidationResult>;
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
export declare function validatePaymentMethod(customerId: string, paymentMethod: string): Promise<ValidationResult>;
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
export declare function validatePaymentTerms(customerId: string, paymentTerms: string): Promise<ValidationResult>;
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
export declare function validatePaymentAmount(paymentAmount: number, orderTotal: number): ValidationResult;
/**
 * Execute business rule engine for order validation
 *
 * @param context - Validation context
 * @returns Array of validation results
 *
 * @example
 * const results = await executeBusinessRules(validationContext);
 */
export declare function executeBusinessRules(context: ValidationContext): Promise<ValidationResult[]>;
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
export declare function evaluateBusinessRule(rule: ValidationRule, context: ValidationContext): ValidationResult;
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
export declare function evaluateRuleCondition(condition: RuleCondition, context: ValidationContext): boolean;
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
export declare function getNestedValue(obj: unknown, path: string): unknown;
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
export declare function validateOrderLimits(customerId: string, orderTotal: number): Promise<ValidationResult>;
/**
 * Validate cross-field dependencies (e.g., shipping method requires address type)
 *
 * @param context - Validation context
 * @returns Validation result
 *
 * @example
 * const result = validateCrossFieldDependencies(context);
 */
export declare function validateCrossFieldDependencies(context: ValidationContext): ValidationResult;
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
export declare function validateExportControl(destinationCountry: string, productIds: string[]): Promise<ValidationResult>;
/**
 * Perform fraud risk assessment
 *
 * @param context - Validation context
 * @returns Fraud check result
 *
 * @example
 * const result = await performFraudCheck(context);
 */
export declare function performFraudCheck(context: ValidationContext): Promise<FraudCheckResult>;
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
export declare function validateTaxExemption(customerId: string, exemptionCertNumber: string, state: string): Promise<ValidationResult>;
/**
 * Perform comprehensive order validation
 *
 * @param orderData - Order validation DTO
 * @returns Array of all validation results
 *
 * @example
 * const results = await validateCompleteOrder(orderDto);
 */
export declare function validateCompleteOrder(orderData: ValidateOrderDto): Promise<ValidationResult[]>;
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
export declare function createValidationLog(result: ValidationResult, orderId?: string, customerId?: string): Promise<ValidationLog>;
/**
 * Get validation summary for order
 *
 * @param validationResults - Array of validation results
 * @returns Validation summary with counts and overall status
 *
 * @example
 * const summary = getValidationSummary(results);
 */
export declare function getValidationSummary(validationResults: ValidationResult[]): {
    overallStatus: 'PASSED' | 'FAILED' | 'WARNING';
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
    errors: ValidationResult[];
    warnings_list: ValidationResult[];
};
//# sourceMappingURL=order-validation-rules-kit.d.ts.map