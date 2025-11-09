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

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsEmail,
  Min,
  Max,
  ValidateNested,
  IsDate,
  Matches,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Op, WhereOptions, Transaction } from 'sequelize';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Validation rule types
 */
export enum ValidationRuleType {
  CUSTOMER = 'CUSTOMER',
  PRODUCT = 'PRODUCT',
  PRICING = 'PRICING',
  INVENTORY = 'INVENTORY',
  ADDRESS = 'ADDRESS',
  PAYMENT = 'PAYMENT',
  SHIPPING = 'SHIPPING',
  BUSINESS_RULE = 'BUSINESS_RULE',
  CROSS_FIELD = 'CROSS_FIELD',
  CONSTRAINT = 'CONSTRAINT',
  DATA_INTEGRITY = 'DATA_INTEGRITY',
  COMPLIANCE = 'COMPLIANCE',
}

/**
 * Validation severity levels
 */
export enum ValidationSeverity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  CRITICAL = 'CRITICAL',
}

/**
 * Validation status
 */
export enum ValidationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
}

/**
 * Customer validation types
 */
export enum CustomerValidationType {
  EXISTS = 'EXISTS',
  ACTIVE = 'ACTIVE',
  CREDIT_LIMIT = 'CREDIT_LIMIT',
  CREDIT_HOLD = 'CREDIT_HOLD',
  BLACKLIST = 'BLACKLIST',
  FRAUD_SCORE = 'FRAUD_SCORE',
  PAYMENT_HISTORY = 'PAYMENT_HISTORY',
  KYC_STATUS = 'KYC_STATUS',
}

/**
 * Product validation types
 */
export enum ProductValidationType {
  EXISTS = 'EXISTS',
  ACTIVE = 'ACTIVE',
  DISCONTINUED = 'DISCONTINUED',
  RESTRICTED = 'RESTRICTED',
  MINIMUM_ORDER_QTY = 'MINIMUM_ORDER_QTY',
  MAXIMUM_ORDER_QTY = 'MAXIMUM_ORDER_QTY',
  INVENTORY_AVAILABLE = 'INVENTORY_AVAILABLE',
  PRICE_VALID = 'PRICE_VALID',
}

/**
 * Address validation types
 */
export enum AddressValidationType {
  FORMAT = 'FORMAT',
  POSTAL_CODE = 'POSTAL_CODE',
  DELIVERABLE = 'DELIVERABLE',
  PO_BOX = 'PO_BOX',
  RESTRICTED_AREA = 'RESTRICTED_AREA',
  INTERNATIONAL = 'INTERNATIONAL',
}

/**
 * Payment validation types
 */
export enum PaymentValidationType {
  METHOD_ALLOWED = 'METHOD_ALLOWED',
  CREDIT_CARD_VALID = 'CREDIT_CARD_VALID',
  PAYMENT_TERMS = 'PAYMENT_TERMS',
  AMOUNT_MATCH = 'AMOUNT_MATCH',
  AUTHORIZATION = 'AUTHORIZATION',
  FRAUD_CHECK = 'FRAUD_CHECK',
}

/**
 * Compliance validation types
 */
export enum ComplianceValidationType {
  EXPORT_CONTROL = 'EXPORT_CONTROL',
  SANCTIONS = 'SANCTIONS',
  TAX_EXEMPT = 'TAX_EXEMPT',
  REGULATORY = 'REGULATORY',
  DATA_PRIVACY = 'DATA_PRIVACY',
  INDUSTRY_SPECIFIC = 'INDUSTRY_SPECIFIC',
}

/**
 * Rule operator types
 */
export enum RuleOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  BETWEEN = 'BETWEEN',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  CONTAINS = 'CONTAINS',
  REGEX = 'REGEX',
}

/**
 * Credit check result
 */
export enum CreditCheckResult {
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  OVER_LIMIT = 'OVER_LIMIT',
  ON_HOLD = 'ON_HOLD',
}

