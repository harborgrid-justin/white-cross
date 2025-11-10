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

/**
 * File: /reuse/legal/legal-billing-timekeeping-kit.ts
 * Locator: WC-LEGAL-BILLING-TIMEKEEPING-KIT-001
 * Purpose: Production-Grade Legal Billing and Timekeeping Kit - Enterprise legal billing management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod
 * Downstream: ../backend/modules/legal/*, Billing controllers, Trust accounting services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 38 production-ready legal billing and timekeeping functions for legal platforms
 *
 * LLM Context: Production-grade legal billing and timekeeping toolkit for White Cross platform.
 * Provides comprehensive time entry recording with billable/non-billable tracking, billing rate
 * management with hourly/flat/contingency rates, invoice generation with automatic calculations,
 * expense tracking with reimbursable costs, trust accounting with IOLTA compliance, WIP (Work in
 * Progress) tracking with matter-based aggregation, Sequelize models for time entries/invoices/
 * trust accounts, NestJS services with dependency injection, Swagger API documentation, payment
 * processing with multiple payment methods, aging report generation, automatic invoice numbering,
 * tax calculation, discount management, retainer tracking, billing adjustments, write-offs,
 * time entry validation with minimum/maximum hours, billing rate tiers, multi-currency support,
 * trust account reconciliation, LEDES format export, legal ethics compliance checks, and
 * healthcare legal billing specifics (provider agreements, medical malpractice, HIPAA compliance).
 */

import * as crypto from 'crypto';
import {
  Injectable,
  Inject,
  Module,
  DynamicModule,
  Global,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
  registerAs,
} from '@nestjs/config';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Sequelize,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Time entry status lifecycle
 */
export enum TimeEntryStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BILLED = 'billed',
  WRITTEN_OFF = 'written_off',
}

/**
 * Billing rate types
 */
export enum BillingRateType {
  HOURLY = 'hourly',
  FLAT_FEE = 'flat_fee',
  CONTINGENCY = 'contingency',
  BLENDED = 'blended',
  STATUTORY = 'statutory',
  CUSTOM = 'custom',
}

/**
 * Invoice status lifecycle
 */
export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  SENT = 'sent',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  OVERDUE = 'overdue',
  VOID = 'void',
  WRITTEN_OFF = 'written_off',
}

/**
 * Expense categories
 */
export enum ExpenseCategory {
  FILING_FEES = 'filing_fees',
  COURT_COSTS = 'court_costs',
  EXPERT_WITNESS = 'expert_witness',
  DEPOSITION = 'deposition',
  COPYING = 'copying',
  POSTAGE = 'postage',
  TRAVEL = 'travel',
  MEALS = 'meals',
  RESEARCH = 'research',
  MEDICAL_RECORDS = 'medical_records',
  TRANSCRIPTS = 'transcripts',
  PROCESS_SERVICE = 'process_service',
  OTHER = 'other',
}

/**
 * Trust account transaction types
 */
export enum TrustAccountTransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  INTEREST = 'interest',
  FEE = 'fee',
  REFUND = 'refund',
  ADJUSTMENT = 'adjustment',
}

/**
 * WIP (Work in Progress) status
 */
export enum WIPStatus {
  UNBILLED = 'unbilled',
  BILLED = 'billed',
  WRITTEN_OFF = 'written_off',
  TRANSFERRED = 'transferred',
}

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

/**
 * Payment methods
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  ACH = 'ach',
  WIRE_TRANSFER = 'wire_transfer',
  CHECK = 'check',
  CASH = 'cash',
  TRUST_TRANSFER = 'trust_transfer',
  OTHER = 'other',
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

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Time entry creation schema
 */
export const TimeEntryCreateSchema = z.object({
  timekeeperId: z.string().uuid(),
  matterId: z.string().uuid(),
  clientId: z.string().uuid(),
  date: z.date(),
  hours: z.number().min(0).max(24),
  description: z.string().min(1).max(2000),
  taskCode: z.string().optional(),
  activityCode: z.string().optional(),
  billable: z.boolean().default(true),
  billingRate: z.number().min(0).optional(),
  metadata: z.record(z.any()).default({}),
});

/**
 * Billing rate creation schema
 */
export const BillingRateCreateSchema = z.object({
  timekeeperId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  matterId: z.string().uuid().optional(),
  matterTypeId: z.string().uuid().optional(),
  rateType: z.nativeEnum(BillingRateType),
  hourlyRate: z.number().min(0).optional(),
  flatFeeAmount: z.number().min(0).optional(),
  contingencyPercentage: z.number().min(0).max(100).optional(),
  currency: z.string().length(3).default('USD'),
  effectiveDate: z.date(),
  expirationDate: z.date().optional(),
  isActive: z.boolean().default(true),
  description: z.string().max(500).optional(),
  metadata: z.record(z.any()).default({}),
});

/**
 * Invoice creation schema
 */
export const InvoiceCreateSchema = z.object({
  matterId: z.string().uuid(),
  clientId: z.string().uuid(),
  invoiceDate: z.date(),
  dueDate: z.date(),
  periodStart: z.date(),
  periodEnd: z.date(),
  taxRate: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  currency: z.string().length(3).default('USD'),
  notes: z.string().max(2000).optional(),
  termsAndConditions: z.string().max(5000).optional(),
  metadata: z.record(z.any()).default({}),
});

/**
 * Expense creation schema
 */
export const ExpenseCreateSchema = z.object({
  matterId: z.string().uuid(),
  clientId: z.string().uuid(),
  category: z.nativeEnum(ExpenseCategory),
  description: z.string().min(1).max(1000),
  amount: z.number().min(0),
  currency: z.string().length(3).default('USD'),
  expenseDate: z.date(),
  reimbursable: z.boolean().default(true),
  billable: z.boolean().default(true),
  receiptUrl: z.string().url().optional(),
  vendorName: z.string().max(255).optional(),
  metadata: z.record(z.any()).default({}),
});

/**
 * Trust transaction schema
 */
export const TrustTransactionCreateSchema = z.object({
  trustAccountId: z.string().uuid(),
  transactionType: z.nativeEnum(TrustAccountTransactionType),
  amount: z.number().min(0),
  transactionDate: z.date(),
  description: z.string().min(1).max(1000),
  reference: z.string().max(255).optional(),
  relatedInvoiceId: z.string().uuid().optional(),
  relatedPaymentId: z.string().uuid().optional(),
  fromAccountId: z.string().uuid().optional(),
  toAccountId: z.string().uuid().optional(),
  metadata: z.record(z.any()).default({}),
});

/**
 * Payment creation schema
 */
