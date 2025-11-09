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
import { Model } from 'sequelize-typescript';
/**
 * Subscription status lifecycle
 */
export declare enum SubscriptionStatus {
    PENDING = "PENDING",
    TRIAL = "TRIAL",
    ACTIVE = "ACTIVE",
    PAST_DUE = "PAST_DUE",
    PAUSED = "PAUSED",
    SUSPENDED = "SUSPENDED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    NON_RENEWING = "NON_RENEWING",
    PENDING_CANCELLATION = "PENDING_CANCELLATION"
}
/**
 * Billing frequency for subscriptions
 */
export declare enum BillingFrequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    BIWEEKLY = "BIWEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    SEMIANNUAL = "SEMIANNUAL",
    ANNUAL = "ANNUAL",
    BIENNIAL = "BIENNIAL",
    CUSTOM = "CUSTOM"
}
/**
 * Subscription plan types
 */
export declare enum PlanType {
    BASIC = "BASIC",
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM",
    ENTERPRISE = "ENTERPRISE",
    CUSTOM = "CUSTOM",
    TIERED = "TIERED",
    USAGE_BASED = "USAGE_BASED",
    HYBRID = "HYBRID"
}
/**
 * Proration methods
 */
export declare enum ProrationMethod {
    FULL_PERIOD = "FULL_PERIOD",
    PRORATED_DAILY = "PRORATED_DAILY",
    PRORATED_HOURLY = "PRORATED_HOURLY",
    NO_PRORATION = "NO_PRORATION",
    CREDIT_BALANCE = "CREDIT_BALANCE"
}
/**
 * Renewal types
 */
export declare enum RenewalType {
    AUTOMATIC = "AUTOMATIC",
    MANUAL = "MANUAL",
    OPT_IN = "OPT_IN",
    OPT_OUT = "OPT_OUT"
}
/**
 * Cancellation reasons
 */
export declare enum CancellationReason {
    CUSTOMER_REQUEST = "CUSTOMER_REQUEST",
    PAYMENT_FAILURE = "PAYMENT_FAILURE",
    FRAUD = "FRAUD",
    TOO_EXPENSIVE = "TOO_EXPENSIVE",
    SWITCHING_TO_COMPETITOR = "SWITCHING_TO_COMPETITOR",
    NOT_USING = "NOT_USING",
    MISSING_FEATURES = "MISSING_FEATURES",
    QUALITY_ISSUES = "QUALITY_ISSUES",
    OTHER = "OTHER"
}
/**
 * Payment method types
 */
export declare enum PaymentMethodType {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    BANK_ACCOUNT = "BANK_ACCOUNT",
    PAYPAL = "PAYPAL",
    INVOICE = "INVOICE",
    WIRE_TRANSFER = "WIRE_TRANSFER",
    CRYPTOCURRENCY = "CRYPTOCURRENCY"
}
/**
 * Dunning stages for failed payments
 */
export declare enum DunningStage {
    NONE = "NONE",
    SOFT_DECLINE = "SOFT_DECLINE",
    RETRY_1 = "RETRY_1",
    RETRY_2 = "RETRY_2",
    RETRY_3 = "RETRY_3",
    FINAL_NOTICE = "FINAL_NOTICE",
    SUSPENDED = "SUSPENDED",
    CANCELLED = "CANCELLED"
}
/**
 * Subscription modification types
 */
export declare enum ModificationType {
    UPGRADE = "UPGRADE",
    DOWNGRADE = "DOWNGRADE",
    ADDON = "ADDON",
    REMOVE_ADDON = "REMOVE_ADDON",
    QUANTITY_CHANGE = "QUANTITY_CHANGE",
    PLAN_CHANGE = "PLAN_CHANGE",
    PAYMENT_METHOD_CHANGE = "PAYMENT_METHOD_CHANGE"
}
/**
 * Usage tracking units
 */
export declare enum UsageUnit {
    API_CALLS = "API_CALLS",
    USERS = "USERS",
    STORAGE_GB = "STORAGE_GB",
    BANDWIDTH_GB = "BANDWIDTH_GB",
    TRANSACTIONS = "TRANSACTIONS",
    HOURS = "HOURS",
    UNITS = "UNITS",
    CUSTOM = "CUSTOM"
}
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
/**
 * Subscription Plan Model
 */
