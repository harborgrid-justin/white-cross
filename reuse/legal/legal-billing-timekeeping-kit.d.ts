/**
 * LOC: LEGAL_BILLING_TIMEKEEPING_KIT_001
 * File: /reuse/legal/legal-billing-timekeeping-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Legal billing modules
 *   - Time tracking controllers
 *   - Invoice management services
 *   - Trust accounting services
 *   - WIP management services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * Time entry status lifecycle
 */
export declare enum TimeEntryStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    APPROVED = "approved",
    REJECTED = "rejected",
    BILLED = "billed",
    WRITTEN_OFF = "written_off"
}
/**
 * Billing rate types
 */
export declare enum BillingRateType {
    HOURLY = "hourly",
    FLAT_FEE = "flat_fee",
    CONTINGENCY = "contingency",
    BLENDED = "blended",
    STATUTORY = "statutory",
    CUSTOM = "custom"
}
/**
 * Invoice status lifecycle
 */
export declare enum InvoiceStatus {
    DRAFT = "draft",
    PENDING_REVIEW = "pending_review",
    APPROVED = "approved",
    SENT = "sent",
    PARTIALLY_PAID = "partially_paid",
    PAID = "paid",
    OVERDUE = "overdue",
    VOID = "void",
    WRITTEN_OFF = "written_off"
}
/**
 * Expense categories
 */
export declare enum ExpenseCategory {
    FILING_FEES = "filing_fees",
    COURT_COSTS = "court_costs",
    EXPERT_WITNESS = "expert_witness",
    DEPOSITION = "deposition",
    COPYING = "copying",
    POSTAGE = "postage",
    TRAVEL = "travel",
    MEALS = "meals",
    RESEARCH = "research",
    MEDICAL_RECORDS = "medical_records",
    TRANSCRIPTS = "transcripts",
    PROCESS_SERVICE = "process_service",
    OTHER = "other"
}
/**
 * Trust account transaction types
 */
export declare enum TrustAccountTransactionType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    TRANSFER = "transfer",
    INTEREST = "interest",
    FEE = "fee",
    REFUND = "refund",
    ADJUSTMENT = "adjustment"
}
/**
 * WIP (Work in Progress) status
 */
export declare enum WIPStatus {
    UNBILLED = "unbilled",
    BILLED = "billed",
    WRITTEN_OFF = "written_off",
    TRANSFERRED = "transferred"
}
/**
 * Payment status
 */
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded",
    CANCELLED = "cancelled"
}
/**
 * Payment methods
 */
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    ACH = "ach",
    WIRE_TRANSFER = "wire_transfer",
    CHECK = "check",
    CASH = "cash",
    TRUST_TRANSFER = "trust_transfer",
    OTHER = "other"
}
/**
 * Time entry entity
 */