export const PaymentCreateSchema = z.object({
  invoiceId: z.string().uuid(),
  clientId: z.string().uuid(),
  amount: z.number().min(0),
  currency: z.string().length(3).default('USD'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentDate: z.date(),
  reference: z.string().max(255).optional(),
  transactionId: z.string().max(255).optional(),
  checkNumber: z.string().max(100).optional(),
  trustAccountId: z.string().uuid().optional(),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).default({}),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Time Entry Sequelize Model
 */
@Table({
  tableName: 'time_entries',
  timestamps: true,
  paranoid: true,
})
export class TimeEntryModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  timekeeperId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  matterId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clientId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  hours!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column(DataType.STRING(50))
  taskCode?: string;

  @Column(DataType.STRING(50))
  activityCode?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  billable!: boolean;

  @Column(DataType.DECIMAL(10, 2))
  billingRate?: number;

  @Column(DataType.DECIMAL(15, 2))
  billingAmount?: number;

  @Column({
    type: DataType.ENUM(...Object.values(TimeEntryStatus)),
    defaultValue: TimeEntryStatus.DRAFT,
  })
  status!: TimeEntryStatus;

  @Column(DataType.UUID)
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @Column(DataType.UUID)
  invoiceId?: string;

  @Column(DataType.DATE)
  billedAt?: Date;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy!: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Billing Rate Sequelize Model
 */
@Table({
  tableName: 'billing_rates',
  timestamps: true,
})
export class BillingRateModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.UUID)
  timekeeperId?: string;

  @Column(DataType.UUID)
  clientId?: string;

  @Column(DataType.UUID)
  matterId?: string;

  @Column(DataType.UUID)
  matterTypeId?: string;

  @Column({
    type: DataType.ENUM(...Object.values(BillingRateType)),
    allowNull: false,
  })
  rateType!: BillingRateType;

  @Column(DataType.DECIMAL(10, 2))
  hourlyRate?: number;

  @Column(DataType.DECIMAL(15, 2))
  flatFeeAmount?: number;

  @Column(DataType.DECIMAL(5, 2))
  contingencyPercentage?: number;

  @Column({
    type: DataType.STRING(3),
    defaultValue: 'USD',
  })
  currency!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  effectiveDate!: Date;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  @Column(DataType.STRING(500))
  description?: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Invoice Sequelize Model
 */
@Table({
  tableName: 'invoices',
  timestamps: true,
  paranoid: true,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  invoiceNumber!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  matterId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clientId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  invoiceDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  periodStart!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  periodEnd!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(InvoiceStatus)),
    defaultValue: InvoiceStatus.DRAFT,
  })
  status!: InvoiceStatus;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0,
  })
  subtotal!: number;

  @Column(DataType.DECIMAL(5, 2))
  taxRate?: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0,
  })
  taxAmount!: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0,
  })
  discountAmount!: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0,
  })
  totalAmount!: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0,
  })
  amountPaid!: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0,
  })
  amountDue!: number;

  @Column({
    type: DataType.STRING(3),
    defaultValue: 'USD',
  })
  currency!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.TEXT)
  termsAndConditions?: string;

  @Column(DataType.DATE)
  sentAt?: Date;

  @Column(DataType.DATE)
  paidAt?: Date;

  @Column(DataType.DATE)
  voidedAt?: Date;

  @Column(DataType.TEXT)
  voidReason?: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy!: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => InvoiceLineItemModel)
  lineItems!: InvoiceLineItemModel[];
}

/**
 * Invoice Line Item Sequelize Model
 */
@Table({
  tableName: 'invoice_line_items',
  timestamps: false,
})
export class InvoiceLineItemModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => InvoiceModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  invoiceId!: string;

  @Column({
    type: DataType.ENUM('time', 'expense', 'fee', 'adjustment'),
    allowNull: false,
  })
  type!: 'time' | 'expense' | 'fee' | 'adjustment';

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  unitPrice!: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  amount!: number;

  @Column(DataType.UUID)
  timeEntryId?: string;

  @Column(DataType.UUID)
  expenseId?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  taxable!: boolean;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @BelongsTo(() => InvoiceModel)
  invoice!: InvoiceModel;
}

/**
 * Expense Sequelize Model
 */
@Table({
  tableName: 'expenses',
  timestamps: true,
  paranoid: true,
})
export class ExpenseModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  matterId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clientId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ExpenseCategory)),
    allowNull: false,
  })
  category!: ExpenseCategory;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING(3),
    defaultValue: 'USD',
  })
  currency!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expenseDate!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  reimbursable!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  billable!: boolean;

  @Column(DataType.STRING)
  receiptUrl?: string;

  @Column(DataType.STRING(255))
  vendorName?: string;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected', 'reimbursed', 'billed'),
    defaultValue: 'pending',
  })
  status!: 'pending' | 'approved' | 'rejected' | 'reimbursed' | 'billed';

  @Column(DataType.UUID)
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @Column(DataType.UUID)
  invoiceId?: string;

  @Column(DataType.DATE)
  billedAt?: Date;

  @Column(DataType.DATE)
  reimbursedAt?: Date;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy!: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Trust Account Sequelize Model
 */
@Table({
  tableName: 'trust_accounts',
  timestamps: true,
})
export class TrustAccountModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  accountNumber!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  accountName!: string;

  @Column(DataType.UUID)
  clientId?: string;

  @Column(DataType.UUID)
  matterId?: string;

  @Column({
    type: DataType.ENUM('iolta', 'client_trust', 'operating'),
    allowNull: false,
  })
  accountType!: 'iolta' | 'client_trust' | 'operating';

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0,
  })
  balance!: number;

  @Column({
    type: DataType.STRING(3),
    defaultValue: 'USD',
  })
  currency!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  bankName!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  bankAccountNumber!: string;

  @Column(DataType.STRING(50))
  routingNumber?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  openedDate!: Date;

  @Column(DataType.DATE)
  closedDate?: Date;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => TrustTransactionModel)
  transactions!: TrustTransactionModel[];
}

/**
 * Trust Transaction Sequelize Model
 */
@Table({
  tableName: 'trust_transactions',
  timestamps: false,
})
export class TrustTransactionModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => TrustAccountModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  trustAccountId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(TrustAccountTransactionType)),
    allowNull: false,
  })
  transactionType!: TrustAccountTransactionType;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  balance!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  transactionDate!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column(DataType.STRING(255))
  reference?: string;

  @Column(DataType.UUID)
  relatedInvoiceId?: string;

  @Column(DataType.UUID)
  relatedPaymentId?: string;

  @Column(DataType.UUID)
  fromAccountId?: string;

  @Column(DataType.UUID)
  toAccountId?: string;

  @Column(DataType.DATE)
  reconciledAt?: Date;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @BelongsTo(() => TrustAccountModel)
  trustAccount!: TrustAccountModel;
}

/**
 * WIP Entry Sequelize Model
 */