/**
 * Fraud risk level
 */
export enum FraudRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

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

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * Validate order DTO
 */
export class ValidateOrderDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Order line items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  items: OrderLineItem[];

  @ApiPropertyOptional({ description: 'Shipping address' })
  @ValidateNested()
  @Type(() => Object)
  @IsOptional()
  shippingAddress?: Address;

  @ApiPropertyOptional({ description: 'Billing address' })
  @ValidateNested()
  @Type(() => Object)
  @IsOptional()
  billingAddress?: Address;

  @ApiPropertyOptional({ description: 'Payment method' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsString()
  @Length(3, 3)
  @IsOptional()
  currency?: string;
}

/**
 * Create validation rule DTO
 */
export class CreateValidationRuleDto {
  @ApiProperty({ description: 'Rule name' })
  @IsString()
  @IsNotEmpty()
  ruleName: string;

  @ApiProperty({ description: 'Rule description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Rule type', enum: ValidationRuleType })
  @IsEnum(ValidationRuleType)
  @IsNotEmpty()
  ruleType: ValidationRuleType;

  @ApiProperty({ description: 'Severity level', enum: ValidationSeverity })
  @IsEnum(ValidationSeverity)
  @IsNotEmpty()
  severity: ValidationSeverity;

  @ApiProperty({ description: 'Rule condition (JSON)' })
  @IsNotEmpty()
  condition: RuleCondition;

  @ApiProperty({ description: 'Rule action (JSON)' })
  @IsNotEmpty()
  action: RuleAction;

  @ApiPropertyOptional({ description: 'Priority (higher = higher priority)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ description: 'Error code' })
  @IsString()
  @IsOptional()
  errorCode?: string;
}

/**
 * Address validation DTO
 */
export class ValidateAddressDto {
  @ApiProperty({ description: 'Address line 1' })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State/Province' })
  @IsString()
  @IsNotEmpty()
  stateProvince: string;

  @ApiProperty({ description: 'Postal code' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ description: 'Country code (ISO 2-letter)' })
  @IsString()
  @Length(2, 2)
  @IsNotEmpty()
  country: string;
}

/**
 * Credit check DTO
 */
export class CreditCheckDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Order amount' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  orderAmount: number;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsString()
  @Length(3, 3)
  @IsOptional()
  currency?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Validation rule model
 */
@Table({
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
})
export class ValidationRule extends Model {
  @ApiProperty({ description: 'Validation rule ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  ruleId: string;

  @ApiProperty({ description: 'Rule code (unique)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index
  ruleCode: string;

  @ApiProperty({ description: 'Rule name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  ruleName: string;

  @ApiProperty({ description: 'Rule description' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiProperty({ description: 'Rule type', enum: ValidationRuleType })
  @Column({
    type: DataType.ENUM(...Object.values(ValidationRuleType)),
    allowNull: false,
  })
  ruleType: ValidationRuleType;

  @ApiProperty({ description: 'Severity level', enum: ValidationSeverity })
  @Column({
    type: DataType.ENUM(...Object.values(ValidationSeverity)),
    allowNull: false,
  })
  severity: ValidationSeverity;

  @ApiProperty({ description: 'Rule condition (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  condition: RuleCondition;

  @ApiProperty({ description: 'Rule action (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  action: RuleAction;

  @ApiProperty({ description: 'Priority (higher = higher priority)' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 50,
  })
  priority: number;

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({ description: 'Error code' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  errorCode: string;

  @ApiProperty({ description: 'Custom fields (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  customFields: Record<string, unknown>;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  createdBy: string;

  @ApiProperty({ description: 'Updated by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  updatedBy: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}

/**
 * Validation log model for audit trail
 */
@Table({
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
})
export class ValidationLog extends Model {
  @ApiProperty({ description: 'Validation log ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  logId: string;

  @ApiProperty({ description: 'Order ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  orderId: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  customerId: string;

  @ApiProperty({ description: 'Rule ID' })
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  ruleId: string;

  @ApiProperty({ description: 'Rule type', enum: ValidationRuleType })
  @Column({
    type: DataType.ENUM(...Object.values(ValidationRuleType)),
    allowNull: false,
  })
  ruleType: ValidationRuleType;

  @ApiProperty({ description: 'Validation status', enum: ValidationStatus })
  @Column({
    type: DataType.ENUM(...Object.values(ValidationStatus)),
    allowNull: false,
  })
  validationStatus: ValidationStatus;

  @ApiProperty({ description: 'Severity', enum: ValidationSeverity })
  @Column({
    type: DataType.ENUM(...Object.values(ValidationSeverity)),
    allowNull: false,
  })
  severity: ValidationSeverity;

  @ApiProperty({ description: 'Validation message' })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @ApiProperty({ description: 'Field name' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  fieldName: string;

  @ApiProperty({ description: 'Error code' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  errorCode: string;

  @ApiProperty({ description: 'Validation data (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  validationData: Record<string, unknown>;

  @CreatedAt
  @Column
  createdAt: Date;
}

/**
 * Customer credit model
 */
@Table({
  tableName: 'customer_credit',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['customerId'], unique: true },
    { fields: ['creditStatus'] },
    { fields: ['isOnHold'] },
  ],
})
export class CustomerCredit extends Model {
  @ApiProperty({ description: 'Credit record ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  creditId: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  customerId: string;

  @ApiProperty({ description: 'Credit limit' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  creditLimit: number;

  @ApiProperty({ description: 'Available credit' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  availableCredit: number;

  @ApiProperty({ description: 'Outstanding balance' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  outstandingBalance: number;

  @ApiProperty({ description: 'Credit status' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'ACTIVE',
  })
  creditStatus: string;

  @ApiProperty({ description: 'Is on credit hold' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isOnHold: boolean;

  @ApiProperty({ description: 'Last credit review date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastReviewDate: Date;

  @ApiProperty({ description: 'Credit score' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  creditScore: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}

/**
 * Product inventory model for ATP checks
 */
@Table({
  tableName: 'product_inventory',
  timestamps: true,
  indexes: [
    { fields: ['productId'] },
    { fields: ['warehouseId'] },
    { fields: ['productId', 'warehouseId'] },
    { fields: ['isActive'] },
  ],
})
export class ProductInventory extends Model {
  @ApiProperty({ description: 'Inventory ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  inventoryId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  productId: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  warehouseId: string;

  @ApiProperty({ description: 'On-hand quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  onHandQuantity: number;

  @ApiProperty({ description: 'Available quantity (ATP)' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  availableQuantity: number;

  @ApiProperty({ description: 'Reserved quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  reservedQuantity: number;

  @ApiProperty({ description: 'On-order quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  onOrderQuantity: number;

  @ApiProperty({ description: 'Safety stock level' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  safetyStock: number;

  @ApiProperty({ description: 'Reorder point' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  reorderPoint: number;

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({ description: 'Last count date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastCountDate: Date;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}

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
export async function validateCustomerExists(customerId: string): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Customer validation failed: ${error.message}`);
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
export async function validateCustomerActive(customerId: string): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Customer active validation failed: ${error.message}`);
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
export async function validateCustomerCreditLimit(
  context: CreditCheckContext
): Promise<ValidationResult & { creditCheckResult?: CreditCheckResult }> {
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
  } catch (error) {
    throw new BadRequestException(`Credit limit validation failed: ${error.message}`);
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
export async function validateCustomerNotBlacklisted(customerId: string): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Blacklist validation failed: ${error.message}`);
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
export async function validateCustomerPaymentHistory(customerId: string): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Payment history validation failed: ${error.message}`);
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
export async function validateProductExists(productId: string): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Product validation failed: ${error.message}`);
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
export async function validateProductNotDiscontinued(productId: string): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Product discontinued check failed: ${error.message}`);
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
export async function validateProductQuantityConstraints(
  productId: string,
  quantity: number
): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Quantity constraint validation failed: ${error.message}`);
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
export async function validateProductNotRestricted(
  productId: string,
  customerId: string
): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Product restriction validation failed: ${error.message}`);
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
export async function validatePricing(productId: string, unitPrice: number): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Pricing validation failed: ${error.message}`);
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
export async function validateDiscountAuthorization(
  discountPercent: number,
  userId: string
): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Discount authorization validation failed: ${error.message}`);
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
export function validateLineItemTotals(items: OrderLineItem[]): ValidationResult {
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
  } catch (error) {
    throw new BadRequestException(`Line total validation failed: ${error.message}`);
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
export async function checkProductATP(
  productId: string,
  requestedQuantity: number,
  warehouseId?: string
): Promise<ATPCheckResult> {
  try {
    const whereClause: WhereOptions = {
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
    let selectedWarehouse: string | undefined;

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
  } catch (error) {
    throw new BadRequestException(`ATP check failed: ${error.message}`);
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
export async function validateInventoryAvailability(
  items: OrderLineItem[]
): Promise<ValidationResult> {
  try {
    const atpResults: ATPCheckResult[] = [];
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
  } catch (error) {
    throw new BadRequestException(`Inventory validation failed: ${error.message}`);
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
export async function validateInventoryReservation(
  productId: string,
  quantity: number,
  warehouseId: string,
  transaction?: Transaction
): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Inventory reservation validation failed: ${error.message}`);
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
export function validateAddressFormat(address: Address): ValidationResult {
  try {
    const errors: string[] = [];

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
  } catch (error) {
    throw new BadRequestException(`Address format validation failed: ${error.message}`);
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
export function validatePostalCode(postalCode: string, country: string): ValidationResult {
  try {
    const postalCodePatterns: Record<string, RegExp> = {
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
  } catch (error) {
    throw new BadRequestException(`Postal code validation failed: ${error.message}`);
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
export async function validateAddressDeliverable(address: Address): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Address deliverability validation failed: ${error.message}`);
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
export async function validateInternationalShipping(
  destinationCountry: string,
  productIds: string[]
): Promise<ValidationResult> {
  try {
    // Mock international shipping validation
    const domesticCountry = 'US';
    const isInternational = destinationCountry !== domesticCountry;

    if (isInternational) {
      // Check if products can be shipped internationally
      const restrictedProducts: string[] = []; // In production, query product restrictions

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
  } catch (error) {
    throw new BadRequestException(`International shipping validation failed: ${error.message}`);
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
export async function validatePaymentMethod(
  customerId: string,
  paymentMethod: string
): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Payment method validation failed: ${error.message}`);
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
export async function validatePaymentTerms(
  customerId: string,
  paymentTerms: string
): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Payment terms validation failed: ${error.message}`);
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
export function validatePaymentAmount(paymentAmount: number, orderTotal: number): ValidationResult {
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
  } catch (error) {
    throw new BadRequestException(`Payment amount validation failed: ${error.message}`);
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
export async function executeBusinessRules(context: ValidationContext): Promise<ValidationResult[]> {
  try {
    const rules = await ValidationRule.findAll({
      where: {
        isActive: true,
      },
      order: [['priority', 'DESC']],
    });

    const results: ValidationResult[] = [];

    for (const rule of rules) {
      const ruleResult = evaluateBusinessRule(rule, context);
      if (!ruleResult.isValid || ruleResult.severity !== ValidationSeverity.INFO) {
        results.push(ruleResult);
      }
    }

    return results;
  } catch (error) {
    throw new BadRequestException(`Business rules execution failed: ${error.message}`);
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
export function evaluateBusinessRule(
  rule: ValidationRule,
  context: ValidationContext
): ValidationResult {
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
  } catch (error) {
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
export function evaluateRuleCondition(
  condition: RuleCondition,
  context: ValidationContext
): boolean {
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
      } else if (condition.logicalOperator === 'OR') {
        result = result || nestedResults.some(r => r);
      } else if (condition.logicalOperator === 'NOT') {
        result = result && !nestedResults.some(r => r);
      }
    }

    return result;
  } catch (error) {
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
export function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current: any = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
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
export async function validateOrderLimits(
  customerId: string,
  orderTotal: number
): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Order limits validation failed: ${error.message}`);
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
export function validateCrossFieldDependencies(context: ValidationContext): ValidationResult {
  try {
    const errors: string[] = [];

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
  } catch (error) {
    throw new BadRequestException(`Cross-field validation failed: ${error.message}`);
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
export async function validateExportControl(
  destinationCountry: string,
  productIds: string[]
): Promise<ValidationResult> {
  try {
    // Mock export control validation
    const sanctionedCountries = ['IR', 'KP', 'SY', 'CU'];
    const controlledProducts: string[] = [];

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
  } catch (error) {
    throw new BadRequestException(`Export control validation failed: ${error.message}`);
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
export async function performFraudCheck(context: ValidationContext): Promise<FraudCheckResult> {
  try {
    let riskScore = 0;
    const flags: string[] = [];
    const recommendations: string[] = [];

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
    let riskLevel: FraudRiskLevel;
    if (riskScore >= 75) {
      riskLevel = FraudRiskLevel.CRITICAL;
      recommendations.push('Block order and conduct manual review');
    } else if (riskScore >= 50) {
      riskLevel = FraudRiskLevel.HIGH;
      recommendations.push('Require manager approval');
    } else if (riskScore >= 25) {
      riskLevel = FraudRiskLevel.MEDIUM;
      recommendations.push('Enhanced verification recommended');
    } else {
      riskLevel = FraudRiskLevel.LOW;
    }

    return {
      riskLevel,
      riskScore,
      flags,
      recommendations,
      requiresManualReview: riskScore >= 50,
    };
  } catch (error) {
    throw new BadRequestException(`Fraud check failed: ${error.message}`);
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
export async function validateTaxExemption(
  customerId: string,
  exemptionCertNumber: string,
  state: string
): Promise<ValidationResult> {
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
  } catch (error) {
    throw new BadRequestException(`Tax exemption validation failed: ${error.message}`);
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
export async function validateCompleteOrder(orderData: ValidateOrderDto): Promise<ValidationResult[]> {
  try {
    const results: ValidationResult[] = [];

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
      results.push(validatePostalCode(
        orderData.shippingAddress.postalCode,
        orderData.shippingAddress.country
      ));
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
    const context: ValidationContext = {
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
  } catch (error) {
    throw new BadRequestException(`Complete order validation failed: ${error.message}`);
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
export async function createValidationLog(
  result: ValidationResult,
  orderId?: string,
  customerId?: string
): Promise<ValidationLog> {
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
  } catch (error) {
    throw new BadRequestException(`Failed to create validation log: ${error.message}`);
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
export function getValidationSummary(validationResults: ValidationResult[]): {
  overallStatus: 'PASSED' | 'FAILED' | 'WARNING';
  totalChecks: number;
  passed: number;
  failed: number;
  warnings: number;
  errors: ValidationResult[];
  warnings_list: ValidationResult[];
} {
  const errors = validationResults.filter(r => !r.isValid && r.severity === ValidationSeverity.ERROR);
  const criticals = validationResults.filter(r => !r.isValid && r.severity === ValidationSeverity.CRITICAL);
  const warnings = validationResults.filter(r => r.severity === ValidationSeverity.WARNING);
  const passed = validationResults.filter(r => r.isValid);

  let overallStatus: 'PASSED' | 'FAILED' | 'WARNING';
  if (errors.length > 0 || criticals.length > 0) {
    overallStatus = 'FAILED';
  } else if (warnings.length > 0) {
    overallStatus = 'WARNING';
  } else {
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
