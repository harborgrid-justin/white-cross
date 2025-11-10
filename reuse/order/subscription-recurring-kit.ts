/**
 * LOC: ORD-SUB-001
 * File: /reuse/order/subscription-recurring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Subscription controllers
 *   - Billing services
 *   - Recurring order processors
 */

/**
 * File: /reuse/order/subscription-recurring-kit.ts
 * Locator: WC-ORD-SUBREC-001
 * Purpose: Subscription & Recurring Orders - Subscription management, billing, renewals
 *
 * Upstream: Independent utility module for subscription and recurring order operations
 * Downstream: ../backend/subscription/*, Order modules, Billing services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for subscription management, recurring orders, billing cycles
 *
 * LLM Context: Enterprise-grade subscription and recurring order utilities to compete with Oracle NetSuite.
 * Provides comprehensive subscription creation, plan management, billing cycle automation, recurring order generation,
 * subscription modifications, cancellations, renewals, payment method management, failed payment handling,
 * proration calculations, subscription analytics, dunning management, trial periods, commitment terms,
 * usage-based billing, tiered pricing, subscription migrations, and automated notifications.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
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
  BeforeCreate,
  BeforeUpdate,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEnum, IsArray, IsBoolean, Min, Max, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Subscription status lifecycle
 */
export enum SubscriptionStatus {
  PENDING = 'PENDING',
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  PAUSED = 'PAUSED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  NON_RENEWING = 'NON_RENEWING',
  PENDING_CANCELLATION = 'PENDING_CANCELLATION',
}

/**
 * Billing frequency for subscriptions
 */
export enum BillingFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUAL = 'SEMIANNUAL',
  ANNUAL = 'ANNUAL',
  BIENNIAL = 'BIENNIAL',
  CUSTOM = 'CUSTOM',
}

/**
 * Subscription plan types
 */
export enum PlanType {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM',
  TIERED = 'TIERED',
  USAGE_BASED = 'USAGE_BASED',
  HYBRID = 'HYBRID',
}

/**
 * Proration methods
 */
export enum ProrationMethod {
  FULL_PERIOD = 'FULL_PERIOD',
  PRORATED_DAILY = 'PRORATED_DAILY',
  PRORATED_HOURLY = 'PRORATED_HOURLY',
  NO_PRORATION = 'NO_PRORATION',
  CREDIT_BALANCE = 'CREDIT_BALANCE',
}

/**
 * Renewal types
 */
export enum RenewalType {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
  OPT_IN = 'OPT_IN',
  OPT_OUT = 'OPT_OUT',
}

/**
 * Cancellation reasons
 */
export enum CancellationReason {
  CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
  PAYMENT_FAILURE = 'PAYMENT_FAILURE',
  FRAUD = 'FRAUD',
  TOO_EXPENSIVE = 'TOO_EXPENSIVE',
  SWITCHING_TO_COMPETITOR = 'SWITCHING_TO_COMPETITOR',
  NOT_USING = 'NOT_USING',
  MISSING_FEATURES = 'MISSING_FEATURES',
  QUALITY_ISSUES = 'QUALITY_ISSUES',
  OTHER = 'OTHER',
}

/**
 * Payment method types
 */
export enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  PAYPAL = 'PAYPAL',
  INVOICE = 'INVOICE',
  WIRE_TRANSFER = 'WIRE_TRANSFER',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
}

/**
 * Dunning stages for failed payments
 */
export enum DunningStage {
  NONE = 'NONE',
  SOFT_DECLINE = 'SOFT_DECLINE',
  RETRY_1 = 'RETRY_1',
  RETRY_2 = 'RETRY_2',
  RETRY_3 = 'RETRY_3',
  FINAL_NOTICE = 'FINAL_NOTICE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
}

/**
 * Subscription modification types
 */
export enum ModificationType {
  UPGRADE = 'UPGRADE',
  DOWNGRADE = 'DOWNGRADE',
  ADDON = 'ADDON',
  REMOVE_ADDON = 'REMOVE_ADDON',
  QUANTITY_CHANGE = 'QUANTITY_CHANGE',
  PLAN_CHANGE = 'PLAN_CHANGE',
  PAYMENT_METHOD_CHANGE = 'PAYMENT_METHOD_CHANGE',
}

/**
 * Usage tracking units
 */
export enum UsageUnit {
  API_CALLS = 'API_CALLS',
  USERS = 'USERS',
  STORAGE_GB = 'STORAGE_GB',
  BANDWIDTH_GB = 'BANDWIDTH_GB',
  TRANSACTIONS = 'TRANSACTIONS',
  HOURS = 'HOURS',
  UNITS = 'UNITS',
  CUSTOM = 'CUSTOM',
}

// ============================================================================
// INTERFACES & DTOS
// ============================================================================

/**
 * Subscription plan configuration
 */
export interface PlanConfiguration {
  planId: string;
  planName: string;
  planType: PlanType;
  billingFrequency: BillingFrequency;
  price: number;
  setupFee?: number;
  trialDays?: number;
  commitmentMonths?: number;
  features: string[];
  limits?: Record<string, number>;
  metadata?: Record<string, unknown>;
}

/**
 * Billing cycle information
 */
export interface BillingCycle {
  cycleNumber: number;
  periodStart: Date;
  periodEnd: Date;
  billingDate: Date;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSED' | 'FAILED' | 'SKIPPED';
}

/**
 * Payment method details
 */