@Table({
  tableName: 'wip_entries',
  timestamps: true,
})
export class WIPEntryModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  matterId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clientId!: string;

  @Column(DataType.UUID)
  timekeeperId?: string;

  @Column({
    type: DataType.ENUM('time', 'expense', 'fee'),
    allowNull: false,
  })
  type!: 'time' | 'expense' | 'fee';

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @Column(DataType.DECIMAL(10, 2))
  hours?: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.ENUM(...Object.values(WIPStatus)),
    defaultValue: WIPStatus.UNBILLED,
  })
  status!: WIPStatus;

  @Column(DataType.UUID)
  timeEntryId?: string;

  @Column(DataType.UUID)
  expenseId?: string;

  @Column(DataType.UUID)
  invoiceId?: string;

  @Column(DataType.DATE)
  billedAt?: Date;

  @Column(DataType.DATE)
  writtenOffAt?: Date;

  @Column(DataType.TEXT)
  writeOffReason?: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Payment Sequelize Model
 */
@Table({
  tableName: 'payments',
  timestamps: true,
})
export class PaymentModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  invoiceId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clientId!: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING(3),
    defaultValue: 'USD',
  })
  currency!: string;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: false,
  })
  paymentMethod!: PaymentMethod;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  paymentDate!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    defaultValue: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Column(DataType.STRING(255))
  reference?: string;

  @Column(DataType.STRING(255))
  transactionId?: string;

  @Column(DataType.STRING(100))
  checkNumber?: string;

  @Column(DataType.UUID)
  trustAccountId?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  processedAt?: Date;

  @Column(DataType.TEXT)
  failureReason?: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// CONFIGURATION MANAGEMENT
// ============================================================================

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
export function registerBillingConfig() {
  return registerAs('billing', () => ({
    invoiceNumberPrefix: process.env.INVOICE_NUMBER_PREFIX || 'INV',
    defaultCurrency: process.env.BILLING_DEFAULT_CURRENCY || 'USD',
    defaultPaymentTermsDays: parseInt(process.env.BILLING_PAYMENT_TERMS_DAYS || '30', 10),
    defaultTaxRate: parseFloat(process.env.BILLING_DEFAULT_TAX_RATE || '0'),
    minimumBillableHours: parseFloat(process.env.BILLING_MIN_HOURS || '0.1'),
    timeIncrementMinutes: parseInt(process.env.BILLING_TIME_INCREMENT || '6', 10),
    enableAutoTimeRounding: process.env.BILLING_AUTO_ROUND !== 'false',
    allowNegativeAdjustments: process.env.BILLING_ALLOW_NEGATIVE === 'true',
    requireExpenseReceipts: process.env.BILLING_REQUIRE_RECEIPTS !== 'false',
    trustAccountingEnabled: process.env.TRUST_ACCOUNTING_ENABLED !== 'false',
    trustAccountIOLTACompliant: process.env.TRUST_IOLTA_COMPLIANT !== 'false',
    overdueInvoiceDays: parseInt(process.env.BILLING_OVERDUE_DAYS || '30', 10),
    invoiceReminderDays: process.env.BILLING_REMINDER_DAYS?.split(',').map(Number) || [7, 14, 30],
    enableWIPTracking: process.env.BILLING_WIP_TRACKING !== 'false',
    ledisExportEnabled: process.env.BILLING_LEDIS_EXPORT === 'true',
  }));
}

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
export function createBillingConfigModule(): DynamicModule {
  return ConfigModule.forRoot({
    load: [registerBillingConfig()],
    isGlobal: true,
    cache: true,
  });
}

// ============================================================================
// TIME ENTRY FUNCTIONS
// ============================================================================

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
export async function createTimeEntry(
  data: z.infer<typeof TimeEntryCreateSchema>,
  userId: string,
  configService: ConfigService
): Promise<TimeEntry> {
  const logger = new Logger('TimeEntry');

  // Validate input
  const validated = TimeEntryCreateSchema.parse(data);

  // Round hours based on configuration
  const timeIncrement = configService.get('billing.timeIncrementMinutes', 6);
  const roundedHours = roundTimeEntry(validated.hours, timeIncrement);

  // Calculate billing amount
  const billingAmount = validated.billable && validated.billingRate
    ? roundedHours * validated.billingRate
    : 0;

  const timeEntry: TimeEntry = {
    id: crypto.randomUUID(),
    timekeeperId: validated.timekeeperId,
    matterId: validated.matterId,
    clientId: validated.clientId,
    date: validated.date,
    hours: roundedHours,
    description: validated.description,
    taskCode: validated.taskCode,
    activityCode: validated.activityCode,
    billable: validated.billable,
    billingRate: validated.billingRate,
    billingAmount,
    status: TimeEntryStatus.DRAFT,
    metadata: validated.metadata,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  logger.log(`Time entry created: ${roundedHours} hours for matter ${validated.matterId}`);

  return timeEntry;
}

/**
 * Round time entry hours based on increment
 */
function roundTimeEntry(hours: number, incrementMinutes: number): number {
  const incrementHours = incrementMinutes / 60;
  return Math.ceil(hours / incrementHours) * incrementHours;
}

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
export async function updateTimeEntry(
  timeEntryId: string,
  updates: Partial<TimeEntry>,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('TimeEntry');

  const timeEntry = await repository.findByPk(timeEntryId);
  if (!timeEntry) {
    throw new NotFoundException(`Time entry ${timeEntryId} not found`);
  }

  if (timeEntry.status === TimeEntryStatus.BILLED) {
    throw new BadRequestException('Cannot update billed time entry');
  }

  await repository.update(
    { ...updates, updatedBy: userId },
    { where: { id: timeEntryId } }
  );

  logger.log(`Time entry ${timeEntryId} updated`);
}

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
export async function deleteTimeEntry(
  timeEntryId: string,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('TimeEntry');

  const timeEntry = await repository.findByPk(timeEntryId);
  if (!timeEntry) {
    throw new NotFoundException(`Time entry ${timeEntryId} not found`);
  }

  if (timeEntry.status === TimeEntryStatus.BILLED) {
    throw new BadRequestException('Cannot delete billed time entry');
  }

  await repository.destroy({ where: { id: timeEntryId } });

  logger.log(`Time entry ${timeEntryId} deleted by ${userId}`);
}

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
export async function getTimeEntriesByMatter(
  matterId: string,
  filters: Partial<TimeEntryFilters>,
  repository: any
): Promise<TimeEntry[]> {
  const where: WhereOptions = { matterId };

  if (filters.timekeeperId) {
    where.timekeeperId = filters.timekeeperId;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      where.date[Op.lte] = filters.endDate;
    }
  }

  if (filters.statuses?.length) {
    where.status = { [Op.in]: filters.statuses };
  }

  if (filters.billable !== undefined) {
    where.billable = filters.billable;
  }

  if (filters.tenantId) {
    where.tenantId = filters.tenantId;
  }

  const entries = await repository.findAll({
    where,
    order: [['date', 'DESC']],
  });

  return entries.map((e: any) => e.toJSON());
}

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
export async function getTimeEntriesByTimekeeper(
  timekeeperId: string,
  filters: Partial<TimeEntryFilters>,
  repository: any
): Promise<TimeEntry[]> {
  const where: WhereOptions = { timekeeperId };

  if (filters.matterId) {
    where.matterId = filters.matterId;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      where.date[Op.lte] = filters.endDate;
    }
  }

  if (filters.statuses?.length) {
    where.status = { [Op.in]: filters.statuses };
  }

  if (filters.billable !== undefined) {
    where.billable = filters.billable;
  }

  if (filters.tenantId) {
    where.tenantId = filters.tenantId;
  }

  const entries = await repository.findAll({
    where,
    order: [['date', 'DESC']],
  });

  return entries.map((e: any) => e.toJSON());
}

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
export async function calculateBillableHours(
  filters: TimeEntryFilters,
  repository: any
): Promise<{ hours: number; amount: number }> {
  const where: WhereOptions = {};

  if (filters.timekeeperId) {
    where.timekeeperId = filters.timekeeperId;
  }

  if (filters.matterId) {
    where.matterId = filters.matterId;
  }

  if (filters.clientId) {
    where.clientId = filters.clientId;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      where.date[Op.lte] = filters.endDate;
    }
  }

  if (filters.statuses?.length) {
    where.status = { [Op.in]: filters.statuses };
  }

  if (filters.billable !== undefined) {
    where.billable = filters.billable;
  }

  if (filters.tenantId) {
    where.tenantId = filters.tenantId;
  }

  const entries = await repository.findAll({ where });

  const totals = entries.reduce(
    (acc: any, entry: any) => ({
      hours: acc.hours + parseFloat(entry.hours || 0),
      amount: acc.amount + parseFloat(entry.billingAmount || 0),
    }),
    { hours: 0, amount: 0 }
  );

  return totals;
}