export declare class SubscriptionPlan extends Model {
    planId: string;
    planCode: string;
    planName: string;
    planType: PlanType;
    billingFrequency: BillingFrequency;
    price: number;
    setupFee: number;
    trialDays: number;
    commitmentMonths: number;
    features: string[];
    limits: Record<string, number>;
    isActive: boolean;
    metadata: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    subscriptions: Subscription[];
}
/**
 * Subscription Model
 */
export declare class Subscription extends Model {
    subscriptionId: string;
    subscriptionNumber: string;
    customerId: string;
    planId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    trialEndDate: Date;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    nextBillingDate: Date;
    billingAmount: number;
    quantity: number;
    renewalType: RenewalType;
    paymentMethodId: string;
    dunningStage: DunningStage;
    failedPaymentCount: number;
    lastPaymentDate: Date;
    cancellationDate: Date;
    cancellationReason: CancellationReason;
    metadata: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    recurringOrders: RecurringOrder[];
    history: SubscriptionHistory[];
    static generateSubscriptionNumber(instance: Subscription): Promise<void>;
    static trackChanges(instance: Subscription): Promise<void>;
}
/**
 * Recurring Order Model
 */
export declare class RecurringOrder extends Model {
    recurringOrderId: string;
    subscriptionId: string;
    subscription: Subscription;
    orderNumber: string;
    scheduledDate: Date;
    generatedDate: Date;
    status: string;
    orderAmount: number;
    orderData: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Subscription History Model
 */
export declare class SubscriptionHistory extends Model {
    historyId: string;
    subscriptionId: string;
    subscription: Subscription;
    changeType: string;
    changedFields: string[];
    previousValues: Record<string, unknown>;
    newValues: Record<string, unknown>;
    changedBy: string;
    createdAt: Date;
}
/**
 * Usage Tracking Model
 */
export declare class SubscriptionUsage extends Model {
    usageId: string;
    subscriptionId: string;
    subscription: Subscription;
    usageUnit: UsageUnit;
    quantity: number;
    usageDate: Date;
    metadata: Record<string, unknown>;
    createdAt: Date;
}
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
export declare function createSubscription(customerId: string, planId: string, options?: {
    quantity?: number;
    startDate?: Date;
    paymentMethodId?: string;
    metadata?: Record<string, unknown>;
    trialDays?: number;
}): Promise<Subscription>;
/**
 * Enroll customer in trial subscription
 *
 * @param customerId - Customer identifier
 * @param planId - Plan identifier
 * @param trialDays - Number of trial days
 * @returns Trial subscription
 */
export declare function enrollInTrial(customerId: string, planId: string, trialDays: number): Promise<Subscription>;
/**
 * Convert trial subscription to paid
 *
 * @param subscriptionId - Subscription identifier
 * @param paymentMethodId - Payment method to use
 * @returns Updated subscription
 */
export declare function convertTrialToPaid(subscriptionId: string, paymentMethodId: string): Promise<Subscription>;
/**
 * Create subscription with commitment term
 *
 * @param customerId - Customer identifier
 * @param planId - Plan identifier
 * @param commitmentMonths - Commitment period in months
 * @param discountPercent - Discount for commitment
 * @returns Committed subscription
 */
export declare function createCommitmentSubscription(customerId: string, planId: string, commitmentMonths: number, discountPercent?: number): Promise<Subscription>;
/**
 * Create subscription plan
 *
 * @param planData - Plan configuration
 * @returns Created plan
 */
export declare function createSubscriptionPlan(planData: Partial<PlanConfiguration>): Promise<SubscriptionPlan>;
/**
 * Update subscription plan pricing
 *
 * @param planId - Plan identifier
 * @param newPrice - New price
 * @param effectiveDate - When price change takes effect
 * @returns Updated plan
 */
export declare function updatePlanPricing(planId: string, newPrice: number, effectiveDate?: Date): Promise<SubscriptionPlan>;
/**
 * Get active subscription plans
 *
 * @param planType - Optional plan type filter
 * @returns Array of active plans
 */
export declare function getActivePlans(planType?: PlanType): Promise<SubscriptionPlan[]>;
/**
 * Compare subscription plans
 *
 * @param planIds - Array of plan IDs to compare
 * @returns Comparison matrix
 */
export declare function comparePlans(planIds: string[]): Promise<Record<string, any>>;
/**
 * Calculate next billing date
 *
 * @param currentDate - Current billing date
 * @param frequency - Billing frequency
 * @returns Next billing date
 */
export declare function calculateNextBillingDate(currentDate: Date, frequency: BillingFrequency): Date;
/**
 * Calculate period end date
 *
 * @param startDate - Period start date
 * @param frequency - Billing frequency
 * @returns Period end date
 */
export declare function calculatePeriodEnd(startDate: Date, frequency: BillingFrequency): Date;
/**
 * Generate billing cycles for subscription period
 *
 * @param subscriptionId - Subscription identifier
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of billing cycles
 */
export declare function generateBillingCycles(subscriptionId: string, startDate: Date, endDate: Date): Promise<BillingCycle[]>;
/**
 * Process billing cycle
 *
 * @param subscriptionId - Subscription identifier
 * @returns Billing result
 */
export declare function processBillingCycle(subscriptionId: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
}>;
/**
 * Generate recurring order from subscription
 *
 * @param subscriptionId - Subscription identifier
 * @param scheduledDate - When order should be generated
 * @returns Created recurring order
 */
export declare function generateRecurringOrder(subscriptionId: string, scheduledDate: Date): Promise<RecurringOrder>;
/**
 * Schedule recurring orders for subscription
 *
 * @param subscriptionId - Subscription identifier
 * @param numberOfOrders - How many orders to schedule
 * @returns Array of scheduled orders
 */
export declare function scheduleRecurringOrders(subscriptionId: string, numberOfOrders?: number): Promise<RecurringOrder[]>;
/**
 * Process pending recurring orders
 *
 * @param batchSize - Number of orders to process
 * @returns Processing results
 */
export declare function processPendingRecurringOrders(batchSize?: number): Promise<{
    processed: number;
    failed: number;
}>;
/**
 * Upgrade subscription to higher tier
 *
 * @param subscriptionId - Subscription identifier
 * @param newPlanId - Target plan ID
 * @param prorationMethod - How to handle proration
 * @returns Updated subscription
 */
export declare function upgradeSubscription(subscriptionId: string, newPlanId: string, prorationMethod?: ProrationMethod): Promise<Subscription>;
/**
 * Downgrade subscription to lower tier
 *
 * @param subscriptionId - Subscription identifier
 * @param newPlanId - Target plan ID
 * @param effectiveDate - When downgrade takes effect
 * @returns Updated subscription
 */
export declare function downgradeSubscription(subscriptionId: string, newPlanId: string, effectiveDate?: Date): Promise<Subscription>;
/**
 * Change subscription quantity
 *
 * @param subscriptionId - Subscription identifier
 * @param newQuantity - New quantity
 * @param prorationMethod - Proration method
 * @returns Updated subscription
 */
export declare function changeSubscriptionQuantity(subscriptionId: string, newQuantity: number, prorationMethod?: ProrationMethod): Promise<Subscription>;
/**
 * Pause subscription temporarily
 *
 * @param subscriptionId - Subscription identifier
 * @param resumeDate - When to resume
 * @returns Updated subscription
 */
export declare function pauseSubscription(subscriptionId: string, resumeDate?: Date): Promise<Subscription>;
/**
 * Resume paused subscription
 *
 * @param subscriptionId - Subscription identifier
 * @returns Updated subscription
 */
export declare function resumeSubscription(subscriptionId: string): Promise<Subscription>;
/**
 * Cancel subscription immediately
 *
 * @param subscriptionId - Subscription identifier
 * @param reason - Cancellation reason
 * @param refundProrated - Whether to refund unused time
 * @returns Cancelled subscription
 */
export declare function cancelSubscriptionImmediate(subscriptionId: string, reason: CancellationReason, refundProrated?: boolean): Promise<Subscription>;
/**
 * Schedule subscription cancellation at period end
 *
 * @param subscriptionId - Subscription identifier
 * @param reason - Cancellation reason
 * @returns Updated subscription
 */
export declare function cancelSubscriptionAtPeriodEnd(subscriptionId: string, reason: CancellationReason): Promise<Subscription>;
/**
 * Reactivate cancelled subscription
 *
 * @param subscriptionId - Subscription identifier
 * @returns Reactivated subscription
 */
export declare function reactivateSubscription(subscriptionId: string): Promise<Subscription>;
/**
 * Update subscription payment method
 *
 * @param subscriptionId - Subscription identifier
 * @param paymentMethodId - New payment method ID
 * @returns Updated subscription
 */
export declare function updatePaymentMethod(subscriptionId: string, paymentMethodId: string): Promise<Subscription>;
/**
 * Retry failed payment
 *
 * @param subscriptionId - Subscription identifier
 * @returns Payment retry result
 */
export declare function retryFailedPayment(subscriptionId: string): Promise<{
    success: boolean;
    transactionId?: string;
}>;
/**
 * Handle failed payment
 *
 * @param subscriptionId - Subscription identifier
 * @param failureReason - Reason for payment failure
 * @returns Updated subscription
 */
export declare function handleFailedPayment(subscriptionId: string, failureReason: string): Promise<Subscription>;
/**
 * Process dunning workflow for past due subscriptions
 *
 * @returns Processing results
 */
export declare function processDunningWorkflow(): Promise<{
    processed: number;
    suspended: number;
    cancelled: number;
}>;
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
export declare function calculateProration(periodStart: Date, periodEnd: Date, oldAmount: number, newAmount: number, method: ProrationMethod): ProrationResult;
/**
 * Process subscription renewal
 *
 * @param subscriptionId - Subscription identifier
 * @returns Renewal result
 */
export declare function processSubscriptionRenewal(subscriptionId: string): Promise<{
    success: boolean;
    newPeriodEnd: Date;
}>;
/**
 * Get subscriptions due for renewal
 *
 * @param daysAhead - How many days ahead to look
 * @returns Array of subscriptions
 */
export declare function getSubscriptionsDueForRenewal(daysAhead?: number): Promise<Subscription[]>;
/**
 * Send renewal reminders
 *
 * @param daysBeforeRenewal - Days before renewal to send reminder
 * @returns Number of reminders sent
 */
export declare function sendRenewalReminders(daysBeforeRenewal?: number): Promise<number>;
/**
 * Calculate subscription metrics
 *
 * @param startDate - Analysis start date
 * @param endDate - Analysis end date
 * @returns Subscription metrics
 */
export declare function calculateSubscriptionMetrics(startDate: Date, endDate: Date): Promise<SubscriptionMetrics>;
/**
 * Get subscription revenue forecast
 *
 * @param months - Number of months to forecast
 * @returns Monthly revenue forecast
 */
export declare function getRevenueForecast(months?: number): Promise<Array<{
    month: string;
    revenue: number;
}>>;
/**
 * Get subscription cohort analysis
 *
 * @param cohortMonth - Cohort month (YYYY-MM)
 * @returns Cohort retention data
 */
export declare function getCohortAnalysis(cohortMonth: string): Promise<Record<string, any>>;
/**
 * Track subscription usage
 *
 * @param subscriptionId - Subscription identifier
 * @param usageData - Usage record
 * @returns Created usage record
 */
export declare function trackSubscriptionUsage(subscriptionId: string, usageData: Partial<UsageRecord>): Promise<SubscriptionUsage>;
/**
 * Get subscription usage summary
 *
 * @param subscriptionId - Subscription identifier
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Usage summary by unit type
 */
export declare function getSubscriptionUsageSummary(subscriptionId: string, startDate: Date, endDate: Date): Promise<Record<string, number>>;
//# sourceMappingURL=subscription-recurring-kit.d.ts.map