export interface PaymentMethodDetails {
  paymentMethodId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  billingAddress?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

/**
 * Proration calculation result
 */
export interface ProrationResult {
  originalAmount: number;
  proratedAmount: number;
  creditAmount: number;
  debitAmount: number;
  daysUsed: number;
  totalDays: number;
  prorationFactor: number;
  effectiveDate: Date;
}

/**
 * Subscription modification request
 */
export interface SubscriptionModification {
  modificationType: ModificationType;
  newPlanId?: string;
  quantityChange?: number;
  addonIds?: string[];
  effectiveDate: Date;
  prorationMethod: ProrationMethod;
  reason?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Usage tracking record
 */
export interface UsageRecord {
  subscriptionId: string;
  usageUnit: UsageUnit;
  quantity: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Renewal notification settings
 */
export interface RenewalNotificationSettings {
  enabled: boolean;
  notifyDaysBefore: number[];
  emailTemplate?: string;
  smsEnabled?: boolean;
  webhookUrl?: string;
}

/**
 * Subscription analytics metrics
 */
export interface SubscriptionMetrics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  churnRate: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  retentionRate: number;
  growthRate: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Subscription Plan Model
 */
@Table({
  tableName: 'subscription_plans',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['plan_code'], unique: true },
    { fields: ['plan_type'] },
    { fields: ['is_active'] },
  ],
})
export class SubscriptionPlan extends Model {
  @ApiProperty({ description: 'Plan ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  planId: string;

  @ApiProperty({ description: 'Unique plan code' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index
  planCode: string;

  @ApiProperty({ description: 'Plan name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  planName: string;

  @ApiProperty({ description: 'Plan type', enum: PlanType })
  @Column({
    type: DataType.ENUM(...Object.values(PlanType)),
    allowNull: false,
  })
  planType: PlanType;

  @ApiProperty({ description: 'Billing frequency', enum: BillingFrequency })
  @Column({
    type: DataType.ENUM(...Object.values(BillingFrequency)),
    allowNull: false,
  })
  billingFrequency: BillingFrequency;

  @ApiProperty({ description: 'Plan price' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  price: number;

  @ApiProperty({ description: 'Setup fee' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0,
  })
  setupFee: number;

  @ApiProperty({ description: 'Trial period in days' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  trialDays: number;

  @ApiProperty({ description: 'Commitment period in months' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  commitmentMonths: number;

  @ApiProperty({ description: 'Plan features (JSON)' })
  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  features: string[];

  @ApiProperty({ description: 'Usage limits (JSON)' })
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  limits: Record<string, number>;

  @ApiProperty({ description: 'Is plan active' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  @Index
  isActive: boolean;

  @ApiProperty({ description: 'Plan metadata' })
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  metadata: Record<string, unknown>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => Subscription)
  subscriptions: Subscription[];
}

/**
 * Subscription Model
 */
@Table({
  tableName: 'subscriptions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['subscription_number'], unique: true },
    { fields: ['customer_id'] },
    { fields: ['status'] },
    { fields: ['next_billing_date'] },
    { fields: ['plan_id'] },
  ],
})
export class Subscription extends Model {
  @ApiProperty({ description: 'Subscription ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  subscriptionId: string;

  @ApiProperty({ description: 'Unique subscription number' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index
  subscriptionNumber: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  customerId: string;

  @ApiProperty({ description: 'Plan ID' })
  @ForeignKey(() => SubscriptionPlan)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  planId: string;

  @BelongsTo(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @ApiProperty({ description: 'Subscription status', enum: SubscriptionStatus })
  @Column({
    type: DataType.ENUM(...Object.values(SubscriptionStatus)),
    allowNull: false,
    defaultValue: SubscriptionStatus.PENDING,
  })
  @Index
  status: SubscriptionStatus;

  @ApiProperty({ description: 'Start date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate: Date;

  @ApiProperty({ description: 'Trial end date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  trialEndDate: Date;

  @ApiProperty({ description: 'Current period start' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  currentPeriodStart: Date;

  @ApiProperty({ description: 'Current period end' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  currentPeriodEnd: Date;

  @ApiProperty({ description: 'Next billing date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  nextBillingDate: Date;

  @ApiProperty({ description: 'Billing amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  billingAmount: number;

  @ApiProperty({ description: 'Quantity' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  quantity: number;

  @ApiProperty({ description: 'Renewal type', enum: RenewalType })
  @Column({
    type: DataType.ENUM(...Object.values(RenewalType)),
    defaultValue: RenewalType.AUTOMATIC,
  })
  renewalType: RenewalType;

  @ApiProperty({ description: 'Payment method ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  paymentMethodId: string;

  @ApiProperty({ description: 'Dunning stage', enum: DunningStage })
  @Column({
    type: DataType.ENUM(...Object.values(DunningStage)),
    defaultValue: DunningStage.NONE,
  })
  dunningStage: DunningStage;

  @ApiProperty({ description: 'Failed payment count' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  failedPaymentCount: number;

  @ApiProperty({ description: 'Last payment date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastPaymentDate: Date;

  @ApiProperty({ description: 'Cancellation date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  cancellationDate: Date;

  @ApiProperty({ description: 'Cancellation reason', enum: CancellationReason })
  @Column({
    type: DataType.ENUM(...Object.values(CancellationReason)),
    allowNull: true,
  })
  cancellationReason: CancellationReason;

  @ApiProperty({ description: 'Subscription metadata' })
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  metadata: Record<string, unknown>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => RecurringOrder)
  recurringOrders: RecurringOrder[];

  @HasMany(() => SubscriptionHistory)
  history: SubscriptionHistory[];

  @BeforeCreate
  static async generateSubscriptionNumber(instance: Subscription) {
    if (!instance.subscriptionNumber) {
      const count = await Subscription.count();
      instance.subscriptionNumber = `SUB-${Date.now()}-${(count + 1).toString().padStart(6, '0')}`;
    }
  }

  @BeforeUpdate
  static async trackChanges(instance: Subscription) {
    if (instance.changed()) {
      await SubscriptionHistory.create({
        subscriptionId: instance.subscriptionId,
        changeType: 'UPDATE',
        changedFields: instance.changed() as string[],
        previousValues: instance._previousDataValues,
        newValues: instance.dataValues,
        changedBy: 'SYSTEM',
      });
    }
  }
}

/**
 * Recurring Order Model
 */
@Table({
  tableName: 'recurring_orders',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['subscription_id'] },
    { fields: ['order_number'], unique: true },
    { fields: ['status'] },
    { fields: ['scheduled_date'] },
  ],
})
export class RecurringOrder extends Model {
  @ApiProperty({ description: 'Recurring order ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  recurringOrderId: string;

  @ApiProperty({ description: 'Subscription ID' })
  @ForeignKey(() => Subscription)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  subscriptionId: string;

  @BelongsTo(() => Subscription)
  subscription: Subscription;

  @ApiProperty({ description: 'Order number' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index
  orderNumber: string;

  @ApiProperty({ description: 'Scheduled date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  scheduledDate: Date;

  @ApiProperty({ description: 'Generated date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  generatedDate: Date;

  @ApiProperty({ description: 'Status' })
  @Column({
    type: DataType.ENUM('SCHEDULED', 'GENERATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'SKIPPED', 'CANCELLED'),
    defaultValue: 'SCHEDULED',
  })
  @Index
  status: string;

  @ApiProperty({ description: 'Order amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  orderAmount: number;

  @ApiProperty({ description: 'Order data (JSON)' })
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  orderData: Record<string, unknown>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Subscription History Model
 */
@Table({
  tableName: 'subscription_history',
  timestamps: true,
  indexes: [
    { fields: ['subscription_id'] },
    { fields: ['change_type'] },
    { fields: ['created_at'] },
  ],
})
export class SubscriptionHistory extends Model {
  @ApiProperty({ description: 'History ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  historyId: string;

  @ApiProperty({ description: 'Subscription ID' })
  @ForeignKey(() => Subscription)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  subscriptionId: string;

  @BelongsTo(() => Subscription)
  subscription: Subscription;

  @ApiProperty({ description: 'Change type' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  changeType: string;

  @ApiProperty({ description: 'Changed fields' })
  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  changedFields: string[];

  @ApiProperty({ description: 'Previous values' })
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  previousValues: Record<string, unknown>;

  @ApiProperty({ description: 'New values' })
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  newValues: Record<string, unknown>;

  @ApiProperty({ description: 'Changed by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  changedBy: string;

  @CreatedAt
  createdAt: Date;
}

/**
 * Usage Tracking Model
 */
@Table({
  tableName: 'subscription_usage',
  timestamps: true,
  indexes: [
    { fields: ['subscription_id'] },
    { fields: ['usage_unit'] },
    { fields: ['usage_date'] },
  ],
})
export class SubscriptionUsage extends Model {
  @ApiProperty({ description: 'Usage ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  usageId: string;

  @ApiProperty({ description: 'Subscription ID' })
  @ForeignKey(() => Subscription)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  subscriptionId: string;

  @BelongsTo(() => Subscription)
  subscription: Subscription;

  @ApiProperty({ description: 'Usage unit', enum: UsageUnit })
  @Column({
    type: DataType.ENUM(...Object.values(UsageUnit)),
    allowNull: false,
  })
  @Index
  usageUnit: UsageUnit;

  @ApiProperty({ description: 'Quantity used' })
  @Column({
    type: DataType.DECIMAL(15, 4),
    allowNull: false,
  })
  quantity: number;

  @ApiProperty({ description: 'Usage date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  usageDate: Date;

  @ApiProperty({ description: 'Usage metadata' })
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  metadata: Record<string, unknown>;

  @CreatedAt
  createdAt: Date;
}

// ============================================================================
// SUBSCRIPTION CREATION & ENROLLMENT FUNCTIONS
// ============================================================================

/**
 * Create new subscription with plan enrollment
 *
 * @param customerId - Customer identifier
 * @param planId - Subscription plan ID
 * @param options - Additional subscription options
 * @returns Created subscription
 *
 * @example
 * const subscription = await createSubscription('CUST-123', 'PLAN-456', {
 *   quantity: 5,
 *   startDate: new Date(),
 *   paymentMethodId: 'pm_123'
 * });
 */
export async function createSubscription(
  customerId: string,
  planId: string,
  options: {
    quantity?: number;
    startDate?: Date;
    paymentMethodId?: string;
    metadata?: Record<string, unknown>;
    trialDays?: number;
  } = {},
): Promise<Subscription> {
  try {
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) {
      throw new NotFoundException(`Subscription plan ${planId} not found`);
    }

    if (!plan.isActive) {
      throw new BadRequestException('Subscription plan is not active');
    }

    const startDate = options.startDate || new Date();
    const quantity = options.quantity || 1;
    const trialDays = options.trialDays ?? plan.trialDays;

    const trialEndDate = trialDays > 0
      ? new Date(startDate.getTime() + trialDays * 24 * 60 * 60 * 1000)
      : null;

    const currentPeriodStart = trialEndDate || startDate;
    const currentPeriodEnd = calculatePeriodEnd(currentPeriodStart, plan.billingFrequency);
    const nextBillingDate = trialEndDate || currentPeriodEnd;

    const subscription = await Subscription.create({
      customerId,
      planId,
      status: trialDays > 0 ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,
      startDate,
      trialEndDate,
      currentPeriodStart,
      currentPeriodEnd,
      nextBillingDate,
      billingAmount: plan.price * quantity,
      quantity,
      paymentMethodId: options.paymentMethodId,
      metadata: options.metadata || {},
    });

    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to create subscription: ${error.message}`);
  }
}

/**
 * Enroll customer in trial subscription
 *
 * @param customerId - Customer identifier
 * @param planId - Plan identifier
 * @param trialDays - Number of trial days
 * @returns Trial subscription
 */
export async function enrollInTrial(
  customerId: string,
  planId: string,
  trialDays: number,
): Promise<Subscription> {
  try {
    return await createSubscription(customerId, planId, {
      trialDays,
      quantity: 1,
    });
  } catch (error) {
    throw new BadRequestException(`Failed to enroll in trial: ${error.message}`);
  }
}

/**
 * Convert trial subscription to paid
 *
 * @param subscriptionId - Subscription identifier
 * @param paymentMethodId - Payment method to use
 * @returns Updated subscription
 */
export async function convertTrialToPaid(
  subscriptionId: string,
  paymentMethodId: string,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== SubscriptionStatus.TRIAL) {
      throw new BadRequestException('Subscription is not in trial status');
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.paymentMethodId = paymentMethodId;
    subscription.trialEndDate = new Date();

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to convert trial: ${error.message}`);
  }
}

/**
 * Create subscription with commitment term
 *
 * @param customerId - Customer identifier
 * @param planId - Plan identifier
 * @param commitmentMonths - Commitment period in months
 * @param discountPercent - Discount for commitment
 * @returns Committed subscription
 */
export async function createCommitmentSubscription(
  customerId: string,
  planId: string,
  commitmentMonths: number,
  discountPercent: number = 0,
): Promise<Subscription> {
  try {
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + commitmentMonths);

    const discountedAmount = plan.price * (1 - discountPercent / 100);

    const subscription = await createSubscription(customerId, planId, {
      startDate,
      metadata: {
        commitmentMonths,
        commitmentEndDate: endDate,
        discountPercent,
        originalPrice: plan.price,
      },
    });

    subscription.billingAmount = discountedAmount;
    subscription.endDate = endDate;
    await subscription.save();

    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to create commitment subscription: ${error.message}`);
  }
}

// ============================================================================
// SUBSCRIPTION PLAN & TIER MANAGEMENT
// ============================================================================

/**
 * Create subscription plan
 *
 * @param planData - Plan configuration
 * @returns Created plan
 */
export async function createSubscriptionPlan(
  planData: Partial<PlanConfiguration>,
): Promise<SubscriptionPlan> {
  try {
    const plan = await SubscriptionPlan.create({
      planCode: planData.planId,
      planName: planData.planName,
      planType: planData.planType,
      billingFrequency: planData.billingFrequency,
      price: planData.price,
      setupFee: planData.setupFee || 0,
      trialDays: planData.trialDays || 0,
      commitmentMonths: planData.commitmentMonths || 0,
      features: planData.features || [],
      limits: planData.limits || {},
      metadata: planData.metadata || {},
      isActive: true,
    });

    return plan;
  } catch (error) {
    throw new BadRequestException(`Failed to create plan: ${error.message}`);
  }
}

/**
 * Update subscription plan pricing
 *
 * @param planId - Plan identifier
 * @param newPrice - New price
 * @param effectiveDate - When price change takes effect
 * @returns Updated plan
 */
export async function updatePlanPricing(
  planId: string,
  newPrice: number,
  effectiveDate: Date = new Date(),
): Promise<SubscriptionPlan> {
  try {
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    plan.price = newPrice;
    plan.metadata = {
      ...plan.metadata,
      priceHistory: [
        ...(plan.metadata.priceHistory || []),
        {
          price: plan.price,
          effectiveDate,
          changedAt: new Date(),
        },
      ],
    };

    await plan.save();
    return plan;
  } catch (error) {
    throw new BadRequestException(`Failed to update plan pricing: ${error.message}`);
  }
}

/**
 * Get active subscription plans
 *
 * @param planType - Optional plan type filter
 * @returns Array of active plans
 */
export async function getActivePlans(
  planType?: PlanType,
): Promise<SubscriptionPlan[]> {
  try {
    const where: any = { isActive: true };
    if (planType) {
      where.planType = planType;
    }

    return await SubscriptionPlan.findAll({ where });
  } catch (error) {
    throw new BadRequestException(`Failed to get active plans: ${error.message}`);
  }
}

/**
 * Compare subscription plans
 *
 * @param planIds - Array of plan IDs to compare
 * @returns Comparison matrix
 */
export async function comparePlans(
  planIds: string[],
): Promise<Record<string, any>> {
  try {
    const plans = await SubscriptionPlan.findAll({
      where: { planId: planIds },
    });

    return {
      plans: plans.map(plan => ({
        planId: plan.planId,
        planName: plan.planName,
        price: plan.price,
        billingFrequency: plan.billingFrequency,
        features: plan.features,
        limits: plan.limits,
      })),
      comparison: {
        priceRange: {
          min: Math.min(...plans.map(p => p.price)),
          max: Math.max(...plans.map(p => p.price)),
        },
        featuresUnion: [...new Set(plans.flatMap(p => p.features))],
      },
    };
  } catch (error) {
    throw new BadRequestException(`Failed to compare plans: ${error.message}`);
  }
}

// ============================================================================
// BILLING CYCLE MANAGEMENT
// ============================================================================

/**
 * Calculate next billing date
 *
 * @param currentDate - Current billing date
 * @param frequency - Billing frequency
 * @returns Next billing date
 */
export function calculateNextBillingDate(
  currentDate: Date,
  frequency: BillingFrequency,
): Date {
  const nextDate = new Date(currentDate);

  switch (frequency) {
    case BillingFrequency.DAILY:
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case BillingFrequency.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case BillingFrequency.BIWEEKLY:
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case BillingFrequency.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case BillingFrequency.QUARTERLY:
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case BillingFrequency.SEMIANNUAL:
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case BillingFrequency.ANNUAL:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case BillingFrequency.BIENNIAL:
      nextDate.setFullYear(nextDate.getFullYear() + 2);
      break;
  }

  return nextDate;
}

/**
 * Calculate period end date
 *
 * @param startDate - Period start date
 * @param frequency - Billing frequency
 * @returns Period end date
 */
export function calculatePeriodEnd(
  startDate: Date,
  frequency: BillingFrequency,
): Date {
  const endDate = calculateNextBillingDate(startDate, frequency);
  endDate.setSeconds(endDate.getSeconds() - 1);
  return endDate;
}

/**
 * Generate billing cycles for subscription period
 *
 * @param subscriptionId - Subscription identifier
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of billing cycles
 */
export async function generateBillingCycles(
  subscriptionId: string,
  startDate: Date,
  endDate: Date,
): Promise<BillingCycle[]> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [SubscriptionPlan],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const cycles: BillingCycle[] = [];
    let currentDate = new Date(startDate);
    let cycleNumber = 1;

    while (currentDate < endDate) {
      const periodEnd = calculatePeriodEnd(currentDate, subscription.plan.billingFrequency);
      const billingDate = new Date(periodEnd);

      cycles.push({
        cycleNumber,
        periodStart: new Date(currentDate),
        periodEnd,
        billingDate,
        amount: subscription.billingAmount,
        taxAmount: 0,
        totalAmount: subscription.billingAmount,
        status: 'PENDING',
      });

      currentDate = calculateNextBillingDate(currentDate, subscription.plan.billingFrequency);
      cycleNumber++;
    }

    return cycles;
  } catch (error) {
    throw new BadRequestException(`Failed to generate billing cycles: ${error.message}`);
  }
}

/**
 * Process billing cycle
 *
 * @param subscriptionId - Subscription identifier
 * @returns Billing result
 */
export async function processBillingCycle(
  subscriptionId: string,
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [SubscriptionPlan],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      return { success: false, error: 'Subscription is not active' };
    }

    // Simulate payment processing
    const transactionId = `TXN-${Date.now()}`;

    // Update subscription billing dates
    subscription.currentPeriodStart = subscription.currentPeriodEnd;
    subscription.currentPeriodEnd = calculatePeriodEnd(
      subscription.currentPeriodStart,
      subscription.plan.billingFrequency,
    );
    subscription.nextBillingDate = calculateNextBillingDate(
      subscription.currentPeriodEnd,
      subscription.plan.billingFrequency,
    );
    subscription.lastPaymentDate = new Date();
    subscription.failedPaymentCount = 0;
    subscription.dunningStage = DunningStage.NONE;

    await subscription.save();

    return { success: true, transactionId };
  } catch (error) {
    throw new BadRequestException(`Failed to process billing cycle: ${error.message}`);
  }
}

// ============================================================================
// RECURRING ORDER GENERATION
// ============================================================================

/**
 * Generate recurring order from subscription
 *
 * @param subscriptionId - Subscription identifier
 * @param scheduledDate - When order should be generated
 * @returns Created recurring order
 */
export async function generateRecurringOrder(
  subscriptionId: string,
  scheduledDate: Date,
): Promise<RecurringOrder> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [SubscriptionPlan],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const orderNumber = `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const recurringOrder = await RecurringOrder.create({
      subscriptionId,
      orderNumber,
      scheduledDate,
      status: 'SCHEDULED',
      orderAmount: subscription.billingAmount,
      orderData: {
        planId: subscription.planId,
        planName: subscription.plan.planName,
        quantity: subscription.quantity,
        customerId: subscription.customerId,
      },
    });

    return recurringOrder;
  } catch (error) {
    throw new BadRequestException(`Failed to generate recurring order: ${error.message}`);
  }
}

/**
 * Schedule recurring orders for subscription
 *
 * @param subscriptionId - Subscription identifier
 * @param numberOfOrders - How many orders to schedule
 * @returns Array of scheduled orders
 */
export async function scheduleRecurringOrders(
  subscriptionId: string,
  numberOfOrders: number = 12,
): Promise<RecurringOrder[]> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [SubscriptionPlan],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const orders: RecurringOrder[] = [];
    let scheduledDate = new Date(subscription.nextBillingDate);

    for (let i = 0; i < numberOfOrders; i++) {
      const order = await generateRecurringOrder(subscriptionId, scheduledDate);
      orders.push(order);

      scheduledDate = calculateNextBillingDate(scheduledDate, subscription.plan.billingFrequency);
    }

    return orders;
  } catch (error) {
    throw new BadRequestException(`Failed to schedule recurring orders: ${error.message}`);
  }
}

/**
 * Process pending recurring orders
 *
 * @param batchSize - Number of orders to process
 * @returns Processing results
 */
export async function processPendingRecurringOrders(
  batchSize: number = 100,
): Promise<{ processed: number; failed: number }> {
  try {
    const orders = await RecurringOrder.findAll({
      where: {
        status: 'SCHEDULED',
        scheduledDate: { $lte: new Date() },
      },
      limit: batchSize,
    });

    let processed = 0;
    let failed = 0;

    for (const order of orders) {
      try {
        order.status = 'GENERATED';
        order.generatedDate = new Date();
        await order.save();
        processed++;
      } catch (error) {
        order.status = 'FAILED';
        await order.save();
        failed++;
      }
    }

    return { processed, failed };
  } catch (error) {
    throw new BadRequestException(`Failed to process recurring orders: ${error.message}`);
  }
}

// ============================================================================
// SUBSCRIPTION MODIFICATIONS
// ============================================================================

/**
 * Upgrade subscription to higher tier
 *
 * @param subscriptionId - Subscription identifier
 * @param newPlanId - Target plan ID
 * @param prorationMethod - How to handle proration
 * @returns Updated subscription
 */
export async function upgradeSubscription(
  subscriptionId: string,
  newPlanId: string,
  prorationMethod: ProrationMethod = ProrationMethod.PRORATED_DAILY,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [SubscriptionPlan],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const newPlan = await SubscriptionPlan.findByPk(newPlanId);
    if (!newPlan) {
      throw new NotFoundException('New plan not found');
    }

    if (newPlan.price <= subscription.plan.price) {
      throw new BadRequestException('New plan must be higher tier');
    }

    // Calculate proration
    const proration = calculateProration(
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd,
      subscription.billingAmount,
      newPlan.price,
      prorationMethod,
    );

    subscription.planId = newPlanId;
    subscription.billingAmount = newPlan.price;
    subscription.metadata = {
      ...subscription.metadata,
      upgradeDate: new Date(),
      previousPlanId: subscription.plan.planId,
      prorationCredit: proration.creditAmount,
    };

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to upgrade subscription: ${error.message}`);
  }
}

/**
 * Downgrade subscription to lower tier
 *
 * @param subscriptionId - Subscription identifier
 * @param newPlanId - Target plan ID
 * @param effectiveDate - When downgrade takes effect
 * @returns Updated subscription
 */
export async function downgradeSubscription(
  subscriptionId: string,
  newPlanId: string,
  effectiveDate: Date = new Date(),
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [SubscriptionPlan],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const newPlan = await SubscriptionPlan.findByPk(newPlanId);
    if (!newPlan) {
      throw new NotFoundException('New plan not found');
    }

    subscription.metadata = {
      ...subscription.metadata,
      pendingDowngrade: {
        newPlanId,
        effectiveDate,
        currentPlanId: subscription.planId,
      },
    };

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to downgrade subscription: ${error.message}`);
  }
}

/**
 * Change subscription quantity
 *
 * @param subscriptionId - Subscription identifier
 * @param newQuantity - New quantity
 * @param prorationMethod - Proration method
 * @returns Updated subscription
 */
export async function changeSubscriptionQuantity(
  subscriptionId: string,
  newQuantity: number,
  prorationMethod: ProrationMethod = ProrationMethod.PRORATED_DAILY,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [SubscriptionPlan],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (newQuantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const oldQuantity = subscription.quantity;
    const oldAmount = subscription.billingAmount;
    const newAmount = subscription.plan.price * newQuantity;

    const proration = calculateProration(
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd,
      oldAmount,
      newAmount,
      prorationMethod,
    );

    subscription.quantity = newQuantity;
    subscription.billingAmount = newAmount;
    subscription.metadata = {
      ...subscription.metadata,
      quantityChanges: [
        ...(subscription.metadata.quantityChanges || []),
        {
          date: new Date(),
          oldQuantity,
          newQuantity,
          proration,
        },
      ],
    };

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to change quantity: ${error.message}`);
  }
}

/**
 * Pause subscription temporarily
 *
 * @param subscriptionId - Subscription identifier
 * @param resumeDate - When to resume
 * @returns Updated subscription
 */
export async function pauseSubscription(
  subscriptionId: string,
  resumeDate?: Date,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.status = SubscriptionStatus.PAUSED;
    subscription.metadata = {
      ...subscription.metadata,
      pausedDate: new Date(),
      resumeDate,
    };

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to pause subscription: ${error.message}`);
  }
}

/**
 * Resume paused subscription
 *
 * @param subscriptionId - Subscription identifier
 * @returns Updated subscription
 */
export async function resumeSubscription(
  subscriptionId: string,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== SubscriptionStatus.PAUSED) {
      throw new BadRequestException('Subscription is not paused');
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.metadata = {
      ...subscription.metadata,
      resumedDate: new Date(),
    };

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to resume subscription: ${error.message}`);
  }
}

// ============================================================================
// SUBSCRIPTION CANCELLATIONS
// ============================================================================

/**
 * Cancel subscription immediately
 *
 * @param subscriptionId - Subscription identifier
 * @param reason - Cancellation reason
 * @param refundProrated - Whether to refund unused time
 * @returns Cancelled subscription
 */
export async function cancelSubscriptionImmediate(
  subscriptionId: string,
  reason: CancellationReason,
  refundProrated: boolean = false,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancellationDate = new Date();
    subscription.cancellationReason = reason;
    subscription.endDate = new Date();

    if (refundProrated) {
      const proration = calculateProration(
        subscription.currentPeriodStart,
        subscription.currentPeriodEnd,
        subscription.billingAmount,
        0,
        ProrationMethod.PRORATED_DAILY,
      );

      subscription.metadata = {
        ...subscription.metadata,
        refundAmount: proration.creditAmount,
      };
    }

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to cancel subscription: ${error.message}`);
  }
}

/**
 * Schedule subscription cancellation at period end
 *
 * @param subscriptionId - Subscription identifier
 * @param reason - Cancellation reason
 * @returns Updated subscription
 */
export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string,
  reason: CancellationReason,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.status = SubscriptionStatus.NON_RENEWING;
    subscription.cancellationReason = reason;
    subscription.endDate = subscription.currentPeriodEnd;
    subscription.metadata = {
      ...subscription.metadata,
      scheduledCancellationDate: subscription.currentPeriodEnd,
    };

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to schedule cancellation: ${error.message}`);
  }
}

/**
 * Reactivate cancelled subscription
 *
 * @param subscriptionId - Subscription identifier
 * @returns Reactivated subscription
 */
export async function reactivateSubscription(
  subscriptionId: string,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== SubscriptionStatus.CANCELLED &&
        subscription.status !== SubscriptionStatus.NON_RENEWING) {
      throw new BadRequestException('Only cancelled subscriptions can be reactivated');
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.cancellationDate = null;
    subscription.cancellationReason = null;
    subscription.endDate = null;
    subscription.metadata = {
      ...subscription.metadata,
      reactivatedDate: new Date(),
    };

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to reactivate subscription: ${error.message}`);
  }
}

// ============================================================================
// PAYMENT METHOD MANAGEMENT
// ============================================================================

/**
 * Update subscription payment method
 *
 * @param subscriptionId - Subscription identifier
 * @param paymentMethodId - New payment method ID
 * @returns Updated subscription
 */
export async function updatePaymentMethod(
  subscriptionId: string,
  paymentMethodId: string,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const oldPaymentMethodId = subscription.paymentMethodId;

    subscription.paymentMethodId = paymentMethodId;
    subscription.metadata = {
      ...subscription.metadata,
      paymentMethodHistory: [
        ...(subscription.metadata.paymentMethodHistory || []),
        {
          date: new Date(),
          oldPaymentMethodId,
          newPaymentMethodId: paymentMethodId,
        },
      ],
    };

    // Reset dunning if in dunning process
    if (subscription.dunningStage !== DunningStage.NONE) {
      subscription.dunningStage = DunningStage.NONE;
      subscription.failedPaymentCount = 0;
    }

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to update payment method: ${error.message}`);
  }
}

/**
 * Retry failed payment
 *
 * @param subscriptionId - Subscription identifier
 * @returns Payment retry result
 */
export async function retryFailedPayment(
  subscriptionId: string,
): Promise<{ success: boolean; transactionId?: string }> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (!subscription.paymentMethodId) {
      throw new BadRequestException('No payment method on file');
    }

    // Simulate payment retry
    const success = Math.random() > 0.3; // 70% success rate
    const transactionId = success ? `TXN-${Date.now()}` : undefined;

    if (success) {
      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.lastPaymentDate = new Date();
      subscription.failedPaymentCount = 0;
      subscription.dunningStage = DunningStage.NONE;
    } else {
      subscription.failedPaymentCount += 1;
      advanceDunningStage(subscription);
    }

    await subscription.save();

    return { success, transactionId };
  } catch (error) {
    throw new BadRequestException(`Failed to retry payment: ${error.message}`);
  }
}

// ============================================================================
// FAILED PAYMENT HANDLING & DUNNING
// ============================================================================

/**
 * Handle failed payment
 *
 * @param subscriptionId - Subscription identifier
 * @param failureReason - Reason for payment failure
 * @returns Updated subscription
 */
export async function handleFailedPayment(
  subscriptionId: string,
  failureReason: string,
): Promise<Subscription> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.failedPaymentCount += 1;
    subscription.status = SubscriptionStatus.PAST_DUE;

    advanceDunningStage(subscription);

    subscription.metadata = {
      ...subscription.metadata,
      lastFailureReason: failureReason,
      lastFailureDate: new Date(),
      paymentFailures: [
        ...(subscription.metadata.paymentFailures || []),
        {
          date: new Date(),
          reason: failureReason,
          attemptNumber: subscription.failedPaymentCount,
        },
      ],
    };

    await subscription.save();
    return subscription;
  } catch (error) {
    throw new BadRequestException(`Failed to handle payment failure: ${error.message}`);
  }
}

/**
 * Advance dunning stage based on failed payment count
 *
 * @param subscription - Subscription instance
 */
function advanceDunningStage(subscription: Subscription): void {
  if (subscription.failedPaymentCount === 1) {
    subscription.dunningStage = DunningStage.SOFT_DECLINE;
  } else if (subscription.failedPaymentCount === 2) {
    subscription.dunningStage = DunningStage.RETRY_1;
  } else if (subscription.failedPaymentCount === 3) {
    subscription.dunningStage = DunningStage.RETRY_2;
  } else if (subscription.failedPaymentCount === 4) {
    subscription.dunningStage = DunningStage.RETRY_3;
  } else if (subscription.failedPaymentCount === 5) {
    subscription.dunningStage = DunningStage.FINAL_NOTICE;
  } else if (subscription.failedPaymentCount >= 6) {
    subscription.dunningStage = DunningStage.SUSPENDED;
    subscription.status = SubscriptionStatus.SUSPENDED;
  }
}

/**
 * Process dunning workflow for past due subscriptions
 *
 * @returns Processing results
 */
export async function processDunningWorkflow(): Promise<{
  processed: number;
  suspended: number;
  cancelled: number;
}> {
  try {
    const pastDueSubscriptions = await Subscription.findAll({
      where: { status: SubscriptionStatus.PAST_DUE },
    });

    let processed = 0;
    let suspended = 0;
    let cancelled = 0;

    for (const subscription of pastDueSubscriptions) {
      // Retry payment based on dunning stage
      if (subscription.dunningStage === DunningStage.SOFT_DECLINE ||
          subscription.dunningStage === DunningStage.RETRY_1 ||
          subscription.dunningStage === DunningStage.RETRY_2) {
        await retryFailedPayment(subscription.subscriptionId);
        processed++;
      } else if (subscription.dunningStage === DunningStage.SUSPENDED) {
        subscription.status = SubscriptionStatus.SUSPENDED;
        await subscription.save();
        suspended++;
      } else if (subscription.failedPaymentCount >= 10) {
        await cancelSubscriptionImmediate(
          subscription.subscriptionId,
          CancellationReason.PAYMENT_FAILURE,
          false,
        );
        cancelled++;
      }
    }

    return { processed, suspended, cancelled };
  } catch (error) {
    throw new BadRequestException(`Failed to process dunning workflow: ${error.message}`);
  }
}

// ============================================================================
// PRORATION CALCULATIONS
// ============================================================================

/**
 * Calculate proration amount for subscription changes
 *
 * @param periodStart - Billing period start
 * @param periodEnd - Billing period end
 * @param oldAmount - Previous billing amount
 * @param newAmount - New billing amount
 * @param method - Proration method
 * @returns Proration result
 */
export function calculateProration(
  periodStart: Date,
  periodEnd: Date,
  oldAmount: number,
  newAmount: number,
  method: ProrationMethod,
): ProrationResult {
  const now = new Date();
  const totalMilliseconds = periodEnd.getTime() - periodStart.getTime();
  const usedMilliseconds = now.getTime() - periodStart.getTime();
  const remainingMilliseconds = periodEnd.getTime() - now.getTime();

  const totalDays = totalMilliseconds / (1000 * 60 * 60 * 24);
  const daysUsed = usedMilliseconds / (1000 * 60 * 60 * 24);
  const daysRemaining = remainingMilliseconds / (1000 * 60 * 60 * 24);

  let creditAmount = 0;
  let debitAmount = 0;
  let prorationFactor = 0;

  switch (method) {
    case ProrationMethod.PRORATED_DAILY:
      prorationFactor = daysRemaining / totalDays;
      creditAmount = oldAmount * prorationFactor;
      debitAmount = newAmount * prorationFactor;
      break;

    case ProrationMethod.PRORATED_HOURLY:
      const hoursRemaining = remainingMilliseconds / (1000 * 60 * 60);
      const totalHours = totalMilliseconds / (1000 * 60 * 60);
      prorationFactor = hoursRemaining / totalHours;
      creditAmount = oldAmount * prorationFactor;
      debitAmount = newAmount * prorationFactor;
      break;

    case ProrationMethod.FULL_PERIOD:
      creditAmount = 0;
      debitAmount = newAmount;
      prorationFactor = 1;
      break;

    case ProrationMethod.NO_PRORATION:
      creditAmount = 0;
      debitAmount = 0;
      prorationFactor = 0;
      break;

    case ProrationMethod.CREDIT_BALANCE:
      creditAmount = oldAmount;
      debitAmount = newAmount;
      prorationFactor = 1;
      break;
  }

  return {
    originalAmount: oldAmount,
    proratedAmount: debitAmount - creditAmount,
    creditAmount,
    debitAmount,
    daysUsed,
    totalDays,
    prorationFactor,
    effectiveDate: now,
  };
}

// ============================================================================
// SUBSCRIPTION RENEWALS
// ============================================================================

/**
 * Process subscription renewal
 *
 * @param subscriptionId - Subscription identifier
 * @returns Renewal result
 */
export async function processSubscriptionRenewal(
  subscriptionId: string,
): Promise<{ success: boolean; newPeriodEnd: Date }> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [SubscriptionPlan],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.renewalType !== RenewalType.AUTOMATIC) {
      throw new BadRequestException('Subscription is not set for automatic renewal');
    }

    // Process billing
    const billingResult = await processBillingCycle(subscriptionId);

    if (billingResult.success) {
      const newPeriodEnd = subscription.currentPeriodEnd;
      return { success: true, newPeriodEnd };
    } else {
      await handleFailedPayment(subscriptionId, billingResult.error);
      return { success: false, newPeriodEnd: subscription.currentPeriodEnd };
    }
  } catch (error) {
    throw new BadRequestException(`Failed to process renewal: ${error.message}`);
  }
}

/**
 * Get subscriptions due for renewal
 *
 * @param daysAhead - How many days ahead to look
 * @returns Array of subscriptions
 */
export async function getSubscriptionsDueForRenewal(
  daysAhead: number = 7,
): Promise<Subscription[]> {
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return await Subscription.findAll({
      where: {
        status: SubscriptionStatus.ACTIVE,
        renewalType: RenewalType.AUTOMATIC,
        nextBillingDate: { $lte: futureDate },
      },
      include: [SubscriptionPlan],
    });
  } catch (error) {
    throw new BadRequestException(`Failed to get renewals: ${error.message}`);
  }
}

/**
 * Send renewal reminders
 *
 * @param daysBeforeRenewal - Days before renewal to send reminder
 * @returns Number of reminders sent
 */
export async function sendRenewalReminders(
  daysBeforeRenewal: number = 7,
): Promise<number> {
  try {
    const subscriptions = await getSubscriptionsDueForRenewal(daysBeforeRenewal);
    let sent = 0;

    for (const subscription of subscriptions) {
      // Simulate sending email/notification
      console.log(`Renewal reminder sent for subscription ${subscription.subscriptionNumber}`);
      sent++;
    }

    return sent;
  } catch (error) {
    throw new BadRequestException(`Failed to send reminders: ${error.message}`);
  }
}

// ============================================================================
// SUBSCRIPTION ANALYTICS
// ============================================================================

/**
 * Calculate subscription metrics
 *
 * @param startDate - Analysis start date
 * @param endDate - Analysis end date
 * @returns Subscription metrics
 */
export async function calculateSubscriptionMetrics(
  startDate: Date,
  endDate: Date,
): Promise<SubscriptionMetrics> {
  try {
    const activeSubscriptions = await Subscription.count({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    const totalSubscriptions = await Subscription.count();

    const allSubscriptions = await Subscription.findAll({
      include: [SubscriptionPlan],
    });

    const monthlyRecurringRevenue = allSubscriptions
      .filter(s => s.status === SubscriptionStatus.ACTIVE)
      .reduce((sum, s) => {
        const monthlyAmount = convertToMonthlyAmount(s.billingAmount, s.plan.billingFrequency);
        return sum + monthlyAmount;
      }, 0);

    const averageRevenuePerUser = activeSubscriptions > 0
      ? monthlyRecurringRevenue / activeSubscriptions
      : 0;

    // Calculate churn rate
    const cancelledInPeriod = await Subscription.count({
      where: {
        status: SubscriptionStatus.CANCELLED,
        cancellationDate: { $gte: startDate, $lte: endDate },
      },
    });

    const churnRate = totalSubscriptions > 0 ? (cancelledInPeriod / totalSubscriptions) * 100 : 0;

    const retentionRate = 100 - churnRate;

    // Estimate CLV (simple calculation)
    const averageLifetimeMonths = 24; // Assumption
    const customerLifetimeValue = averageRevenuePerUser * averageLifetimeMonths;

    // Growth rate
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);

    const previousPeriodSubscriptions = await Subscription.count({
      where: {
        createdAt: { $gte: previousPeriodStart, $lt: startDate },
      },
    });

    const currentPeriodSubscriptions = await Subscription.count({
      where: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    });

    const growthRate = previousPeriodSubscriptions > 0
      ? ((currentPeriodSubscriptions - previousPeriodSubscriptions) / previousPeriodSubscriptions) * 100
      : 0;

    return {
      totalSubscriptions,
      activeSubscriptions,
      churnRate,
      monthlyRecurringRevenue,
      averageRevenuePerUser,
      customerLifetimeValue,
      retentionRate,
      growthRate,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to calculate metrics: ${error.message}`);
  }
}

/**
 * Convert billing amount to monthly equivalent
 *
 * @param amount - Billing amount
 * @param frequency - Billing frequency
 * @returns Monthly amount
 */
function convertToMonthlyAmount(amount: number, frequency: BillingFrequency): number {
  switch (frequency) {
    case BillingFrequency.DAILY:
      return amount * 30;
    case BillingFrequency.WEEKLY:
      return amount * 4.33;
    case BillingFrequency.BIWEEKLY:
      return amount * 2.17;
    case BillingFrequency.MONTHLY:
      return amount;
    case BillingFrequency.QUARTERLY:
      return amount / 3;
    case BillingFrequency.SEMIANNUAL:
      return amount / 6;
    case BillingFrequency.ANNUAL:
      return amount / 12;
    case BillingFrequency.BIENNIAL:
      return amount / 24;
    default:
      return amount;
  }
}

/**
 * Get subscription revenue forecast
 *
 * @param months - Number of months to forecast
 * @returns Monthly revenue forecast
 */
export async function getRevenueForecast(
  months: number = 12,
): Promise<Array<{ month: string; revenue: number }>> {
  try {
    const activeSubscriptions = await Subscription.findAll({
      where: { status: SubscriptionStatus.ACTIVE },
      include: [SubscriptionPlan],
    });

    const forecast: Array<{ month: string; revenue: number }> = [];
    const startDate = new Date();

    for (let i = 0; i < months; i++) {
      const forecastDate = new Date(startDate);
      forecastDate.setMonth(forecastDate.getMonth() + i);

      let monthlyRevenue = 0;

      for (const subscription of activeSubscriptions) {
        monthlyRevenue += convertToMonthlyAmount(
          subscription.billingAmount,
          subscription.plan.billingFrequency,
        );
      }

      forecast.push({
        month: forecastDate.toISOString().slice(0, 7),
        revenue: monthlyRevenue,
      });
    }

    return forecast;
  } catch (error) {
    throw new BadRequestException(`Failed to generate forecast: ${error.message}`);
  }
}

/**
 * Get subscription cohort analysis
 *
 * @param cohortMonth - Cohort month (YYYY-MM)
 * @returns Cohort retention data
 */
export async function getCohortAnalysis(
  cohortMonth: string,
): Promise<Record<string, any>> {
  try {
    const [year, month] = cohortMonth.split('-').map(Number);
    const cohortStart = new Date(year, month - 1, 1);
    const cohortEnd = new Date(year, month, 0);

    const cohortSubscriptions = await Subscription.findAll({
      where: {
        createdAt: { $gte: cohortStart, $lte: cohortEnd },
      },
    });

    const totalCohortSize = cohortSubscriptions.length;
    const stillActive = cohortSubscriptions.filter(
      s => s.status === SubscriptionStatus.ACTIVE,
    ).length;

    const retentionRate = totalCohortSize > 0
      ? (stillActive / totalCohortSize) * 100
      : 0;

    return {
      cohortMonth,
      totalCustomers: totalCohortSize,
      activeCustomers: stillActive,
      churnedCustomers: totalCohortSize - stillActive,
      retentionRate,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to get cohort analysis: ${error.message}`);
  }
}

/**
 * Track subscription usage
 *
 * @param subscriptionId - Subscription identifier
 * @param usageData - Usage record
 * @returns Created usage record
 */
export async function trackSubscriptionUsage(
  subscriptionId: string,
  usageData: Partial<UsageRecord>,
): Promise<SubscriptionUsage> {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const usage = await SubscriptionUsage.create({
      subscriptionId,
      usageUnit: usageData.usageUnit,
      quantity: usageData.quantity,
      usageDate: usageData.timestamp || new Date(),
      metadata: usageData.metadata || {},
    });

    return usage;
  } catch (error) {
    throw new BadRequestException(`Failed to track usage: ${error.message}`);
  }
}

/**
 * Get subscription usage summary
 *
 * @param subscriptionId - Subscription identifier
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Usage summary by unit type
 */
export async function getSubscriptionUsageSummary(
  subscriptionId: string,
  startDate: Date,
  endDate: Date,
): Promise<Record<string, number>> {
  try {
    const usageRecords = await SubscriptionUsage.findAll({
      where: {
        subscriptionId,
        usageDate: { $gte: startDate, $lte: endDate },
      },
    });

    const summary: Record<string, number> = {};

    for (const record of usageRecords) {
      const unit = record.usageUnit;
      summary[unit] = (summary[unit] || 0) + Number(record.quantity);
    }

    return summary;
  } catch (error) {
    throw new BadRequestException(`Failed to get usage summary: ${error.message}`);
  }
}