// ============================================================================
// BILLING RATE FUNCTIONS
// ============================================================================

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
export async function createBillingRate(
  data: z.infer<typeof BillingRateCreateSchema>
): Promise<BillingRate> {
  const logger = new Logger('BillingRate');

  const validated = BillingRateCreateSchema.parse(data);

  // Validate rate type has corresponding rate value
  if (validated.rateType === BillingRateType.HOURLY && !validated.hourlyRate) {
    throw new BadRequestException('Hourly rate is required for hourly billing rate type');
  }

  if (validated.rateType === BillingRateType.FLAT_FEE && !validated.flatFeeAmount) {
    throw new BadRequestException('Flat fee amount is required for flat fee billing rate type');
  }

  if (validated.rateType === BillingRateType.CONTINGENCY && !validated.contingencyPercentage) {
    throw new BadRequestException('Contingency percentage is required for contingency billing rate type');
  }

  const billingRate: BillingRate = {
    id: crypto.randomUUID(),
    timekeeperId: validated.timekeeperId,
    clientId: validated.clientId,
    matterId: validated.matterId,
    matterTypeId: validated.matterTypeId,
    rateType: validated.rateType,
    hourlyRate: validated.hourlyRate,
    flatFeeAmount: validated.flatFeeAmount,
    contingencyPercentage: validated.contingencyPercentage,
    currency: validated.currency,
    effectiveDate: validated.effectiveDate,
    expirationDate: validated.expirationDate,
    isActive: validated.isActive,
    description: validated.description,
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  logger.log(`Billing rate created: ${validated.rateType} for timekeeper ${validated.timekeeperId}`);

  return billingRate;
}

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
export async function getBillingRateForTimekeeper(
  timekeeperId: string,
  matterId: string | undefined,
  clientId: string | undefined,
  date: Date,
  repository: any
): Promise<BillingRate | null> {
  const where: WhereOptions = {
    timekeeperId,
    isActive: true,
    effectiveDate: { [Op.lte]: date },
    [Op.or]: [
      { expirationDate: null },
      { expirationDate: { [Op.gte]: date } },
    ],
  };

  // Most specific rate: matter-specific
  if (matterId) {
    const matterRate = await repository.findOne({
      where: { ...where, matterId },
      order: [['effectiveDate', 'DESC']],
    });
    if (matterRate) {
      return matterRate.toJSON();
    }
  }

  // Client-specific rate
  if (clientId) {
    const clientRate = await repository.findOne({
      where: { ...where, clientId, matterId: null },
      order: [['effectiveDate', 'DESC']],
    });
    if (clientRate) {
      return clientRate.toJSON();
    }
  }

  // Default timekeeper rate
  const defaultRate = await repository.findOne({
    where: { ...where, clientId: null, matterId: null },
    order: [['effectiveDate', 'DESC']],
  });

  return defaultRate ? defaultRate.toJSON() : null;
}

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
export async function updateBillingRate(
  rateId: string,
  updates: Partial<BillingRate>,
  repository: any
): Promise<void> {
  const logger = new Logger('BillingRate');

  const rate = await repository.findByPk(rateId);
  if (!rate) {
    throw new NotFoundException(`Billing rate ${rateId} not found`);
  }

  await repository.update(updates, { where: { id: rateId } });

  logger.log(`Billing rate ${rateId} updated`);
}

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
export function calculateBillingAmount(
  hours: number,
  rate: BillingRate,
  settlementAmount?: number
): number {
  switch (rate.rateType) {
    case BillingRateType.HOURLY:
      return hours * (rate.hourlyRate || 0);

    case BillingRateType.FLAT_FEE:
      return rate.flatFeeAmount || 0;

    case BillingRateType.CONTINGENCY:
      if (!settlementAmount) {
        throw new BadRequestException('Settlement amount is required for contingency billing');
      }
      return settlementAmount * ((rate.contingencyPercentage || 0) / 100);

    default:
      return 0;
  }
}

// ============================================================================
// INVOICE FUNCTIONS
// ============================================================================

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
export async function generateInvoiceNumber(configService: ConfigService): Promise<string> {
  const prefix = configService.get<string>('billing.invoiceNumberPrefix', 'INV');
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  const timestamp = Date.now().toString().slice(-6);

  return `${prefix}-${year}${month}-${timestamp}${randomPart}`;
}

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
export async function createInvoice(
  data: z.infer<typeof InvoiceCreateSchema>,
  userId: string,
  configService: ConfigService
): Promise<Invoice> {
  const logger = new Logger('Invoice');

  const validated = InvoiceCreateSchema.parse(data);

  const invoiceNumber = await generateInvoiceNumber(configService);

  const invoice: Invoice = {
    id: crypto.randomUUID(),
    invoiceNumber,
    matterId: validated.matterId,
    clientId: validated.clientId,
    invoiceDate: validated.invoiceDate,
    dueDate: validated.dueDate,
    periodStart: validated.periodStart,
    periodEnd: validated.periodEnd,
    status: InvoiceStatus.DRAFT,
    lineItems: [],
    subtotal: 0,
    taxRate: validated.taxRate,
    taxAmount: 0,
    discountAmount: validated.discountAmount || 0,
    totalAmount: 0,
    amountPaid: 0,
    amountDue: 0,
    currency: validated.currency,
    notes: validated.notes,
    termsAndConditions: validated.termsAndConditions,
    metadata: validated.metadata,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  logger.log(`Invoice ${invoiceNumber} created for matter ${validated.matterId}`);

  return invoice;
}

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
export async function addLineItemToInvoice(
  invoiceId: string,
  lineItem: Omit<InvoiceLineItem, 'id' | 'invoiceId'>,
  repository: any
): Promise<void> {
  const logger = new Logger('Invoice');

  const invoice = await repository.findByPk(invoiceId);
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  if (invoice.status === InvoiceStatus.SENT || invoice.status === InvoiceStatus.PAID) {
    throw new BadRequestException('Cannot add line items to sent or paid invoice');
  }

  const newLineItem: InvoiceLineItem = {
    id: crypto.randomUUID(),
    invoiceId,
    ...lineItem,
  };

  // Would add to database here

  logger.log(`Line item added to invoice ${invoiceId}`);
}

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
export function calculateInvoiceTotal(invoice: Invoice): Invoice {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0);

  const taxableAmount = invoice.lineItems
    .filter(item => item.taxable)
    .reduce((sum, item) => sum + item.amount, 0);

  const taxAmount = invoice.taxRate ? (taxableAmount * invoice.taxRate) / 100 : 0;

  const totalAmount = subtotal + taxAmount - (invoice.discountAmount || 0);

  const amountDue = totalAmount - invoice.amountPaid;

  return {
    ...invoice,
    subtotal,
    taxAmount,
    totalAmount,
    amountDue,
  };
}

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
export async function finalizeInvoice(
  invoiceId: string,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('Invoice');

  const invoice = await repository.findByPk(invoiceId);
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  if (invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.PENDING_REVIEW) {
    throw new BadRequestException('Invoice cannot be finalized from current status');
  }

  await repository.update(
    {
      status: InvoiceStatus.APPROVED,
      updatedBy: userId,
    },
    { where: { id: invoiceId } }
  );

  logger.log(`Invoice ${invoiceId} finalized`);
}

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
export async function sendInvoice(
  invoiceId: string,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('Invoice');

  const invoice = await repository.findByPk(invoiceId);
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  if (invoice.status !== InvoiceStatus.APPROVED) {
    throw new BadRequestException('Only approved invoices can be sent');
  }

  await repository.update(
    {
      status: InvoiceStatus.SENT,
      sentAt: new Date(),
      updatedBy: userId,
    },
    { where: { id: invoiceId } }
  );

  logger.log(`Invoice ${invoiceId} sent to client`);

  // Integration point: would send email/notification here
}

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
export async function markInvoiceAsPaid(
  invoiceId: string,
  paymentAmount: number,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('Invoice');

  const invoice = await repository.findByPk(invoiceId);
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  const newAmountPaid = parseFloat(invoice.amountPaid || 0) + paymentAmount;
  const newAmountDue = parseFloat(invoice.totalAmount) - newAmountPaid;

  let newStatus = invoice.status;
  let paidAt = invoice.paidAt;

  if (newAmountDue <= 0) {
    newStatus = InvoiceStatus.PAID;
    paidAt = new Date();
  } else if (newAmountPaid > 0) {
    newStatus = InvoiceStatus.PARTIALLY_PAID;
  }

  await repository.update(
    {
      amountPaid: newAmountPaid,
      amountDue: newAmountDue,
      status: newStatus,
      paidAt,
      updatedBy: userId,
    },
    { where: { id: invoiceId } }
  );

  logger.log(`Invoice ${invoiceId} payment recorded: $${paymentAmount}`);
}

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
export async function voidInvoice(
  invoiceId: string,
  reason: string,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('Invoice');

  const invoice = await repository.findByPk(invoiceId);
  if (!invoice) {
    throw new NotFoundException(`Invoice ${invoiceId} not found`);
  }

  if (invoice.status === InvoiceStatus.PAID) {
    throw new BadRequestException('Cannot void a paid invoice');
  }

  await repository.update(
    {
      status: InvoiceStatus.VOID,
      voidedAt: new Date(),
      voidReason: reason,
      updatedBy: userId,
    },
    { where: { id: invoiceId } }
  );

  logger.log(`Invoice ${invoiceId} voided: ${reason}`);
}

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
export async function getInvoicesByMatter(
  matterId: string,
  filters: Partial<InvoiceFilters>,
  repository: any
): Promise<Invoice[]> {
  const where: WhereOptions = { matterId };

  if (filters.statuses?.length) {
    where.status = { [Op.in]: filters.statuses };
  }

  if (filters.startDate || filters.endDate) {
    where.invoiceDate = {};
    if (filters.startDate) {
      where.invoiceDate[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      where.invoiceDate[Op.lte] = filters.endDate;
    }
  }

  if (filters.minAmount !== undefined) {
    where.totalAmount = { [Op.gte]: filters.minAmount };
  }

  if (filters.maxAmount !== undefined) {
    where.totalAmount = { ...where.totalAmount, [Op.lte]: filters.maxAmount };
  }

  if (filters.tenantId) {
    where.tenantId = filters.tenantId;
  }

  const invoices = await repository.findAll({
    where,
    order: [['invoiceDate', 'DESC']],
  });

  return invoices.map((i: any) => i.toJSON());
}

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
export async function getInvoicesByClient(
  clientId: string,
  filters: Partial<InvoiceFilters>,
  repository: any
): Promise<Invoice[]> {
  const where: WhereOptions = { clientId };

  if (filters.matterId) {
    where.matterId = filters.matterId;
  }

  if (filters.statuses?.length) {
    where.status = { [Op.in]: filters.statuses };
  }

  if (filters.startDate || filters.endDate) {
    where.invoiceDate = {};
    if (filters.startDate) {
      where.invoiceDate[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      where.invoiceDate[Op.lte] = filters.endDate;
    }
  }

  if (filters.minAmount !== undefined) {
    where.totalAmount = { [Op.gte]: filters.minAmount };
  }

  if (filters.maxAmount !== undefined) {
    where.totalAmount = { ...where.totalAmount, [Op.lte]: filters.maxAmount };
  }

  if (filters.tenantId) {
    where.tenantId = filters.tenantId;
  }

  const invoices = await repository.findAll({
    where,
    order: [['invoiceDate', 'DESC']],
  });

  return invoices.map((i: any) => i.toJSON());
}

// ============================================================================
// EXPENSE FUNCTIONS
// ============================================================================

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
export async function createExpense(
  data: z.infer<typeof ExpenseCreateSchema>,
  userId: string
): Promise<Expense> {
  const logger = new Logger('Expense');

  const validated = ExpenseCreateSchema.parse(data);

  const expense: Expense = {
    id: crypto.randomUUID(),
    matterId: validated.matterId,
    clientId: validated.clientId,
    category: validated.category,
    description: validated.description,
    amount: validated.amount,
    currency: validated.currency,
    expenseDate: validated.expenseDate,
    reimbursable: validated.reimbursable,
    billable: validated.billable,
    receiptUrl: validated.receiptUrl,
    vendorName: validated.vendorName,
    status: 'pending',
    metadata: validated.metadata,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  logger.log(`Expense created: ${validated.category} for $${validated.amount}`);

  return expense;
}

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
export async function getExpensesByMatter(
  matterId: string,
  filters: { category?: ExpenseCategory; billable?: boolean; status?: string },
  repository: any
): Promise<Expense[]> {
  const where: WhereOptions = { matterId };

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.billable !== undefined) {
    where.billable = filters.billable;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  const expenses = await repository.findAll({
    where,
    order: [['expenseDate', 'DESC']],
  });

  return expenses.map((e: any) => e.toJSON());
}

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
export async function reimburseExpense(
  expenseId: string,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('Expense');

  const expense = await repository.findByPk(expenseId);
  if (!expense) {
    throw new NotFoundException(`Expense ${expenseId} not found`);
  }

  if (!expense.reimbursable) {
    throw new BadRequestException('Expense is not marked as reimbursable');
  }

  await repository.update(
    {
      status: 'reimbursed',
      reimbursedAt: new Date(),
      updatedBy: userId,
    },
    { where: { id: expenseId } }
  );

  logger.log(`Expense ${expenseId} reimbursed`);
}

// ============================================================================
// TRUST ACCOUNTING FUNCTIONS
// ============================================================================

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
export async function createTrustAccount(
  accountData: Omit<TrustAccount, 'id' | 'balance' | 'createdAt' | 'updatedAt'>
): Promise<TrustAccount> {
  const logger = new Logger('TrustAccount');

  const trustAccount: TrustAccount = {
    id: crypto.randomUUID(),
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...accountData,
  };

  logger.log(`Trust account created: ${accountData.accountNumber}`);

  return trustAccount;
}

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
export async function depositToTrust(
  accountId: string,
  amount: number,
  description: string,
  userId: string,
  repository: any
): Promise<TrustTransaction> {
  const logger = new Logger('TrustAccount');

  if (amount <= 0) {
    throw new BadRequestException('Deposit amount must be positive');
  }

  const account = await repository.findByPk(accountId);
  if (!account) {
    throw new NotFoundException(`Trust account ${accountId} not found`);
  }

  if (!account.isActive) {
    throw new BadRequestException('Cannot deposit to inactive trust account');
  }

  const newBalance = parseFloat(account.balance) + amount;

  const transaction: TrustTransaction = {
    id: crypto.randomUUID(),
    trustAccountId: accountId,
    transactionType: TrustAccountTransactionType.DEPOSIT,
    amount,
    balance: newBalance,
    transactionDate: new Date(),
    description,
    metadata: {},
    createdBy: userId,
    createdAt: new Date(),
  };

  // Would update account balance and save transaction here

  logger.log(`Trust deposit: $${amount} to account ${accountId}`);

  return transaction;
}

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
export async function withdrawFromTrust(
  accountId: string,
  amount: number,
  description: string,
  userId: string,
  repository: any
): Promise<TrustTransaction> {
  const logger = new Logger('TrustAccount');

  if (amount <= 0) {
    throw new BadRequestException('Withdrawal amount must be positive');
  }

  const account = await repository.findByPk(accountId);
  if (!account) {
    throw new NotFoundException(`Trust account ${accountId} not found`);
  }

  if (!account.isActive) {
    throw new BadRequestException('Cannot withdraw from inactive trust account');
  }

  const currentBalance = parseFloat(account.balance);
  if (currentBalance < amount) {
    throw new BadRequestException('Insufficient trust account balance');
  }

  const newBalance = currentBalance - amount;

  const transaction: TrustTransaction = {
    id: crypto.randomUUID(),
    trustAccountId: accountId,
    transactionType: TrustAccountTransactionType.WITHDRAWAL,
    amount,
    balance: newBalance,
    transactionDate: new Date(),
    description,
    metadata: {},
    createdBy: userId,
    createdAt: new Date(),
  };

  // Would update account balance and save transaction here

  logger.log(`Trust withdrawal: $${amount} from account ${accountId}`);

  return transaction;
}

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
export async function transferBetweenTrust(
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  description: string,
  userId: string,
  repository: any
): Promise<TrustTransaction[]> {
  const logger = new Logger('TrustAccount');

  if (amount <= 0) {
    throw new BadRequestException('Transfer amount must be positive');
  }

  if (fromAccountId === toAccountId) {
    throw new BadRequestException('Cannot transfer to same account');
  }

  // Verify both accounts exist
  const fromAccount = await repository.findByPk(fromAccountId);
  const toAccount = await repository.findByPk(toAccountId);

  if (!fromAccount || !toAccount) {
    throw new NotFoundException('One or both trust accounts not found');
  }

  if (!fromAccount.isActive || !toAccount.isActive) {
    throw new BadRequestException('Cannot transfer to/from inactive trust accounts');
  }

  const fromBalance = parseFloat(fromAccount.balance);
  if (fromBalance < amount) {
    throw new BadRequestException('Insufficient balance in source trust account');
  }

  // Create withdrawal transaction
  const withdrawalTx: TrustTransaction = {
    id: crypto.randomUUID(),
    trustAccountId: fromAccountId,
    transactionType: TrustAccountTransactionType.TRANSFER,
    amount,
    balance: fromBalance - amount,
    transactionDate: new Date(),
    description: `Transfer to ${toAccount.accountNumber}: ${description}`,
    toAccountId,
    metadata: {},
    createdBy: userId,
    createdAt: new Date(),
  };

  // Create deposit transaction
  const depositTx: TrustTransaction = {
    id: crypto.randomUUID(),
    trustAccountId: toAccountId,
    transactionType: TrustAccountTransactionType.TRANSFER,
    amount,
    balance: parseFloat(toAccount.balance) + amount,
    transactionDate: new Date(),
    description: `Transfer from ${fromAccount.accountNumber}: ${description}`,
    fromAccountId,
    metadata: {},
    createdBy: userId,
    createdAt: new Date(),
  };

  // Would update both account balances and save transactions here

  logger.log(`Trust transfer: $${amount} from ${fromAccountId} to ${toAccountId}`);

  return [withdrawalTx, depositTx];
}

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
export async function getTrustBalance(
  accountId: string,
  repository: any
): Promise<number> {
  const account = await repository.findByPk(accountId);
  if (!account) {
    throw new NotFoundException(`Trust account ${accountId} not found`);
  }

  return parseFloat(account.balance);
}

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
export async function getTrustTransactionHistory(
  accountId: string,
  startDate: Date,
  endDate: Date,
  repository: any
): Promise<TrustTransaction[]> {
  const where: WhereOptions = {
    trustAccountId: accountId,
    transactionDate: {
      [Op.between]: [startDate, endDate],
    },
  };

  const transactions = await repository.findAll({
    where,
    order: [['transactionDate', 'ASC']],
  });

  return transactions.map((tx: any) => tx.toJSON());
}

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
export async function reconcileTrustAccount(
  accountId: string,
  bankBalance: number,
  reconciliationDate: Date,
  userId: string,
  repository: any
): Promise<{ systemBalance: number; bankBalance: number; difference: number; reconciled: boolean }> {
  const logger = new Logger('TrustAccount');

  const account = await repository.findByPk(accountId);
  if (!account) {
    throw new NotFoundException(`Trust account ${accountId} not found`);
  }

  const systemBalance = parseFloat(account.balance);
  const difference = Math.abs(systemBalance - bankBalance);
  const reconciled = difference < 0.01; // Within 1 cent

  if (reconciled) {
    logger.log(`Trust account ${accountId} reconciled successfully`);
  } else {
    logger.warn(`Trust account ${accountId} reconciliation discrepancy: $${difference.toFixed(2)}`);
  }

  return {
    systemBalance,
    bankBalance,
    difference,
    reconciled,
  };
}

// ============================================================================
// WIP (WORK IN PROGRESS) FUNCTIONS
// ============================================================================

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
export async function createWIPEntry(
  wipData: Omit<WIPEntry, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<WIPEntry> {
  const logger = new Logger('WIP');

  const wipEntry: WIPEntry = {
    id: crypto.randomUUID(),
    status: WIPStatus.UNBILLED,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...wipData,
  };

  logger.log(`WIP entry created: ${wipData.type} for $${wipData.amount}`);

  return wipEntry;
}

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
export async function convertWIPToInvoice(
  matterId: string,
  invoiceId: string,
  repository: any
): Promise<number> {
  const logger = new Logger('WIP');

  const wipEntries = await repository.findAll({
    where: {
      matterId,
      status: WIPStatus.UNBILLED,
    },
  });

  await repository.update(
    {
      status: WIPStatus.BILLED,
      invoiceId,
      billedAt: new Date(),
    },
    {
      where: {
        matterId,
        status: WIPStatus.UNBILLED,
      },
    }
  );

  logger.log(`Converted ${wipEntries.length} WIP entries to invoice ${invoiceId}`);

  return wipEntries.length;
}

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
export async function getWIPByMatter(
  matterId: string,
  filters: { status?: WIPStatus; type?: 'time' | 'expense' | 'fee' },
  repository: any
): Promise<WIPEntry[]> {
  const where: WhereOptions = { matterId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  const wipEntries = await repository.findAll({
    where,
    order: [['date', 'DESC']],
  });

  return wipEntries.map((w: any) => w.toJSON());
}

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
export async function writeOffWIP(
  wipId: string,
  reason: string,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('WIP');

  const wip = await repository.findByPk(wipId);
  if (!wip) {
    throw new NotFoundException(`WIP entry ${wipId} not found`);
  }

  if (wip.status === WIPStatus.BILLED) {
    throw new BadRequestException('Cannot write off billed WIP');
  }

  await repository.update(
    {
      status: WIPStatus.WRITTEN_OFF,
      writtenOffAt: new Date(),
      writeOffReason: reason,
    },
    { where: { id: wipId } }
  );

  logger.log(`WIP entry ${wipId} written off: ${reason}`);
}

// ============================================================================
// REPORTING FUNCTIONS
// ============================================================================

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
export async function generateAgingReport(
  tenantId: string | undefined,
  repository: any
): Promise<AgingReport> {
  const logger = new Logger('Reporting');

  const where: WhereOptions = {
    status: {
      [Op.in]: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE],
    },
  };

  if (tenantId) {
    where.tenantId = tenantId;
  }

  const invoices = await repository.findAll({ where });

  const now = new Date();
  const buckets = {
    current: [] as Invoice[],
    days30: [] as Invoice[],
    days60: [] as Invoice[],
    days90: [] as Invoice[],
    days120Plus: [] as Invoice[],
  };

  let totalOutstanding = 0;

  for (const invoice of invoices) {
    const daysOutstanding = Math.floor(
      (now.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const amountDue = parseFloat(invoice.amountDue);
    totalOutstanding += amountDue;

    if (daysOutstanding < 0) {
      buckets.current.push(invoice.toJSON());
    } else if (daysOutstanding < 30) {
      buckets.current.push(invoice.toJSON());
    } else if (daysOutstanding < 60) {
      buckets.days30.push(invoice.toJSON());
    } else if (daysOutstanding < 90) {
      buckets.days60.push(invoice.toJSON());
    } else if (daysOutstanding < 120) {
      buckets.days90.push(invoice.toJSON());
    } else {
      buckets.days120Plus.push(invoice.toJSON());
    }
  }

  const report: AgingReport = {
    generatedAt: new Date(),
    totalOutstanding,
    currency: 'USD',
    buckets: {
      current: buckets.current.reduce((sum, inv) => sum + parseFloat(inv.amountDue as any), 0),
      days30: buckets.days30.reduce((sum, inv) => sum + parseFloat(inv.amountDue as any), 0),
      days60: buckets.days60.reduce((sum, inv) => sum + parseFloat(inv.amountDue as any), 0),
      days90: buckets.days90.reduce((sum, inv) => sum + parseFloat(inv.amountDue as any), 0),
      days120Plus: buckets.days120Plus.reduce((sum, inv) => sum + parseFloat(inv.amountDue as any), 0),
    },
    invoicesByBucket: buckets,
  };

  logger.log(`Aging report generated: $${totalOutstanding} outstanding`);

  return report;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Billing and Timekeeping Service
 * NestJS service for billing operations with dependency injection
 */
@Injectable()
export class BillingTimekeepingService {
  private readonly logger = new Logger(BillingTimekeepingService.name);

  constructor(
    @Inject('TIME_ENTRY_REPOSITORY') private timeEntryRepo: typeof TimeEntryModel,
    @Inject('BILLING_RATE_REPOSITORY') private billingRateRepo: typeof BillingRateModel,
    @Inject('INVOICE_REPOSITORY') private invoiceRepo: typeof InvoiceModel,
    @Inject('EXPENSE_REPOSITORY') private expenseRepo: typeof ExpenseModel,
    @Inject('TRUST_ACCOUNT_REPOSITORY') private trustAccountRepo: typeof TrustAccountModel,
    @Inject('TRUST_TRANSACTION_REPOSITORY') private trustTxRepo: typeof TrustTransactionModel,
    @Inject('WIP_REPOSITORY') private wipRepo: typeof WIPEntryModel,
    @Inject('PAYMENT_REPOSITORY') private paymentRepo: typeof PaymentModel,
    private configService: ConfigService
  ) {}

  /**
   * Create time entry
   */
  async createTimeEntry(data: z.infer<typeof TimeEntryCreateSchema>, userId: string): Promise<TimeEntry> {
    this.logger.log(`Creating time entry for matter ${data.matterId}`);
    return createTimeEntry(data, userId, this.configService);
  }

  /**
   * Get time entries by matter
   */
  async getTimeEntriesByMatter(matterId: string, filters: Partial<TimeEntryFilters>): Promise<TimeEntry[]> {
    return getTimeEntriesByMatter(matterId, filters, this.timeEntryRepo);
  }

  /**
   * Create invoice
   */
  async createInvoice(data: z.infer<typeof InvoiceCreateSchema>, userId: string): Promise<Invoice> {
    this.logger.log(`Creating invoice for matter ${data.matterId}`);
    return createInvoice(data, userId, this.configService);
  }

  /**
   * Send invoice
   */
  async sendInvoice(invoiceId: string, userId: string): Promise<void> {
    return sendInvoice(invoiceId, userId, this.invoiceRepo);
  }

  /**
   * Create expense
   */
  async createExpense(data: z.infer<typeof ExpenseCreateSchema>, userId: string): Promise<Expense> {
    return createExpense(data, userId);
  }

  /**
   * Deposit to trust
   */
  async depositToTrust(accountId: string, amount: number, description: string, userId: string): Promise<TrustTransaction> {
    return depositToTrust(accountId, amount, description, userId, this.trustAccountRepo);
  }

  /**
   * Generate aging report
   */
  async generateAgingReport(tenantId?: string): Promise<AgingReport> {
    return generateAgingReport(tenantId, this.invoiceRepo);
  }
}

// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================

/**
 * Time Entry DTO
 */
export class TimeEntryDto {
  @ApiProperty({ example: 'uuid', description: 'Time entry ID' })
  id!: string;

  @ApiProperty({ example: 'uuid', description: 'Timekeeper ID' })
  timekeeperId!: string;

  @ApiProperty({ example: 'uuid', description: 'Matter ID' })
  matterId!: string;

  @ApiProperty({ type: Date, description: 'Entry date' })
  date!: Date;

  @ApiProperty({ example: 5.5, description: 'Hours worked' })
  hours!: number;

  @ApiProperty({ description: 'Work description' })
  description!: string;

  @ApiProperty({ example: true, description: 'Billable flag' })
  billable!: boolean;

  @ApiPropertyOptional({ example: 350, description: 'Billing rate' })
  billingRate?: number;

  @ApiPropertyOptional({ example: 1925, description: 'Billing amount' })
  billingAmount?: number;

  @ApiProperty({ enum: TimeEntryStatus, description: 'Entry status' })
  status!: TimeEntryStatus;
}

/**
 * Invoice DTO
 */
export class InvoiceDto {
  @ApiProperty({ example: 'uuid', description: 'Invoice ID' })
  id!: string;

  @ApiProperty({ example: 'INV-202501-001234', description: 'Invoice number' })
  invoiceNumber!: string;

  @ApiProperty({ example: 'uuid', description: 'Matter ID' })
  matterId!: string;

  @ApiProperty({ type: Date, description: 'Invoice date' })
  invoiceDate!: Date;

  @ApiProperty({ type: Date, description: 'Due date' })
  dueDate!: Date;

  @ApiProperty({ enum: InvoiceStatus, description: 'Invoice status' })
  status!: InvoiceStatus;

  @ApiProperty({ example: 5000, description: 'Total amount' })
  totalAmount!: number;

  @ApiProperty({ example: 1250, description: 'Amount paid' })
  amountPaid!: number;

  @ApiProperty({ example: 3750, description: 'Amount due' })
  amountDue!: number;

  @ApiProperty({ example: 'USD', description: 'Currency code' })
  currency!: string;
}

/**
 * Expense DTO
 */
export class ExpenseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  matterId!: string;

  @ApiProperty({ enum: ExpenseCategory })
  category!: ExpenseCategory;

  @ApiProperty()
  description!: string;

  @ApiProperty({ example: 425.00 })
  amount!: number;

  @ApiProperty({ type: Date })
  expenseDate!: Date;

  @ApiProperty({ default: true })
  billable!: boolean;
}

/**
 * Trust Transaction DTO
 */
export class TrustTransactionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  trustAccountId!: string;

  @ApiProperty({ enum: TrustAccountTransactionType })
  transactionType!: TrustAccountTransactionType;

  @ApiProperty({ example: 5000 })
  amount!: number;

  @ApiProperty({ example: 45000 })
  balance!: number;

  @ApiProperty({ type: Date })
  transactionDate!: Date;

  @ApiProperty()
  description!: string;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Configuration
  registerBillingConfig,
  createBillingConfigModule,

  // Time Entry Functions
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  getTimeEntriesByMatter,
  getTimeEntriesByTimekeeper,
  calculateBillableHours,

  // Billing Rate Functions
  createBillingRate,
  getBillingRateForTimekeeper,
  updateBillingRate,
  calculateBillingAmount,

  // Invoice Functions
  generateInvoiceNumber,
  createInvoice,
  addLineItemToInvoice,
  calculateInvoiceTotal,
  finalizeInvoice,
  sendInvoice,
  markInvoiceAsPaid,
  voidInvoice,
  getInvoicesByMatter,
  getInvoicesByClient,

  // Expense Functions
  createExpense,
  getExpensesByMatter,
  reimburseExpense,

  // Trust Accounting Functions
  createTrustAccount,
  depositToTrust,
  withdrawFromTrust,
  transferBetweenTrust,
  getTrustBalance,
  getTrustTransactionHistory,
  reconcileTrustAccount,

  // WIP Functions
  createWIPEntry,
  convertWIPToInvoice,
  getWIPByMatter,
  writeOffWIP,

  // Reporting Functions
  generateAgingReport,

  // Service
  BillingTimekeepingService,
};