export interface TimeEntry {
    id: string;
    timekeeperId: string;
    matterId: string;
    clientId: string;
    date: Date;
    hours: number;
    description: string;
    taskCode?: string;
    activityCode?: string;
    billable: boolean;
    billingRate?: number;
    billingAmount?: number;
    status: TimeEntryStatus;
    approvedBy?: string;
    approvedAt?: Date;
    invoiceId?: string;
    billedAt?: Date;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Billing rate entity
 */
export interface BillingRate {
    id: string;
    timekeeperId?: string;
    clientId?: string;
    matterId?: string;
    matterTypeId?: string;
    rateType: BillingRateType;
    hourlyRate?: number;
    flatFeeAmount?: number;
    contingencyPercentage?: number;
    currency: string;
    effectiveDate: Date;
    expirationDate?: Date;
    isActive: boolean;
    description?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Invoice entity
 */
export interface Invoice {
    id: string;
    invoiceNumber: string;
    matterId: string;
    clientId: string;
    invoiceDate: Date;
    dueDate: Date;
    periodStart: Date;
    periodEnd: Date;
    status: InvoiceStatus;
    lineItems: InvoiceLineItem[];
    subtotal: number;
    taxRate?: number;
    taxAmount?: number;
    discountAmount?: number;
    totalAmount: number;
    amountPaid: number;
    amountDue: number;
    currency: string;
    notes?: string;
    termsAndConditions?: string;
    sentAt?: Date;
    paidAt?: Date;
    voidedAt?: Date;
    voidReason?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Invoice line item entity
 */
export interface InvoiceLineItem {
    id: string;
    invoiceId: string;
    type: 'time' | 'expense' | 'fee' | 'adjustment';
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    timeEntryId?: string;
    expenseId?: string;
    taxable: boolean;
    metadata: Record<string, any>;
}
/**
 * Expense entity
 */
export interface Expense {
    id: string;
    matterId: string;
    clientId: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    currency: string;
    expenseDate: Date;
    reimbursable: boolean;
    billable: boolean;
    receiptUrl?: string;
    vendorName?: string;
    status: 'pending' | 'approved' | 'rejected' | 'reimbursed' | 'billed';
    approvedBy?: string;
    approvedAt?: Date;
    invoiceId?: string;
    billedAt?: Date;
    reimbursedAt?: Date;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Trust account entity
 */
export interface TrustAccount {
    id: string;
    accountNumber: string;
    accountName: string;
    clientId?: string;
    matterId?: string;
    accountType: 'iolta' | 'client_trust' | 'operating';
    balance: number;
    currency: string;
    bankName: string;
    bankAccountNumber: string;
    routingNumber?: string;
    isActive: boolean;
    openedDate: Date;
    closedDate?: Date;
    metadata: Record<string, any>;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Trust transaction entity
 */
export interface TrustTransaction {
    id: string;
    trustAccountId: string;
    transactionType: TrustAccountTransactionType;
    amount: number;
    balance: number;
    transactionDate: Date;
    description: string;
    reference?: string;
    relatedInvoiceId?: string;
    relatedPaymentId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    reconciledAt?: Date;
    metadata: Record<string, any>;
    createdBy: string;
    createdAt: Date;
}
/**
 * WIP (Work in Progress) entry entity
 */
export interface WIPEntry {
    id: string;
    matterId: string;
    clientId: string;
    timekeeperId?: string;
    type: 'time' | 'expense' | 'fee';
    description: string;
    date: Date;
    hours?: number;
    amount: number;
    status: WIPStatus;
    timeEntryId?: string;
    expenseId?: string;
    invoiceId?: string;
    billedAt?: Date;
    writtenOffAt?: Date;
    writeOffReason?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Payment entity
 */
export interface Payment {
    id: string;
    invoiceId: string;
    clientId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentDate: Date;
    status: PaymentStatus;
    reference?: string;
    transactionId?: string;
    checkNumber?: string;
    trustAccountId?: string;
    notes?: string;
    processedAt?: Date;
    failureReason?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Timekeeper profile entity
 */
export interface TimekeeperProfile {
    id: string;
    userId: string;
    employeeId?: string;
    firstName: string;
    lastName: string;
    title: string;
    barNumber?: string;
    jurisdiction?: string;
    defaultBillingRate?: number;
    isActive: boolean;
    metadata: Record<string, any>;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Aging report data
 */
export interface AgingReport {
    generatedAt: Date;
    totalOutstanding: number;
    currency: string;
    buckets: {
        current: number;
        days30: number;
        days60: number;
        days90: number;
        days120Plus: number;
    };
    invoicesByBucket: {
        current: Invoice[];
        days30: Invoice[];
        days60: Invoice[];
        days90: Invoice[];
        days120Plus: Invoice[];
    };
}
/**
 * Time entry filters
 */
export interface TimeEntryFilters {
    timekeeperId?: string;
    matterId?: string;
    clientId?: string;
    startDate?: Date;
    endDate?: Date;
    statuses?: TimeEntryStatus[];
    billable?: boolean;
    tenantId?: string;
}
/**
 * Invoice filters
 */
export interface InvoiceFilters {
    clientId?: string;
    matterId?: string;
    statuses?: InvoiceStatus[];
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    tenantId?: string;
}
/**
 * Time entry creation schema
 */
export declare const TimeEntryCreateSchema: any;
/**
 * Billing rate creation schema
 */
export declare const BillingRateCreateSchema: any;
/**
 * Invoice creation schema
 */
export declare const InvoiceCreateSchema: any;
/**
 * Expense creation schema
 */
export declare const ExpenseCreateSchema: any;
/**
 * Trust transaction schema
 */
export declare const TrustTransactionCreateSchema: any;
/**
 * Payment creation schema
 */
export declare const PaymentCreateSchema: any;
/**
 * Time Entry Sequelize Model
 */
export declare class TimeEntryModel extends Model {
    id: string;
    timekeeperId: string;
    matterId: string;
    clientId: string;
    date: Date;
    hours: number;
    description: string;
    taskCode?: string;
    activityCode?: string;
    billable: boolean;
    billingRate?: number;
    billingAmount?: number;
    status: TimeEntryStatus;
    approvedBy?: string;
    approvedAt?: Date;
    invoiceId?: string;
    billedAt?: Date;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Billing Rate Sequelize Model
 */
export declare class BillingRateModel extends Model {
    id: string;
    timekeeperId?: string;
    clientId?: string;
    matterId?: string;
    matterTypeId?: string;
    rateType: BillingRateType;
    hourlyRate?: number;
    flatFeeAmount?: number;
    contingencyPercentage?: number;
    currency: string;
    effectiveDate: Date;
    expirationDate?: Date;
    isActive: boolean;
    description?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Invoice Sequelize Model
 */
export declare class InvoiceModel extends Model {
    id: string;
    invoiceNumber: string;
    matterId: string;
    clientId: string;
    invoiceDate: Date;
    dueDate: Date;
    periodStart: Date;
    periodEnd: Date;
    status: InvoiceStatus;
    subtotal: number;
    taxRate?: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    amountPaid: number;
    amountDue: number;
    currency: string;
    notes?: string;
    termsAndConditions?: string;
    sentAt?: Date;
    paidAt?: Date;
    voidedAt?: Date;
    voidReason?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    lineItems: InvoiceLineItemModel[];
}
/**
 * Invoice Line Item Sequelize Model
 */
export declare class InvoiceLineItemModel extends Model {
    id: string;
    invoiceId: string;
    type: 'time' | 'expense' | 'fee' | 'adjustment';
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    timeEntryId?: string;
    expenseId?: string;
    taxable: boolean;
    metadata: Record<string, any>;
    invoice: InvoiceModel;
}
/**
 * Expense Sequelize Model
 */
export declare class ExpenseModel extends Model {
    id: string;
    matterId: string;
    clientId: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    currency: string;
    expenseDate: Date;
    reimbursable: boolean;
    billable: boolean;
    receiptUrl?: string;
    vendorName?: string;
    status: 'pending' | 'approved' | 'rejected' | 'reimbursed' | 'billed';
    approvedBy?: string;
    approvedAt?: Date;
    invoiceId?: string;
    billedAt?: Date;
    reimbursedAt?: Date;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Trust Account Sequelize Model
 */
export declare class TrustAccountModel extends Model {
    id: string;
    accountNumber: string;
    accountName: string;
    clientId?: string;
    matterId?: string;
    accountType: 'iolta' | 'client_trust' | 'operating';
    balance: number;
    currency: string;
    bankName: string;
    bankAccountNumber: string;
    routingNumber?: string;
    isActive: boolean;
    openedDate: Date;
    closedDate?: Date;
    metadata: Record<string, any>;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
    transactions: TrustTransactionModel[];
}
/**
 * Trust Transaction Sequelize Model
 */
export declare class TrustTransactionModel extends Model {
    id: string;
    trustAccountId: string;
    transactionType: TrustAccountTransactionType;
    amount: number;
    balance: number;
    transactionDate: Date;
    description: string;
    reference?: string;
    relatedInvoiceId?: string;
    relatedPaymentId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    reconciledAt?: Date;
    metadata: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    trustAccount: TrustAccountModel;
}
/**
 * WIP Entry Sequelize Model
 */
export declare class WIPEntryModel extends Model {
    id: string;
    matterId: string;
    clientId: string;
    timekeeperId?: string;
    type: 'time' | 'expense' | 'fee';
    description: string;
    date: Date;
    hours?: number;
    amount: number;
    status: WIPStatus;
    timeEntryId?: string;
    expenseId?: string;
    invoiceId?: string;
    billedAt?: Date;
    writtenOffAt?: Date;
    writeOffReason?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Payment Sequelize Model
 */
export declare class PaymentModel extends Model {
    id: string;
    invoiceId: string;
    clientId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentDate: Date;
    status: PaymentStatus;
    reference?: string;
    transactionId?: string;
    checkNumber?: string;
    trustAccountId?: string;
    notes?: string;
    processedAt?: Date;
    failureReason?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Register billing and timekeeping configuration namespace
 *
 * @returns Configuration factory for NestJS
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   load: [registerBillingConfig()],
 * })
 * ```
 */
export declare function registerBillingConfig(): any;
/**
 * Create billing and timekeeping configuration module
 *
 * @returns DynamicModule for billing config
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [createBillingConfigModule()],
 * })
 * export class BillingModule {}
 * ```
 */
export declare function createBillingConfigModule(): DynamicModule;
/**
 * Create time entry
 *
 * @param data - Time entry creation data
 * @param userId - User creating the time entry
 * @param configService - Configuration service
 * @returns Created time entry
 *
 * @example
 * ```typescript
 * const timeEntry = await createTimeEntry({
 *   timekeeperId: 'user_123',
 *   matterId: 'matter_456',
 *   clientId: 'client_789',
 *   date: new Date(),
 *   hours: 2.5,
 *   description: 'Client consultation regarding case strategy',
 *   billable: true,
 *   billingRate: 350,
 * }, 'user_123', configService);
 * ```
 */
export declare function createTimeEntry(data: z.infer<typeof TimeEntryCreateSchema>, userId: string, configService: ConfigService): Promise<TimeEntry>;
/**
 * Update time entry
 *
 * @param timeEntryId - Time entry ID
 * @param updates - Fields to update
 * @param userId - User updating the entry
 * @param repository - Time entry repository
 *
 * @example
 * ```typescript
 * await updateTimeEntry('entry_123', { hours: 3.0, description: 'Updated description' }, 'user_456', timeEntryRepo);
 * ```
 */
export declare function updateTimeEntry(timeEntryId: string, updates: Partial<TimeEntry>, userId: string, repository: any): Promise<void>;
/**
 * Delete time entry
 *
 * @param timeEntryId - Time entry ID
 * @param userId - User deleting the entry
 * @param repository - Time entry repository
 *
 * @example
 * ```typescript
 * await deleteTimeEntry('entry_123', 'user_456', timeEntryRepo);
 * ```
 */
export declare function deleteTimeEntry(timeEntryId: string, userId: string, repository: any): Promise<void>;
/**
 * Get time entries by matter
 *
 * @param matterId - Matter ID
 * @param filters - Additional filters
 * @param repository - Time entry repository
 * @returns Array of time entries
 *
 * @example
 * ```typescript
 * const entries = await getTimeEntriesByMatter('matter_123', { billable: true }, timeEntryRepo);
 * ```
 */
export declare function getTimeEntriesByMatter(matterId: string, filters: Partial<TimeEntryFilters>, repository: any): Promise<TimeEntry[]>;
/**
 * Get time entries by timekeeper
 *
 * @param timekeeperId - Timekeeper ID
 * @param filters - Additional filters
 * @param repository - Time entry repository
 * @returns Array of time entries
 *
 * @example
 * ```typescript
 * const entries = await getTimeEntriesByTimekeeper('user_123', { startDate: new Date('2025-01-01') }, timeEntryRepo);
 * ```
 */
export declare function getTimeEntriesByTimekeeper(timekeeperId: string, filters: Partial<TimeEntryFilters>, repository: any): Promise<TimeEntry[]>;
/**
 * Calculate billable hours for a matter or timekeeper
 *
 * @param filters - Filters to apply
 * @param repository - Time entry repository
 * @returns Total billable hours and amount
 *
 * @example
 * ```typescript
 * const totals = await calculateBillableHours({ matterId: 'matter_123', billable: true }, timeEntryRepo);
 * console.log(`Total: ${totals.hours} hours, $${totals.amount}`);
 * ```
 */
export declare function calculateBillableHours(filters: TimeEntryFilters, repository: any): Promise<{
    hours: number;
    amount: number;
}>;
/**
 * Create billing rate
 *
 * @param data - Billing rate creation data
 * @returns Created billing rate
 *
 * @example
 * ```typescript
 * const rate = await createBillingRate({
 *   timekeeperId: 'user_123',
 *   rateType: BillingRateType.HOURLY,
 *   hourlyRate: 350,
 *   currency: 'USD',
 *   effectiveDate: new Date(),
 * });
 * ```
 */
export declare function createBillingRate(data: z.infer<typeof BillingRateCreateSchema>): Promise<BillingRate>;
/**
 * Get billing rate for timekeeper
 *
 * @param timekeeperId - Timekeeper ID
 * @param matterId - Matter ID (optional)
 * @param clientId - Client ID (optional)
 * @param date - Effective date (defaults to today)
 * @param repository - Billing rate repository
 * @returns Applicable billing rate
 *
 * @example
 * ```typescript
 * const rate = await getBillingRateForTimekeeper('user_123', 'matter_456', 'client_789', new Date(), rateRepo);
 * ```
 */
export declare function getBillingRateForTimekeeper(timekeeperId: string, matterId: string | undefined, clientId: string | undefined, date: Date, repository: any): Promise<BillingRate | null>;
/**
 * Update billing rate
 *
 * @param rateId - Billing rate ID
 * @param updates - Fields to update
 * @param repository - Billing rate repository
 *
 * @example
 * ```typescript
 * await updateBillingRate('rate_123', { hourlyRate: 375, isActive: true }, rateRepo);
 * ```
 */
export declare function updateBillingRate(rateId: string, updates: Partial<BillingRate>, repository: any): Promise<void>;
/**
 * Calculate billing amount based on rate
 *
 * @param hours - Hours worked
 * @param rate - Billing rate
 * @param settlementAmount - Settlement amount (for contingency)
 * @returns Calculated billing amount
 *
 * @example
 * ```typescript
 * const amount = calculateBillingAmount(5.5, billingRate);
 * ```
 */
export declare function calculateBillingAmount(hours: number, rate: BillingRate, settlementAmount?: number): number;
/**
 * Generate unique invoice number
 *
 * @param configService - Configuration service
 * @returns Unique invoice number
 *
 * @example
 * ```typescript
 * const invoiceNumber = await generateInvoiceNumber(configService);
 * // 'INV-2025-001234'
 * ```
 */
export declare function generateInvoiceNumber(configService: ConfigService): Promise<string>;
/**
 * Create invoice
 *
 * @param data - Invoice creation data
 * @param userId - User creating the invoice
 * @param configService - Configuration service
 * @returns Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createInvoice({
 *   matterId: 'matter_123',
 *   clientId: 'client_456',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   periodStart: new Date('2025-01-01'),
 *   periodEnd: new Date('2025-01-31'),
 * }, 'user_789', configService);
 * ```
 */
export declare function createInvoice(data: z.infer<typeof InvoiceCreateSchema>, userId: string, configService: ConfigService): Promise<Invoice>;
/**
 * Add line item to invoice
 *
 * @param invoiceId - Invoice ID
 * @param lineItem - Line item data
 * @param repository - Invoice repository
 * @returns Updated invoice
 *
 * @example
 * ```typescript
 * await addLineItemToInvoice('invoice_123', {
 *   type: 'time',
 *   description: 'Legal research',
 *   quantity: 5.5,
 *   unitPrice: 350,
 *   amount: 1925,
 *   taxable: true,
 * }, invoiceRepo);
 * ```
 */
export declare function addLineItemToInvoice(invoiceId: string, lineItem: Omit<InvoiceLineItem, 'id' | 'invoiceId'>, repository: any): Promise<void>;
/**
 * Calculate invoice total
 *
 * @param invoice - Invoice to calculate
 * @returns Updated invoice with calculated totals
 *
 * @example
 * ```typescript
 * const updatedInvoice = calculateInvoiceTotal(invoice);
 * ```
 */
export declare function calculateInvoiceTotal(invoice: Invoice): Invoice;
/**
 * Finalize invoice for sending
 *
 * @param invoiceId - Invoice ID
 * @param userId - User finalizing invoice
 * @param repository - Invoice repository
 *
 * @example
 * ```typescript
 * await finalizeInvoice('invoice_123', 'user_456', invoiceRepo);
 * ```
 */
export declare function finalizeInvoice(invoiceId: string, userId: string, repository: any): Promise<void>;
/**
 * Send invoice to client
 *
 * @param invoiceId - Invoice ID
 * @param userId - User sending invoice
 * @param repository - Invoice repository
 *
 * @example
 * ```typescript
 * await sendInvoice('invoice_123', 'user_456', invoiceRepo);
 * ```
 */
export declare function sendInvoice(invoiceId: string, userId: string, repository: any): Promise<void>;
/**
 * Mark invoice as paid
 *
 * @param invoiceId - Invoice ID
 * @param paymentAmount - Payment amount
 * @param userId - User recording payment
 * @param repository - Invoice repository
 *
 * @example
 * ```typescript
 * await markInvoiceAsPaid('invoice_123', 5000, 'user_456', invoiceRepo);
 * ```
 */
export declare function markInvoiceAsPaid(invoiceId: string, paymentAmount: number, userId: string, repository: any): Promise<void>;
/**
 * Void invoice
 *
 * @param invoiceId - Invoice ID
 * @param reason - Reason for voiding
 * @param userId - User voiding invoice
 * @param repository - Invoice repository
 *
 * @example
 * ```typescript
 * await voidInvoice('invoice_123', 'Duplicate invoice created', 'user_456', invoiceRepo);
 * ```
 */
export declare function voidInvoice(invoiceId: string, reason: string, userId: string, repository: any): Promise<void>;
/**
 * Get invoices by matter
 *
 * @param matterId - Matter ID
 * @param filters - Additional filters
 * @param repository - Invoice repository
 * @returns Array of invoices
 *
 * @example
 * ```typescript
 * const invoices = await getInvoicesByMatter('matter_123', { statuses: [InvoiceStatus.SENT] }, invoiceRepo);
 * ```
 */
export declare function getInvoicesByMatter(matterId: string, filters: Partial<InvoiceFilters>, repository: any): Promise<Invoice[]>;
/**
 * Get invoices by client
 *
 * @param clientId - Client ID
 * @param filters - Additional filters
 * @param repository - Invoice repository
 * @returns Array of invoices
 *
 * @example
 * ```typescript
 * const invoices = await getInvoicesByClient('client_123', {}, invoiceRepo);
 * ```
 */
export declare function getInvoicesByClient(clientId: string, filters: Partial<InvoiceFilters>, repository: any): Promise<Invoice[]>;
/**
 * Create expense
 *
 * @param data - Expense creation data
 * @param userId - User creating expense
 * @returns Created expense
 *
 * @example
 * ```typescript
 * const expense = await createExpense({
 *   matterId: 'matter_123',
 *   clientId: 'client_456',
 *   category: ExpenseCategory.FILING_FEES,
 *   description: 'Court filing fee for motion',
 *   amount: 425,
 *   expenseDate: new Date(),
 *   billable: true,
 * }, 'user_789');
 * ```
 */
export declare function createExpense(data: z.infer<typeof ExpenseCreateSchema>, userId: string): Promise<Expense>;
/**
 * Get expenses by matter
 *
 * @param matterId - Matter ID
 * @param filters - Additional filters
 * @param repository - Expense repository
 * @returns Array of expenses
 *
 * @example
 * ```typescript
 * const expenses = await getExpensesByMatter('matter_123', { billable: true }, expenseRepo);
 * ```
 */
export declare function getExpensesByMatter(matterId: string, filters: {
    category?: ExpenseCategory;
    billable?: boolean;
    status?: string;
}, repository: any): Promise<Expense[]>;
/**
 * Reimburse expense
 *
 * @param expenseId - Expense ID
 * @param userId - User processing reimbursement
 * @param repository - Expense repository
 *
 * @example
 * ```typescript
 * await reimburseExpense('expense_123', 'user_456', expenseRepo);
 * ```
 */
export declare function reimburseExpense(expenseId: string, userId: string, repository: any): Promise<void>;
/**
 * Create trust account
 *
 * @param accountData - Trust account data
 * @returns Created trust account
 *
 * @example
 * ```typescript
 * const trustAccount = await createTrustAccount({
 *   accountNumber: 'TRUST-001',
 *   accountName: 'Client Trust Account',
 *   accountType: 'client_trust',
 *   bankName: 'First National Bank',
 *   bankAccountNumber: '123456789',
 *   openedDate: new Date(),
 * });
 * ```
 */
export declare function createTrustAccount(accountData: Omit<TrustAccount, 'id' | 'balance' | 'createdAt' | 'updatedAt'>): Promise<TrustAccount>;
/**
 * Deposit to trust account
 *
 * @param accountId - Trust account ID
 * @param amount - Deposit amount
 * @param description - Transaction description
 * @param userId - User making deposit
 * @param repository - Trust account repository
 * @returns Trust transaction
 *
 * @example
 * ```typescript
 * await depositToTrust('account_123', 5000, 'Retainer payment from client', 'user_456', trustRepo);
 * ```
 */
export declare function depositToTrust(accountId: string, amount: number, description: string, userId: string, repository: any): Promise<TrustTransaction>;
/**
 * Withdraw from trust account
 *
 * @param accountId - Trust account ID
 * @param amount - Withdrawal amount
 * @param description - Transaction description
 * @param userId - User making withdrawal
 * @param repository - Trust account repository
 * @returns Trust transaction
 *
 * @example
 * ```typescript
 * await withdrawFromTrust('account_123', 1500, 'Payment to expert witness', 'user_456', trustRepo);
 * ```
 */
export declare function withdrawFromTrust(accountId: string, amount: number, description: string, userId: string, repository: any): Promise<TrustTransaction>;
/**
 * Transfer between trust accounts
 *
 * @param fromAccountId - Source trust account ID
 * @param toAccountId - Destination trust account ID
 * @param amount - Transfer amount
 * @param description - Transfer description
 * @param userId - User making transfer
 * @param repository - Trust account repository
 * @returns Array of trust transactions (withdrawal and deposit)
 *
 * @example
 * ```typescript
 * await transferBetweenTrust('account_123', 'account_456', 2000, 'Transfer to client matter account', 'user_789', trustRepo);
 * ```
 */
export declare function transferBetweenTrust(fromAccountId: string, toAccountId: string, amount: number, description: string, userId: string, repository: any): Promise<TrustTransaction[]>;
/**
 * Get trust account balance
 *
 * @param accountId - Trust account ID
 * @param repository - Trust account repository
 * @returns Current balance
 *
 * @example
 * ```typescript
 * const balance = await getTrustBalance('account_123', trustRepo);
 * ```
 */
export declare function getTrustBalance(accountId: string, repository: any): Promise<number>;
/**
 * Get trust transaction history
 *
 * @param accountId - Trust account ID
 * @param startDate - Start date for history
 * @param endDate - End date for history
 * @param repository - Trust transaction repository
 * @returns Array of trust transactions
 *
 * @example
 * ```typescript
 * const history = await getTrustTransactionHistory('account_123', new Date('2025-01-01'), new Date('2025-01-31'), txRepo);
 * ```
 */
export declare function getTrustTransactionHistory(accountId: string, startDate: Date, endDate: Date, repository: any): Promise<TrustTransaction[]>;
/**
 * Reconcile trust account
 *
 * @param accountId - Trust account ID
 * @param bankBalance - Balance from bank statement
 * @param reconciliationDate - Reconciliation date
 * @param userId - User performing reconciliation
 * @param repository - Trust account repository
 * @returns Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileTrustAccount('account_123', 45000, new Date(), 'user_456', trustRepo);
 * ```
 */
export declare function reconcileTrustAccount(accountId: string, bankBalance: number, reconciliationDate: Date, userId: string, repository: any): Promise<{
    systemBalance: number;
    bankBalance: number;
    difference: number;
    reconciled: boolean;
}>;
/**
 * Create WIP entry
 *
 * @param wipData - WIP entry data
 * @returns Created WIP entry
 *
 * @example
 * ```typescript
 * const wip = await createWIPEntry({
 *   matterId: 'matter_123',
 *   clientId: 'client_456',
 *   timekeeperId: 'user_789',
 *   type: 'time',
 *   description: 'Legal research',
 *   date: new Date(),
 *   hours: 3.5,
 *   amount: 1225,
 * });
 * ```
 */
export declare function createWIPEntry(wipData: Omit<WIPEntry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<WIPEntry>;
/**
 * Convert WIP to invoice
 *
 * @param matterId - Matter ID
 * @param invoiceId - Invoice ID
 * @param repository - WIP repository
 * @returns Number of WIP entries converted
 *
 * @example
 * ```typescript
 * const count = await convertWIPToInvoice('matter_123', 'invoice_456', wipRepo);
 * ```
 */
export declare function convertWIPToInvoice(matterId: string, invoiceId: string, repository: any): Promise<number>;
/**
 * Get WIP by matter
 *
 * @param matterId - Matter ID
 * @param filters - Additional filters
 * @param repository - WIP repository
 * @returns Array of WIP entries
 *
 * @example
 * ```typescript
 * const wip = await getWIPByMatter('matter_123', { status: WIPStatus.UNBILLED }, wipRepo);
 * ```
 */
export declare function getWIPByMatter(matterId: string, filters: {
    status?: WIPStatus;
    type?: 'time' | 'expense' | 'fee';
}, repository: any): Promise<WIPEntry[]>;
/**
 * Write off WIP entry
 *
 * @param wipId - WIP entry ID
 * @param reason - Write-off reason
 * @param userId - User writing off WIP
 * @param repository - WIP repository
 *
 * @example
 * ```typescript
 * await writeOffWIP('wip_123', 'Client dispute - goodwill write-off', 'user_456', wipRepo);
 * ```
 */
export declare function writeOffWIP(wipId: string, reason: string, userId: string, repository: any): Promise<void>;
/**
 * Generate aging report for outstanding invoices
 *
 * @param tenantId - Tenant ID (optional)
 * @param repository - Invoice repository
 * @returns Aging report
 *
 * @example
 * ```typescript
 * const report = await generateAgingReport('tenant_123', invoiceRepo);
 * console.log(`Total outstanding: $${report.totalOutstanding}`);
 * ```
 */
export declare function generateAgingReport(tenantId: string | undefined, repository: any): Promise<AgingReport>;
/**
 * Billing and Timekeeping Service
 * NestJS service for billing operations with dependency injection
 */
export declare class BillingTimekeepingService {
    private timeEntryRepo;
    private billingRateRepo;
    private invoiceRepo;
    private expenseRepo;
    private trustAccountRepo;
    private trustTxRepo;
    private wipRepo;
    private paymentRepo;
    private configService;
    private readonly logger;
    constructor(timeEntryRepo: typeof TimeEntryModel, billingRateRepo: typeof BillingRateModel, invoiceRepo: typeof InvoiceModel, expenseRepo: typeof ExpenseModel, trustAccountRepo: typeof TrustAccountModel, trustTxRepo: typeof TrustTransactionModel, wipRepo: typeof WIPEntryModel, paymentRepo: typeof PaymentModel, configService: ConfigService);
    /**
     * Create time entry
     */
    createTimeEntry(data: z.infer<typeof TimeEntryCreateSchema>, userId: string): Promise<TimeEntry>;
    /**
     * Get time entries by matter
     */
    getTimeEntriesByMatter(matterId: string, filters: Partial<TimeEntryFilters>): Promise<TimeEntry[]>;
    /**
     * Create invoice
     */
    createInvoice(data: z.infer<typeof InvoiceCreateSchema>, userId: string): Promise<Invoice>;
    /**
     * Send invoice
     */
    sendInvoice(invoiceId: string, userId: string): Promise<void>;
    /**
     * Create expense
     */
    createExpense(data: z.infer<typeof ExpenseCreateSchema>, userId: string): Promise<Expense>;
    /**
     * Deposit to trust
     */
    depositToTrust(accountId: string, amount: number, description: string, userId: string): Promise<TrustTransaction>;
    /**
     * Generate aging report
     */
    generateAgingReport(tenantId?: string): Promise<AgingReport>;
}
/**
 * Time Entry DTO
 */
export declare class TimeEntryDto {
    id: string;
    timekeeperId: string;
    matterId: string;
    date: Date;
    hours: number;
    description: string;
    billable: boolean;
    billingRate?: number;
    billingAmount?: number;
    status: TimeEntryStatus;
}
/**
 * Invoice DTO
 */
export declare class InvoiceDto {
    id: string;
    invoiceNumber: string;
    matterId: string;
    invoiceDate: Date;
    dueDate: Date;
    status: InvoiceStatus;
    totalAmount: number;
    amountPaid: number;
    amountDue: number;
    currency: string;
}
/**
 * Expense DTO
 */
export declare class ExpenseDto {
    id: string;
    matterId: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    expenseDate: Date;
    billable: boolean;
}
/**
 * Trust Transaction DTO
 */
export declare class TrustTransactionDto {
    id: string;
    trustAccountId: string;
    transactionType: TrustAccountTransactionType;
    amount: number;
    balance: number;
    transactionDate: Date;
    description: string;
}
declare const _default: {
    registerBillingConfig: typeof registerBillingConfig;
    createBillingConfigModule: typeof createBillingConfigModule;
    createTimeEntry: typeof createTimeEntry;
    updateTimeEntry: typeof updateTimeEntry;
    deleteTimeEntry: typeof deleteTimeEntry;
    getTimeEntriesByMatter: typeof getTimeEntriesByMatter;
    getTimeEntriesByTimekeeper: typeof getTimeEntriesByTimekeeper;
    calculateBillableHours: typeof calculateBillableHours;
    createBillingRate: typeof createBillingRate;
    getBillingRateForTimekeeper: typeof getBillingRateForTimekeeper;
    updateBillingRate: typeof updateBillingRate;
    calculateBillingAmount: typeof calculateBillingAmount;
    generateInvoiceNumber: typeof generateInvoiceNumber;
    createInvoice: typeof createInvoice;
    addLineItemToInvoice: typeof addLineItemToInvoice;
    calculateInvoiceTotal: typeof calculateInvoiceTotal;
    finalizeInvoice: typeof finalizeInvoice;
    sendInvoice: typeof sendInvoice;
    markInvoiceAsPaid: typeof markInvoiceAsPaid;
    voidInvoice: typeof voidInvoice;
    getInvoicesByMatter: typeof getInvoicesByMatter;
    getInvoicesByClient: typeof getInvoicesByClient;
    createExpense: typeof createExpense;
    getExpensesByMatter: typeof getExpensesByMatter;
    reimburseExpense: typeof reimburseExpense;
    createTrustAccount: typeof createTrustAccount;
    depositToTrust: typeof depositToTrust;
    withdrawFromTrust: typeof withdrawFromTrust;
    transferBetweenTrust: typeof transferBetweenTrust;
    getTrustBalance: typeof getTrustBalance;
    getTrustTransactionHistory: typeof getTrustTransactionHistory;
    reconcileTrustAccount: typeof reconcileTrustAccount;
    createWIPEntry: typeof createWIPEntry;
    convertWIPToInvoice: typeof convertWIPToInvoice;
    getWIPByMatter: typeof getWIPByMatter;
    writeOffWIP: typeof writeOffWIP;
    generateAgingReport: typeof generateAgingReport;
    BillingTimekeepingService: typeof BillingTimekeepingService;
};
export default _default;
//# sourceMappingURL=legal-billing-timekeeping-kit.d.ts.map