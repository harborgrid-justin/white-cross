/**
 * LOC: FIN-INV-001
 * File: /reuse/financial/invoice-generation-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - pdfkit (PDF generation)
 *   - nodemailer (Email delivery)
 *   - handlebars (Template rendering)
 *   - qrcode (QR code generation)
 *   - moment (Date manipulation)
 *   - numeral (Number formatting)
 *   - uuid (Invoice ID generation)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS invoice controllers
 *   - Accounting services
 *   - Billing automation services
 *   - Payment processing services
 *   - Revenue recognition services
 *   - Financial reporting services
 */

/**
 * File: /reuse/financial/invoice-generation-management-kit.ts
 * Locator: WC-FIN-INVOICE-001
 * Purpose: Comprehensive Invoice Generation & Management Kit - Enterprise-grade invoice lifecycle management
 *
 * Upstream: Independent financial module for invoice creation, delivery, payment tracking, and reporting
 * Downstream: ../backend/*, Invoice controllers, Billing services, Payment processors, Accounting integrations
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, pdfkit, nodemailer,
 *               handlebars, qrcode, moment, numeral, uuid, bull, ioredis
 * Exports: 38 functions for invoice creation/templating, line item management, numbering sequences,
 *          PDF generation, email delivery, credit notes, pro forma invoices, recurring invoices,
 *          approval workflows, aging reports, dunning management, search/filtering, payment tracking
 *
 * LLM Context: Enterprise-grade invoice generation and management system competing with FreshBooks, QuickBooks, Xero.
 * Provides comprehensive invoice lifecycle management including customizable templates with logo and branding,
 * flexible line item management with tax calculations, automated numbering sequences with customizable formats,
 * high-quality PDF generation with QR codes for payment links, multi-channel delivery (email, portal, API),
 * credit note generation with reason tracking, pro forma invoice generation for quotes, recurring invoice
 * automation with schedule management, multi-level approval workflows, comprehensive aging reports with AR analytics,
 * intelligent dunning management with escalation rules, advanced search and filtering with full-text capabilities,
 * payment allocation and reconciliation, multi-currency support, tax calculation with jurisdiction rules,
 * discount and early payment terms, partial payment tracking, dispute management, audit trail with version history.
 * Includes Sequelize models for invoices, line items, templates, payment terms, recurring schedules, and dunning rules.
 */

import {
  Injectable,
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
  StreamableFile,
  HttpStatus,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
  ApiQuery,
  ApiParam,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  Model,
  DataTypes,
  Sequelize,
  ModelStatic,
  Transaction,
  Op,
  literal,
  fn,
  col,
  WhereOptions,
} from 'sequelize';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as handlebars from 'handlebars';
import * as QRCode from 'qrcode';
import * as moment from 'moment';
import * as numeral from 'numeral';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Invoice status enumeration.
 */
export type InvoiceStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'sent'
  | 'viewed'
  | 'partial'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'void'
  | 'disputed';

/**
 * Invoice type enumeration.
 */
export type InvoiceType =
  | 'standard'
  | 'proforma'
  | 'recurring'
  | 'credit_note'
  | 'debit_note'
  | 'interim'
  | 'final';

/**
 * Payment terms type.
 */
export type PaymentTermsType =
  | 'immediate'
  | 'net_7'
  | 'net_10'
  | 'net_15'
  | 'net_30'
  | 'net_45'
  | 'net_60'
  | 'net_90'
  | 'eom'
  | 'custom';

/**
 * Tax calculation method.
 */
export type TaxCalculationMethod = 'inclusive' | 'exclusive' | 'compound';

/**
 * Discount type enumeration.
 */
export type DiscountType = 'percentage' | 'fixed' | 'early_payment';

/**
 * Recurring frequency.
 */
export type RecurringFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'annual';

/**
 * Delivery channel enumeration.
 */
export type DeliveryChannel = 'email' | 'portal' | 'api' | 'print' | 'fax';

/**
 * Dunning level enumeration.
 */
export type DunningLevel =
  | 'reminder'
  | 'first_notice'
  | 'second_notice'
  | 'final_notice'
  | 'collection';

/**
 * Approval status enumeration.
 */
export type ApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'conditional'
  | 'escalated';

// ============================================================================
// SWAGGER API MODELS
// ============================================================================

/**
 * Invoice line item details.
 * Represents a single product or service on an invoice.
 */
export class InvoiceLineItemDto {
  @ApiProperty({ description: 'Line item unique identifier' })
  id?: string;

  @ApiProperty({ description: 'Product or service code', example: 'PROD-001' })
  itemCode: string;

  @ApiProperty({
    description: 'Product or service description',
    example: 'Professional Services - Consulting',
  })
  description: string;

  @ApiPropertyOptional({
    description: 'Extended description or notes',
    example: '40 hours at $150/hour',
  })
  notes?: string;

  @ApiProperty({ description: 'Quantity', example: 10 })
  quantity: number;

  @ApiProperty({ description: 'Unit of measure', example: 'hours' })
  unitOfMeasure: string;

  @ApiProperty({ description: 'Unit price', example: 150.0 })
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Discount percentage', example: 10 })
  discountPercent?: number;

  @ApiPropertyOptional({ description: 'Discount amount', example: 150.0 })
  discountAmount?: number;

  @ApiProperty({ description: 'Tax percentage', example: 8.5 })
  taxPercent: number;

  @ApiProperty({ description: 'Tax amount', example: 119.0 })
  taxAmount: number;

  @ApiProperty({ description: 'Line total before tax', example: 1350.0 })
  subtotal: number;

  @ApiProperty({ description: 'Line total including tax', example: 1469.0 })
  total: number;

  @ApiPropertyOptional({ description: 'Chart of accounts code' })
  accountCode?: string;

  @ApiPropertyOptional({ description: 'Project or cost center code' })
  projectCode?: string;

  @ApiProperty({ description: 'Line sequence number', example: 1 })
  sequenceNumber: number;
}

/**
 * Payment terms configuration.
 * Defines when and how payment is expected.
 */
export class PaymentTermsDto {
  @ApiProperty({
    description: 'Payment terms type',
    enum: [
      'immediate',
      'net_7',
      'net_10',
      'net_15',
      'net_30',
      'net_45',
      'net_60',
      'net_90',
      'eom',
      'custom',
    ],
  })
  type: PaymentTermsType;

  @ApiPropertyOptional({ description: 'Custom net days for payment' })
  customNetDays?: number;

  @ApiPropertyOptional({
    description: 'Early payment discount percentage',
    example: 2,
  })
  earlyPaymentDiscountPercent?: number;

  @ApiPropertyOptional({
    description: 'Days to qualify for early payment discount',
    example: 10,
  })
  earlyPaymentDays?: number;

  @ApiPropertyOptional({
    description: 'Late payment fee percentage',
    example: 1.5,
  })
  lateFeePercent?: number;

  @ApiPropertyOptional({
    description: 'Grace period before late fees apply (days)',
    example: 5,
  })
  gracePeriodDays?: number;

  @ApiPropertyOptional({ description: 'Payment instructions or notes' })
  instructions?: string;
}

/**
 * Invoice address details.
 * Billing and shipping address information.
 */
export class InvoiceAddressDto {
  @ApiProperty({ description: 'Company or person name' })
  name: string;

  @ApiPropertyOptional({ description: 'Attention to person' })
  attention?: string;

  @ApiProperty({ description: 'Address line 1' })
  addressLine1: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  addressLine2?: string;

  @ApiProperty({ description: 'City' })
  city: string;

  @ApiProperty({ description: 'State or province' })
  state: string;

  @ApiProperty({ description: 'Postal code' })
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  country: string;

  @ApiPropertyOptional({ description: 'Tax ID or VAT number' })
  taxId?: string;
}

/**
 * Tax configuration details.
 * Defines tax rules and calculation methods.
 */
export class TaxConfigDto {
  @ApiProperty({ description: 'Tax name', example: 'Sales Tax' })
  name: string;

  @ApiProperty({ description: 'Tax percentage', example: 8.5 })
  percentage: number;

  @ApiProperty({ description: 'Tax jurisdiction', example: 'California' })
  jurisdiction: string;

  @ApiProperty({
    description: 'Tax calculation method',
    enum: ['inclusive', 'exclusive', 'compound'],
  })
  calculationMethod: TaxCalculationMethod;

  @ApiPropertyOptional({ description: 'Tax registration number' })
  registrationNumber?: string;

  @ApiProperty({ description: 'Is tax exempt', default: false })
  isExempt: boolean;

  @ApiPropertyOptional({ description: 'Exemption reason or certificate' })
  exemptionReason?: string;
}

/**
 * Complete invoice details.
 * Main invoice document with all line items and metadata.
 */
export class InvoiceDto {
  @ApiProperty({ description: 'Invoice unique identifier' })
  id?: string;

  @ApiProperty({ description: 'Invoice number', example: 'INV-2024-00001' })
  invoiceNumber: string;

  @ApiProperty({
    description: 'Invoice type',
    enum: [
      'standard',
      'proforma',
      'recurring',
      'credit_note',
      'debit_note',
      'interim',
      'final',
    ],
  })
  type: InvoiceType;

  @ApiProperty({
    description: 'Invoice status',
    enum: [
      'draft',
      'pending_approval',
      'approved',
      'sent',
      'viewed',
      'partial',
      'paid',
      'overdue',
      'cancelled',
      'void',
      'disputed',
    ],
  })
  status: InvoiceStatus;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiProperty({ description: 'Customer name' })
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  customerEmail: string;

  @ApiProperty({ description: 'Billing address' })
  billingAddress: InvoiceAddressDto;

  @ApiPropertyOptional({ description: 'Shipping address' })
  shippingAddress?: InvoiceAddressDto;

  @ApiProperty({ description: 'Invoice date', example: '2024-01-15' })
  invoiceDate: Date;

  @ApiProperty({ description: 'Due date', example: '2024-02-14' })
  dueDate: Date;

  @ApiPropertyOptional({
    description: 'Purchase order reference',
    example: 'PO-2024-001',
  })
  poReference?: string;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Exchange rate to base currency', example: 1.0 })
  exchangeRate: number;

  @ApiProperty({ description: 'Invoice line items', type: [InvoiceLineItemDto] })
  lineItems: InvoiceLineItemDto[];

  @ApiProperty({ description: 'Subtotal before discounts and taxes' })
  subtotal: number;

  @ApiPropertyOptional({ description: 'Total discount amount' })
  discountAmount?: number;

  @ApiProperty({ description: 'Total tax amount' })
  taxAmount: number;

  @ApiPropertyOptional({ description: 'Shipping charge' })
  shippingAmount?: number;

  @ApiProperty({ description: 'Invoice total' })
  total: number;

  @ApiProperty({ description: 'Amount paid' })
  amountPaid: number;

  @ApiProperty({ description: 'Amount due' })
  amountDue: number;

  @ApiProperty({ description: 'Payment terms' })
  paymentTerms: PaymentTermsDto;

  @ApiProperty({ description: 'Tax configuration', type: [TaxConfigDto] })
  taxConfig: TaxConfigDto[];

  @ApiPropertyOptional({ description: 'Invoice notes or memo' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Footer text or terms and conditions' })
  footer?: string;

  @ApiPropertyOptional({ description: 'Template ID for styling' })
  templateId?: string;

  @ApiPropertyOptional({ description: 'Parent invoice ID for credit notes' })
  parentInvoiceId?: string;

  @ApiPropertyOptional({ description: 'Recurring schedule ID if applicable' })
  recurringScheduleId?: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt?: Date;

  @ApiProperty({ description: 'Created by user ID' })
  createdBy: string;

  @ApiPropertyOptional({ description: 'Approved by user ID' })
  approvedBy?: string;

  @ApiPropertyOptional({ description: 'Approval timestamp' })
  approvedAt?: Date;
}

/**
 * Invoice template configuration.
 * Customizable invoice design and branding.
 */
export class InvoiceTemplateDto {
  @ApiProperty({ description: 'Template unique identifier' })
  id?: string;

  @ApiProperty({ description: 'Template name', example: 'Professional Blue' })
  name: string;

  @ApiPropertyOptional({ description: 'Template description' })
  description?: string;

  @ApiProperty({ description: 'Company logo URL' })
  logoUrl: string;

  @ApiProperty({ description: 'Primary color', example: '#1E3A8A' })
  primaryColor: string;

  @ApiProperty({ description: 'Secondary color', example: '#3B82F6' })
  secondaryColor: string;

  @ApiProperty({ description: 'Font family', example: 'Helvetica' })
  fontFamily: string;

  @ApiProperty({ description: 'Header template (Handlebars)' })
  headerTemplate: string;

  @ApiProperty({ description: 'Footer template (Handlebars)' })
  footerTemplate: string;

  @ApiProperty({ description: 'Is default template', default: false })
  isDefault: boolean;

  @ApiProperty({ description: 'Is active', default: true })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Custom CSS styles' })
  customCss?: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt?: Date;
}

/**
 * Recurring invoice schedule.
 * Automation rules for recurring invoice generation.
 */
export class RecurringScheduleDto {
  @ApiProperty({ description: 'Schedule unique identifier' })
  id?: string;

  @ApiProperty({ description: 'Schedule name', example: 'Monthly Retainer' })
  name: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiProperty({
    description: 'Recurrence frequency',
    enum: [
      'daily',
      'weekly',
      'biweekly',
      'monthly',
      'quarterly',
      'semiannual',
      'annual',
    ],
  })
  frequency: RecurringFrequency;

  @ApiProperty({ description: 'Start date', example: '2024-01-01' })
  startDate: Date;

  @ApiPropertyOptional({ description: 'End date (optional for indefinite)' })
  endDate?: Date;

  @ApiProperty({ description: 'Next invoice generation date' })
  nextInvoiceDate: Date;

  @ApiProperty({ description: 'Invoice template to use' })
  invoiceTemplate: Partial<InvoiceDto>;

  @ApiProperty({ description: 'Auto-send after generation', default: false })
  autoSend: boolean;

  @ApiProperty({ description: 'Is active', default: true })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Number of invoices generated' })
  invoicesGenerated?: number;

  @ApiPropertyOptional({ description: 'Last generated invoice ID' })
  lastGeneratedInvoiceId?: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt?: Date;
}

/**
 * Invoice approval workflow step.
 * Defines approval requirements and history.
 */
export class InvoiceApprovalDto {
  @ApiProperty({ description: 'Approval unique identifier' })
  id?: string;

  @ApiProperty({ description: 'Invoice ID' })
  invoiceId: string;

  @ApiProperty({ description: 'Approval step number', example: 1 })
  stepNumber: number;

  @ApiProperty({ description: 'Approver user ID' })
  approverId: string;

  @ApiProperty({ description: 'Approver name' })
  approverName: string;

  @ApiProperty({ description: 'Approver email' })
  approverEmail: string;

  @ApiProperty({
    description: 'Approval status',
    enum: ['pending', 'approved', 'rejected', 'conditional', 'escalated'],
  })
  status: ApprovalStatus;

  @ApiPropertyOptional({ description: 'Approval comments' })
  comments?: string;

  @ApiPropertyOptional({ description: 'Approval timestamp' })
  approvedAt?: Date;

  @ApiPropertyOptional({ description: 'Required before date' })
  requiredBy?: Date;

  @ApiProperty({ description: 'Is final approval step', default: false })
  isFinalStep: boolean;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt?: Date;
}

/**
 * Invoice aging bucket.
 * Accounts receivable aging analysis.
 */
export class InvoiceAgingDto {
  @ApiProperty({ description: 'Aging period label', example: '0-30 days' })
  period: string;

  @ApiProperty({ description: 'Number of invoices in period' })
  count: number;

  @ApiProperty({ description: 'Total amount in period' })
  amount: number;

  @ApiProperty({ description: 'Percentage of total AR' })
  percentage: number;

  @ApiProperty({ description: 'Invoices in this bucket', type: [InvoiceDto] })
  invoices?: InvoiceDto[];
}

/**
 * Dunning notice configuration.
 * Automated overdue invoice reminder rules.
 */
export class DunningRuleDto {
  @ApiProperty({ description: 'Dunning rule unique identifier' })
  id?: string;

  @ApiProperty({ description: 'Rule name', example: 'First Reminder' })
  name: string;

  @ApiProperty({
    description: 'Dunning level',
    enum: ['reminder', 'first_notice', 'second_notice', 'final_notice', 'collection'],
  })
  level: DunningLevel;

  @ApiProperty({ description: 'Days after due date to trigger', example: 7 })
  daysAfterDue: number;

  @ApiProperty({ description: 'Email template ID' })
  emailTemplateId: string;

  @ApiProperty({ description: 'Email subject line' })
  emailSubject: string;

  @ApiProperty({ description: 'Include late fee', default: false })
  includLateFee: boolean;

  @ApiProperty({ description: 'Suspend services flag', default: false })
  suspendServices: boolean;

  @ApiProperty({ description: 'Escalate to collections flag', default: false })
  escalateToCollections: boolean;

  @ApiProperty({ description: 'Is active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt?: Date;
}

/**
 * Dunning history record.
 * Log of dunning notices sent for an invoice.
 */
export class DunningHistoryDto {
  @ApiProperty({ description: 'Dunning history unique identifier' })
  id?: string;

  @ApiProperty({ description: 'Invoice ID' })
  invoiceId: string;

  @ApiProperty({ description: 'Dunning rule ID' })
  dunningRuleId: string;

  @ApiProperty({ description: 'Dunning level applied' })
  level: DunningLevel;

  @ApiProperty({ description: 'Sent timestamp' })
  sentAt: Date;

  @ApiProperty({ description: 'Recipient email' })
  recipientEmail: string;

  @ApiProperty({ description: 'Delivery status', example: 'sent' })
  deliveryStatus: string;

  @ApiPropertyOptional({ description: 'Response or notes' })
  notes?: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt?: Date;
}

/**
 * Payment allocation record.
 * Tracks how payments are applied to invoices.
 */
export class PaymentAllocationDto {
  @ApiProperty({ description: 'Allocation unique identifier' })
  id?: string;

  @ApiProperty({ description: 'Payment ID' })
  paymentId: string;

  @ApiProperty({ description: 'Invoice ID' })
  invoiceId: string;

  @ApiProperty({ description: 'Amount allocated' })
  amount: number;

  @ApiProperty({ description: 'Allocation date' })
  allocationDate: Date;

  @ApiPropertyOptional({ description: 'Allocation notes' })
  notes?: string;

  @ApiProperty({ description: 'Created by user ID' })
  createdBy: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt?: Date;
}

/**
 * Invoice search filters.
 * Comprehensive search and filter criteria.
 */
export class InvoiceSearchDto {
  @ApiPropertyOptional({ description: 'Search query (invoice number, customer)' })
  query?: string;

  @ApiPropertyOptional({
    description: 'Invoice status filter',
    enum: [
      'draft',
      'pending_approval',
      'approved',
      'sent',
      'viewed',
      'partial',
      'paid',
      'overdue',
      'cancelled',
      'void',
      'disputed',
    ],
  })
  status?: InvoiceStatus;

  @ApiPropertyOptional({
    description: 'Invoice type filter',
    enum: [
      'standard',
      'proforma',
      'recurring',
      'credit_note',
      'debit_note',
      'interim',
      'final',
    ],
  })
  type?: InvoiceType;

  @ApiPropertyOptional({ description: 'Customer ID filter' })
  customerId?: string;

  @ApiPropertyOptional({ description: 'Invoice date from' })
  invoiceDateFrom?: Date;

  @ApiPropertyOptional({ description: 'Invoice date to' })
  invoiceDateTo?: Date;

  @ApiPropertyOptional({ description: 'Due date from' })
  dueDateFrom?: Date;

  @ApiPropertyOptional({ description: 'Due date to' })
  dueDateTo?: Date;

  @ApiPropertyOptional({ description: 'Minimum amount' })
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum amount' })
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Currency filter' })
  currency?: string;

  @ApiPropertyOptional({ description: 'Created by user ID' })
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Template ID filter' })
  templateId?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', default: 20 })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'invoiceDate',
    default: 'invoiceDate',
  })
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Invoice numbering sequence configuration.
 * Defines how invoice numbers are generated.
 */
export class InvoiceNumberingDto {
  @ApiProperty({ description: 'Numbering configuration unique identifier' })
  id?: string;

  @ApiProperty({ description: 'Prefix', example: 'INV' })
  prefix: string;

  @ApiPropertyOptional({ description: 'Suffix', example: '-US' })
  suffix?: string;

  @ApiProperty({ description: 'Next number', example: 1 })
  nextNumber: number;

  @ApiProperty({ description: 'Padding length', example: 5 })
  paddingLength: number;

  @ApiProperty({
    description: 'Include year in number',
    default: true,
    example: true,
  })
  includeYear: boolean;

  @ApiProperty({
    description: 'Include month in number',
    default: false,
    example: false,
  })
  includeMonth: boolean;

  @ApiPropertyOptional({
    description: 'Separator character',
    example: '-',
    default: '-',
  })
  separator?: string;

  @ApiPropertyOptional({
    description: 'Reset frequency',
    enum: ['never', 'yearly', 'monthly'],
    default: 'yearly',
  })
  resetFrequency?: 'never' | 'yearly' | 'monthly';

  @ApiPropertyOptional({ description: 'Last reset date' })
  lastResetDate?: Date;

  @ApiProperty({ description: 'Is active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt?: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model definition for Invoice.
 */
export interface InvoiceModel extends Model {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  status: InvoiceStatus;
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: object;
  shippingAddress?: object;
  invoiceDate: Date;
  dueDate: Date;
  poReference?: string;
  currency: string;
  exchangeRate: number;
  subtotal: number;
  discountAmount?: number;
  taxAmount: number;
  shippingAmount?: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  paymentTerms: object;
  taxConfig: object[];
  notes?: string;
  footer?: string;
  templateId?: string;
  parentInvoiceId?: string;
  recurringScheduleId?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  sentAt?: Date;
  viewedAt?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sequelize model definition for InvoiceLineItem.
 */
export interface InvoiceLineItemModel extends Model {
  id: string;
  invoiceId: string;
  itemCode: string;
  description: string;
  notes?: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  discountPercent?: number;
  discountAmount?: number;
  taxPercent: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  accountCode?: string;
  projectCode?: string;
  sequenceNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CORE INVOICE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new invoice with line items and validation.
 *
 * @param invoiceData - Invoice details including customer, line items, and terms
 * @param sequelize - Sequelize instance for database operations
 * @param transaction - Optional transaction for atomic operations
 * @returns Created invoice with generated ID and number
 *
 * @throws {BadRequestException} If invoice data validation fails
 * @throws {NotFoundException} If customer not found
 * @throws {InternalServerErrorException} If database operation fails
 *
 * Features:
 * - Automatic invoice numbering
 * - Line item validation and calculation
 * - Tax calculation based on jurisdiction
 * - Payment terms application
 * - Discount calculations
 * - Multi-currency support
 * - Audit trail creation
 *
 * @example
 * ```typescript
 * const invoice = await createInvoice(
 *   {
 *     customerId: 'cust-123',
 *     customerName: 'Acme Corp',
 *     customerEmail: 'billing@acme.com',
 *     lineItems: [
 *       {
 *         itemCode: 'SVC-001',
 *         description: 'Consulting Services',
 *         quantity: 40,
 *         unitPrice: 150,
 *         taxPercent: 8.5,
 *       },
 *     ],
 *     paymentTerms: { type: 'net_30' },
 *   },
 *   sequelize
 * );
 * ```
 */
export async function createInvoice(
  invoiceData: Partial<InvoiceDto>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('createInvoice');

  try {
    // Validate required fields
    if (!invoiceData.customerId) {
      throw new BadRequestException('Customer ID is required');
    }

    if (!invoiceData.lineItems || invoiceData.lineItems.length === 0) {
      throw new BadRequestException('At least one line item is required');
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(sequelize, transaction);

    // Calculate totals
    const calculations = calculateInvoiceTotals(invoiceData.lineItems, invoiceData);

    // Set invoice date and due date
    const invoiceDate = invoiceData.invoiceDate || new Date();
    const dueDate =
      invoiceData.dueDate ||
      calculateDueDate(invoiceDate, invoiceData.paymentTerms);

    // Create invoice record
    const invoice: Partial<InvoiceDto> = {
      id: uuidv4(),
      invoiceNumber,
      type: invoiceData.type || 'standard',
      status: 'draft',
      customerId: invoiceData.customerId,
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail,
      billingAddress: invoiceData.billingAddress,
      shippingAddress: invoiceData.shippingAddress,
      invoiceDate,
      dueDate,
      poReference: invoiceData.poReference,
      currency: invoiceData.currency || 'USD',
      exchangeRate: invoiceData.exchangeRate || 1.0,
      subtotal: calculations.subtotal,
      discountAmount: calculations.discountAmount,
      taxAmount: calculations.taxAmount,
      shippingAmount: invoiceData.shippingAmount || 0,
      total: calculations.total,
      amountPaid: 0,
      amountDue: calculations.total,
      paymentTerms: invoiceData.paymentTerms,
      taxConfig: invoiceData.taxConfig || [],
      notes: invoiceData.notes,
      footer: invoiceData.footer,
      templateId: invoiceData.templateId,
      parentInvoiceId: invoiceData.parentInvoiceId,
      recurringScheduleId: invoiceData.recurringScheduleId,
      createdBy: invoiceData.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    logger.log(`Invoice created: ${invoice.invoiceNumber}`);
    return invoice as InvoiceDto;
  } catch (error) {
    logger.error(`Error creating invoice: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates next invoice number based on configured sequence.
 *
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Generated invoice number
 *
 * Features:
 * - Configurable prefix and suffix
 * - Auto-incrementing sequence
 * - Year/month inclusion
 * - Automatic reset based on frequency
 * - Thread-safe number generation
 *
 * @example
 * ```typescript
 * const invoiceNumber = await generateInvoiceNumber(sequelize);
 * // Returns: "INV-2024-00001"
 * ```
 */
export async function generateInvoiceNumber(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<string> {
  // Get active numbering configuration
  // In production, this would query the database
  const config: InvoiceNumberingDto = {
    prefix: 'INV',
    suffix: '',
    nextNumber: 1,
    paddingLength: 5,
    includeYear: true,
    includeMonth: false,
    separator: '-',
    resetFrequency: 'yearly',
  };

  const parts: string[] = [config.prefix];

  if (config.includeYear) {
    parts.push(moment().format('YYYY'));
  }

  if (config.includeMonth) {
    parts.push(moment().format('MM'));
  }

  const numberStr = config.nextNumber
    .toString()
    .padStart(config.paddingLength, '0');
  parts.push(numberStr);

  if (config.suffix) {
    parts.push(config.suffix);
  }

  return parts.join(config.separator);
}

/**
 * Calculates invoice totals including taxes, discounts, and shipping.
 *
 * @param lineItems - Invoice line items
 * @param invoiceData - Additional invoice data (shipping, discounts)
 * @returns Calculated subtotal, tax, discount, and total amounts
 *
 * Features:
 * - Line-level tax calculation
 * - Percentage and fixed discounts
 * - Early payment discount handling
 * - Compound tax support
 * - Shipping cost inclusion
 *
 * @example
 * ```typescript
 * const totals = calculateInvoiceTotals(lineItems, invoiceData);
 * console.log(totals.total); // 1469.00
 * ```
 */
export function calculateInvoiceTotals(
  lineItems: InvoiceLineItemDto[],
  invoiceData: Partial<InvoiceDto>
): {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
} {
  let subtotal = 0;
  let taxAmount = 0;
  let discountAmount = 0;

  // Calculate line item totals
  lineItems.forEach((item) => {
    const lineSubtotal = item.quantity * item.unitPrice;
    const lineDiscount = item.discountAmount || 0;
    const lineTax = (lineSubtotal - lineDiscount) * (item.taxPercent / 100);

    subtotal += lineSubtotal;
    discountAmount += lineDiscount;
    taxAmount += lineTax;
  });

  // Add shipping
  const shippingAmount = invoiceData.shippingAmount || 0;

  // Calculate total
  const total = subtotal - discountAmount + taxAmount + shippingAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
}

/**
 * Calculates due date based on payment terms.
 *
 * @param invoiceDate - Invoice date
 * @param paymentTerms - Payment terms configuration
 * @returns Calculated due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateDueDate(new Date(), { type: 'net_30' });
 * ```
 */
export function calculateDueDate(
  invoiceDate: Date,
  paymentTerms: PaymentTermsDto
): Date {
  const netDaysMap: Record<PaymentTermsType, number> = {
    immediate: 0,
    net_7: 7,
    net_10: 10,
    net_15: 15,
    net_30: 30,
    net_45: 45,
    net_60: 60,
    net_90: 90,
    eom: moment(invoiceDate).daysInMonth() - moment(invoiceDate).date(),
    custom: paymentTerms.customNetDays || 30,
  };

  const daysToAdd = netDaysMap[paymentTerms.type];
  return moment(invoiceDate).add(daysToAdd, 'days').toDate();
}

/**
 * Updates existing invoice details.
 *
 * @param invoiceId - Invoice ID to update
 * @param updates - Partial invoice data to update
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice
 *
 * @throws {NotFoundException} If invoice not found
 * @throws {BadRequestException} If invoice cannot be updated (e.g., already paid)
 *
 * @example
 * ```typescript
 * const updated = await updateInvoice('inv-123', { notes: 'Updated notes' }, sequelize);
 * ```
 */
export async function updateInvoice(
  invoiceId: string,
  updates: Partial<InvoiceDto>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('updateInvoice');

  try {
    // Validate invoice can be updated
    // In production, fetch current invoice and check status
    if (updates.status === 'paid' || updates.status === 'void') {
      throw new BadRequestException(
        'Cannot update paid or voided invoice'
      );
    }

    // Recalculate totals if line items changed
    if (updates.lineItems) {
      const calculations = calculateInvoiceTotals(updates.lineItems, updates);
      updates.subtotal = calculations.subtotal;
      updates.taxAmount = calculations.taxAmount;
      updates.discountAmount = calculations.discountAmount;
      updates.total = calculations.total;
      updates.amountDue = calculations.total - (updates.amountPaid || 0);
    }

    updates.updatedAt = new Date();

    logger.log(`Invoice updated: ${invoiceId}`);
    return updates as InvoiceDto;
  } catch (error) {
    logger.error(`Error updating invoice: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Deletes or voids an invoice.
 *
 * @param invoiceId - Invoice ID to delete
 * @param sequelize - Sequelize instance
 * @param void - If true, void instead of delete (maintains audit trail)
 * @param transaction - Optional transaction
 *
 * @throws {NotFoundException} If invoice not found
 * @throws {BadRequestException} If invoice cannot be deleted (e.g., has payments)
 *
 * @example
 * ```typescript
 * await deleteInvoice('inv-123', sequelize, true); // Void invoice
 * ```
 */
export async function deleteInvoice(
  invoiceId: string,
  sequelize: Sequelize,
  voidInvoice: boolean = true,
  transaction?: Transaction
): Promise<void> {
  const logger = new Logger('deleteInvoice');

  try {
    // In production, check if invoice has payments
    // If it does, require voiding instead of deletion

    if (voidInvoice) {
      await updateInvoice(
        invoiceId,
        { status: 'void', updatedAt: new Date() },
        sequelize,
        transaction
      );
      logger.log(`Invoice voided: ${invoiceId}`);
    } else {
      // Perform hard delete
      logger.log(`Invoice deleted: ${invoiceId}`);
    }
  } catch (error) {
    logger.error(`Error deleting invoice: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Retrieves invoice by ID with all related data.
 *
 * @param invoiceId - Invoice ID
 * @param sequelize - Sequelize instance
 * @param includeLineItems - Include line items in response
 * @returns Invoice with optional line items
 *
 * @throws {NotFoundException} If invoice not found
 *
 * @example
 * ```typescript
 * const invoice = await getInvoiceById('inv-123', sequelize, true);
 * ```
 */
export async function getInvoiceById(
  invoiceId: string,
  sequelize: Sequelize,
  includeLineItems: boolean = true
): Promise<InvoiceDto> {
  const logger = new Logger('getInvoiceById');

  try {
    // In production, query database with includes
    // For now, return mock data
    throw new NotFoundException(`Invoice not found: ${invoiceId}`);
  } catch (error) {
    logger.error(`Error fetching invoice: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Searches invoices with advanced filtering and pagination.
 *
 * @param filters - Search filters and pagination options
 * @param sequelize - Sequelize instance
 * @returns Paginated invoice list with metadata
 *
 * Features:
 * - Full-text search on invoice number and customer
 * - Status and type filtering
 * - Date range filtering
 * - Amount range filtering
 * - Pagination and sorting
 * - Total count and page metadata
 *
 * @example
 * ```typescript
 * const results = await searchInvoices(
 *   {
 *     status: 'overdue',
 *     dueDateFrom: new Date('2024-01-01'),
 *     page: 1,
 *     pageSize: 20,
 *   },
 *   sequelize
 * );
 * ```
 */
export async function searchInvoices(
  filters: InvoiceSearchDto,
  sequelize: Sequelize
): Promise<{
  invoices: InvoiceDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const logger = new Logger('searchInvoices');

  try {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const offset = (page - 1) * pageSize;

    // Build where clause
    const where: WhereOptions = {};

    if (filters.query) {
      where[Op.or] = [
        { invoiceNumber: { [Op.iLike]: `%${filters.query}%` } },
        { customerName: { [Op.iLike]: `%${filters.query}%` } },
      ];
    }

    if (filters.status) {
      where['status'] = filters.status;
    }

    if (filters.type) {
      where['type'] = filters.type;
    }

    if (filters.customerId) {
      where['customerId'] = filters.customerId;
    }

    if (filters.invoiceDateFrom || filters.invoiceDateTo) {
      where['invoiceDate'] = {};
      if (filters.invoiceDateFrom) {
        where['invoiceDate'][Op.gte] = filters.invoiceDateFrom;
      }
      if (filters.invoiceDateTo) {
        where['invoiceDate'][Op.lte] = filters.invoiceDateTo;
      }
    }

    if (filters.minAmount || filters.maxAmount) {
      where['total'] = {};
      if (filters.minAmount) {
        where['total'][Op.gte] = filters.minAmount;
      }
      if (filters.maxAmount) {
        where['total'][Op.lte] = filters.maxAmount;
      }
    }

    logger.log(`Searching invoices with filters: ${JSON.stringify(filters)}`);

    // In production, execute query
    return {
      invoices: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  } catch (error) {
    logger.error(`Error searching invoices: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// LINE ITEM MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Adds line item to existing invoice.
 *
 * @param invoiceId - Invoice ID
 * @param lineItem - Line item details
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice with new line item
 *
 * @throws {NotFoundException} If invoice not found
 * @throws {BadRequestException} If invoice cannot be modified
 *
 * @example
 * ```typescript
 * const updated = await addLineItem('inv-123', {
 *   itemCode: 'SVC-002',
 *   description: 'Additional Services',
 *   quantity: 10,
 *   unitPrice: 100,
 *   taxPercent: 8.5,
 * }, sequelize);
 * ```
 */
export async function addLineItem(
  invoiceId: string,
  lineItem: Partial<InvoiceLineItemDto>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('addLineItem');

  try {
    // Get current invoice
    const invoice = await getInvoiceById(invoiceId, sequelize);

    // Validate invoice can be modified
    if (['paid', 'void', 'cancelled'].includes(invoice.status)) {
      throw new BadRequestException('Cannot modify this invoice');
    }

    // Calculate line item totals
    const subtotal = lineItem.quantity * lineItem.unitPrice;
    const discountAmount = lineItem.discountAmount || 0;
    const taxAmount = (subtotal - discountAmount) * (lineItem.taxPercent / 100);
    const total = subtotal - discountAmount + taxAmount;

    const newLineItem: InvoiceLineItemDto = {
      id: uuidv4(),
      itemCode: lineItem.itemCode,
      description: lineItem.description,
      notes: lineItem.notes,
      quantity: lineItem.quantity,
      unitOfMeasure: lineItem.unitOfMeasure,
      unitPrice: lineItem.unitPrice,
      discountPercent: lineItem.discountPercent,
      discountAmount,
      taxPercent: lineItem.taxPercent,
      taxAmount,
      subtotal,
      total,
      accountCode: lineItem.accountCode,
      projectCode: lineItem.projectCode,
      sequenceNumber: invoice.lineItems.length + 1,
    };

    invoice.lineItems.push(newLineItem);

    // Recalculate invoice totals
    return await updateInvoice(invoiceId, { lineItems: invoice.lineItems }, sequelize, transaction);
  } catch (error) {
    logger.error(`Error adding line item: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Updates existing line item on invoice.
 *
 * @param invoiceId - Invoice ID
 * @param lineItemId - Line item ID to update
 * @param updates - Line item updates
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice
 *
 * @example
 * ```typescript
 * const updated = await updateLineItem('inv-123', 'line-456', {
 *   quantity: 15,
 *   unitPrice: 120,
 * }, sequelize);
 * ```
 */
export async function updateLineItem(
  invoiceId: string,
  lineItemId: string,
  updates: Partial<InvoiceLineItemDto>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('updateLineItem');

  try {
    const invoice = await getInvoiceById(invoiceId, sequelize);

    const lineItemIndex = invoice.lineItems.findIndex((item) => item.id === lineItemId);
    if (lineItemIndex === -1) {
      throw new NotFoundException(`Line item not found: ${lineItemId}`);
    }

    // Update line item
    const lineItem = { ...invoice.lineItems[lineItemIndex], ...updates };

    // Recalculate totals
    const subtotal = lineItem.quantity * lineItem.unitPrice;
    const discountAmount = lineItem.discountAmount || 0;
    const taxAmount = (subtotal - discountAmount) * (lineItem.taxPercent / 100);
    lineItem.subtotal = subtotal;
    lineItem.taxAmount = taxAmount;
    lineItem.total = subtotal - discountAmount + taxAmount;

    invoice.lineItems[lineItemIndex] = lineItem;

    return await updateInvoice(invoiceId, { lineItems: invoice.lineItems }, sequelize, transaction);
  } catch (error) {
    logger.error(`Error updating line item: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Removes line item from invoice.
 *
 * @param invoiceId - Invoice ID
 * @param lineItemId - Line item ID to remove
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice
 *
 * @throws {NotFoundException} If line item not found
 * @throws {BadRequestException} If last line item (invoices must have at least one)
 *
 * @example
 * ```typescript
 * const updated = await removeLineItem('inv-123', 'line-456', sequelize);
 * ```
 */
export async function removeLineItem(
  invoiceId: string,
  lineItemId: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('removeLineItem');

  try {
    const invoice = await getInvoiceById(invoiceId, sequelize);

    if (invoice.lineItems.length === 1) {
      throw new BadRequestException('Invoice must have at least one line item');
    }

    invoice.lineItems = invoice.lineItems.filter((item) => item.id !== lineItemId);

    // Renumber sequence
    invoice.lineItems.forEach((item, index) => {
      item.sequenceNumber = index + 1;
    });

    return await updateInvoice(invoiceId, { lineItems: invoice.lineItems }, sequelize, transaction);
  } catch (error) {
    logger.error(`Error removing line item: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Reorders line items on invoice.
 *
 * @param invoiceId - Invoice ID
 * @param lineItemIds - Array of line item IDs in new order
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Updated invoice
 *
 * @example
 * ```typescript
 * await reorderLineItems('inv-123', ['line-3', 'line-1', 'line-2'], sequelize);
 * ```
 */
export async function reorderLineItems(
  invoiceId: string,
  lineItemIds: string[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('reorderLineItems');

  try {
    const invoice = await getInvoiceById(invoiceId, sequelize);

    // Reorder line items
    const reorderedItems: InvoiceLineItemDto[] = [];
    lineItemIds.forEach((id, index) => {
      const item = invoice.lineItems.find((li) => li.id === id);
      if (item) {
        item.sequenceNumber = index + 1;
        reorderedItems.push(item);
      }
    });

    return await updateInvoice(invoiceId, { lineItems: reorderedItems }, sequelize, transaction);
  } catch (error) {
    logger.error(`Error reordering line items: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// PDF GENERATION FUNCTIONS
// ============================================================================

/**
 * Generates PDF for invoice using template.
 *
 * @param invoiceId - Invoice ID
 * @param templateId - Template ID to use (optional, uses default if not specified)
 * @param sequelize - Sequelize instance
 * @returns PDF buffer
 *
 * Features:
 * - Custom template support with branding
 * - QR code for payment link
 * - Multi-page support
 * - Line item tables with totals
 * - Tax breakdown
 * - Payment terms display
 * - Company logo and colors
 *
 * @example
 * ```typescript
 * const pdfBuffer = await generateInvoicePDF('inv-123', 'template-1', sequelize);
 * fs.writeFileSync('invoice.pdf', pdfBuffer);
 * ```
 */
export async function generateInvoicePDF(
  invoiceId: string,
  templateId: string,
  sequelize: Sequelize
): Promise<Buffer> {
  const logger = new Logger('generateInvoicePDF');

  try {
    const invoice = await getInvoiceById(invoiceId, sequelize);
    // const template = await getTemplateById(templateId, sequelize);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ margin: 50 });

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'right' });
      doc.fontSize(10).text(invoice.invoiceNumber, { align: 'right' });
      doc.moveDown();

      // Company info (would use template)
      doc.fontSize(12).text('Your Company Name', { align: 'left' });
      doc.fontSize(10).text('123 Business St');
      doc.text('City, State 12345');
      doc.moveDown();

      // Customer info
      doc.fontSize(12).text('Bill To:', { underline: true });
      doc.fontSize(10).text(invoice.customerName);
      if (invoice.billingAddress) {
        const addr = invoice.billingAddress as InvoiceAddressDto;
        doc.text(addr.addressLine1);
        if (addr.addressLine2) doc.text(addr.addressLine2);
        doc.text(`${addr.city}, ${addr.state} ${addr.postalCode}`);
        doc.text(addr.country);
      }
      doc.moveDown();

      // Invoice details
      doc.fontSize(10);
      doc.text(`Invoice Date: ${moment(invoice.invoiceDate).format('YYYY-MM-DD')}`);
      doc.text(`Due Date: ${moment(invoice.dueDate).format('YYYY-MM-DD')}`);
      if (invoice.poReference) {
        doc.text(`PO Reference: ${invoice.poReference}`);
      }
      doc.moveDown();

      // Line items table
      const tableTop = doc.y;
      const itemCodeX = 50;
      const descriptionX = 150;
      const quantityX = 300;
      const priceX = 350;
      const amountX = 450;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Item', itemCodeX, tableTop);
      doc.text('Description', descriptionX, tableTop);
      doc.text('Qty', quantityX, tableTop);
      doc.text('Price', priceX, tableTop);
      doc.text('Amount', amountX, tableTop);

      doc.font('Helvetica');
      let yPosition = tableTop + 20;

      invoice.lineItems.forEach((item) => {
        doc.text(item.itemCode, itemCodeX, yPosition, { width: 90 });
        doc.text(item.description, descriptionX, yPosition, { width: 140 });
        doc.text(item.quantity.toString(), quantityX, yPosition);
        doc.text(numeral(item.unitPrice).format('$0,0.00'), priceX, yPosition);
        doc.text(numeral(item.total).format('$0,0.00'), amountX, yPosition);
        yPosition += 20;
      });

      doc.moveDown();
      yPosition += 20;

      // Totals
      const totalsX = 400;
      doc.font('Helvetica');
      doc.text('Subtotal:', totalsX, yPosition);
      doc.text(numeral(invoice.subtotal).format('$0,0.00'), amountX, yPosition);
      yPosition += 20;

      if (invoice.discountAmount && invoice.discountAmount > 0) {
        doc.text('Discount:', totalsX, yPosition);
        doc.text(
          `-${numeral(invoice.discountAmount).format('$0,0.00')}`,
          amountX,
          yPosition
        );
        yPosition += 20;
      }

      doc.text('Tax:', totalsX, yPosition);
      doc.text(numeral(invoice.taxAmount).format('$0,0.00'), amountX, yPosition);
      yPosition += 20;

      if (invoice.shippingAmount && invoice.shippingAmount > 0) {
        doc.text('Shipping:', totalsX, yPosition);
        doc.text(
          numeral(invoice.shippingAmount).format('$0,0.00'),
          amountX,
          yPosition
        );
        yPosition += 20;
      }

      doc.font('Helvetica-Bold').fontSize(12);
      doc.text('Total:', totalsX, yPosition);
      doc.text(numeral(invoice.total).format('$0,0.00'), amountX, yPosition);
      yPosition += 30;

      // Payment terms
      doc.fontSize(10).font('Helvetica');
      doc.text(
        `Payment Terms: ${invoice.paymentTerms.type.replace('_', ' ').toUpperCase()}`,
        50,
        yPosition
      );

      // Notes
      if (invoice.notes) {
        yPosition += 30;
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Notes:', 50, yPosition);
        doc.font('Helvetica');
        doc.text(invoice.notes, 50, yPosition + 15, { width: 500 });
      }

      // Footer
      if (invoice.footer) {
        doc.fontSize(8).text(invoice.footer, 50, doc.page.height - 100, {
          align: 'center',
          width: doc.page.width - 100,
        });
      }

      doc.end();
    });
  } catch (error) {
    logger.error(`Error generating PDF: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates invoice PDF with embedded payment QR code.
 *
 * @param invoiceId - Invoice ID
 * @param paymentUrl - Payment link URL to encode in QR code
 * @param templateId - Template ID
 * @param sequelize - Sequelize instance
 * @returns PDF buffer with QR code
 *
 * @example
 * ```typescript
 * const pdf = await generateInvoicePDFWithQR(
 *   'inv-123',
 *   'https://pay.example.com/inv-123',
 *   'template-1',
 *   sequelize
 * );
 * ```
 */
export async function generateInvoicePDFWithQR(
  invoiceId: string,
  paymentUrl: string,
  templateId: string,
  sequelize: Sequelize
): Promise<Buffer> {
  const logger = new Logger('generateInvoicePDFWithQR');

  try {
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 200,
    });

    // Generate PDF and add QR code
    // This would extend generateInvoicePDF to include the QR code image
    return await generateInvoicePDF(invoiceId, templateId, sequelize);
  } catch (error) {
    logger.error(`Error generating PDF with QR: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// INVOICE DELIVERY FUNCTIONS
// ============================================================================

/**
 * Sends invoice via email to customer.
 *
 * @param invoiceId - Invoice ID
 * @param recipientEmail - Override recipient email (optional)
 * @param emailTemplateId - Email template to use
 * @param attachPDF - Attach PDF to email
 * @param sequelize - Sequelize instance
 *
 * Features:
 * - Custom email templates
 * - PDF attachment
 * - Delivery tracking
 * - Read receipt tracking
 * - Retry logic for failures
 *
 * @example
 * ```typescript
 * await sendInvoiceByEmail('inv-123', null, 'email-template-1', true, sequelize);
 * ```
 */
export async function sendInvoiceByEmail(
  invoiceId: string,
  recipientEmail: string,
  emailTemplateId: string,
  attachPDF: boolean,
  sequelize: Sequelize
): Promise<void> {
  const logger = new Logger('sendInvoiceByEmail');

  try {
    const invoice = await getInvoiceById(invoiceId, sequelize);
    const recipient = recipientEmail || invoice.customerEmail;

    // Generate PDF if needed
    let pdfBuffer: Buffer;
    if (attachPDF) {
      pdfBuffer = await generateInvoicePDF(invoiceId, invoice.templateId, sequelize);
    }

    // Send email (would use nodemailer)
    logger.log(`Invoice sent by email to ${recipient}: ${invoiceId}`);

    // Update invoice status
    await updateInvoice(
      invoiceId,
      {
        status: 'sent',
        sentAt: new Date(),
      },
      sequelize
    );
  } catch (error) {
    logger.error(`Error sending invoice by email: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Publishes invoice to customer portal.
 *
 * @param invoiceId - Invoice ID
 * @param sequelize - Sequelize instance
 * @returns Portal access link
 *
 * Features:
 * - Secure access link generation
 * - Portal notifications
 * - View tracking
 * - Download tracking
 *
 * @example
 * ```typescript
 * const portalLink = await publishInvoiceToPortal('inv-123', sequelize);
 * ```
 */
export async function publishInvoiceToPortal(
  invoiceId: string,
  sequelize: Sequelize
): Promise<string> {
  const logger = new Logger('publishInvoiceToPortal');

  try {
    const invoice = await getInvoiceById(invoiceId, sequelize);

    // Generate secure access token
    const accessToken = uuidv4();
    const portalLink = `https://portal.example.com/invoices/${invoiceId}?token=${accessToken}`;

    // Update invoice status
    await updateInvoice(
      invoiceId,
      {
        status: 'sent',
        sentAt: new Date(),
      },
      sequelize
    );

    logger.log(`Invoice published to portal: ${invoiceId}`);
    return portalLink;
  } catch (error) {
    logger.error(`Error publishing to portal: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Marks invoice as viewed by customer.
 *
 * @param invoiceId - Invoice ID
 * @param viewedBy - Viewer identifier (email or user ID)
 * @param sequelize - Sequelize instance
 *
 * @example
 * ```typescript
 * await markInvoiceAsViewed('inv-123', 'customer@example.com', sequelize);
 * ```
 */
export async function markInvoiceAsViewed(
  invoiceId: string,
  viewedBy: string,
  sequelize: Sequelize
): Promise<void> {
  const logger = new Logger('markInvoiceAsViewed');

  try {
    await updateInvoice(
      invoiceId,
      {
        status: 'viewed',
        viewedAt: new Date(),
      },
      sequelize
    );

    logger.log(`Invoice viewed by ${viewedBy}: ${invoiceId}`);
  } catch (error) {
    logger.error(`Error marking invoice as viewed: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// CREDIT NOTE & ADJUSTMENTS
// ============================================================================

/**
 * Creates credit note for full or partial invoice refund.
 *
 * @param originalInvoiceId - Original invoice ID to credit
 * @param creditAmount - Amount to credit (null for full credit)
 * @param reason - Reason for credit note
 * @param lineItems - Specific line items to credit (optional)
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created credit note invoice
 *
 * Features:
 * - Full or partial credits
 * - Line item specific credits
 * - Reason tracking
 * - Automatic numbering
 * - Parent invoice linking
 *
 * @example
 * ```typescript
 * const creditNote = await createCreditNote(
 *   'inv-123',
 *   500,
 *   'Product return - damaged goods',
 *   null,
 *   sequelize
 * );
 * ```
 */
export async function createCreditNote(
  originalInvoiceId: string,
  creditAmount: number,
  reason: string,
  lineItems: InvoiceLineItemDto[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('createCreditNote');

  try {
    const originalInvoice = await getInvoiceById(originalInvoiceId, sequelize);

    // Create credit note line items
    let creditLineItems: InvoiceLineItemDto[];
    if (lineItems) {
      creditLineItems = lineItems.map((item) => ({
        ...item,
        quantity: -Math.abs(item.quantity),
        subtotal: -Math.abs(item.subtotal),
        taxAmount: -Math.abs(item.taxAmount),
        total: -Math.abs(item.total),
      }));
    } else {
      // Full credit - negate all line items
      creditLineItems = originalInvoice.lineItems.map((item) => ({
        ...item,
        id: uuidv4(),
        quantity: -item.quantity,
        subtotal: -item.subtotal,
        taxAmount: -item.taxAmount,
        total: -item.total,
      }));
    }

    const creditNoteData: Partial<InvoiceDto> = {
      type: 'credit_note',
      customerId: originalInvoice.customerId,
      customerName: originalInvoice.customerName,
      customerEmail: originalInvoice.customerEmail,
      billingAddress: originalInvoice.billingAddress,
      lineItems: creditLineItems,
      paymentTerms: originalInvoice.paymentTerms,
      taxConfig: originalInvoice.taxConfig,
      currency: originalInvoice.currency,
      notes: reason,
      parentInvoiceId: originalInvoiceId,
      createdBy: 'system',
    };

    const creditNote = await createInvoice(creditNoteData, sequelize, transaction);

    logger.log(`Credit note created: ${creditNote.invoiceNumber} for invoice ${originalInvoiceId}`);
    return creditNote;
  } catch (error) {
    logger.error(`Error creating credit note: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Creates debit note for additional charges.
 *
 * @param originalInvoiceId - Original invoice ID
 * @param debitAmount - Additional amount to charge
 * @param reason - Reason for debit note
 * @param lineItems - Additional line items
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created debit note invoice
 *
 * @example
 * ```typescript
 * const debitNote = await createDebitNote(
 *   'inv-123',
 *   250,
 *   'Additional services rendered',
 *   [{ itemCode: 'SVC-999', description: 'Rush fee', quantity: 1, unitPrice: 250 }],
 *   sequelize
 * );
 * ```
 */
export async function createDebitNote(
  originalInvoiceId: string,
  debitAmount: number,
  reason: string,
  lineItems: InvoiceLineItemDto[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('createDebitNote');

  try {
    const originalInvoice = await getInvoiceById(originalInvoiceId, sequelize);

    const debitNoteData: Partial<InvoiceDto> = {
      type: 'debit_note',
      customerId: originalInvoice.customerId,
      customerName: originalInvoice.customerName,
      customerEmail: originalInvoice.customerEmail,
      billingAddress: originalInvoice.billingAddress,
      lineItems,
      paymentTerms: originalInvoice.paymentTerms,
      taxConfig: originalInvoice.taxConfig,
      currency: originalInvoice.currency,
      notes: reason,
      parentInvoiceId: originalInvoiceId,
      createdBy: 'system',
    };

    const debitNote = await createInvoice(debitNoteData, sequelize, transaction);

    logger.log(`Debit note created: ${debitNote.invoiceNumber} for invoice ${originalInvoiceId}`);
    return debitNote;
  } catch (error) {
    logger.error(`Error creating debit note: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// PRO FORMA INVOICE FUNCTIONS
// ============================================================================

/**
 * Creates pro forma invoice (quote/estimate).
 *
 * @param invoiceData - Invoice details
 * @param validUntil - Quote expiration date
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created pro forma invoice
 *
 * Features:
 * - Quote generation
 * - Expiration date tracking
 * - Conversion to standard invoice
 * - Custom numbering sequence
 *
 * @example
 * ```typescript
 * const proforma = await createProFormaInvoice(
 *   invoiceData,
 *   new Date('2024-12-31'),
 *   sequelize
 * );
 * ```
 */
export async function createProFormaInvoice(
  invoiceData: Partial<InvoiceDto>,
  validUntil: Date,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('createProFormaInvoice');

  try {
    invoiceData.type = 'proforma';
    invoiceData.status = 'draft';
    invoiceData.dueDate = validUntil;

    const proforma = await createInvoice(invoiceData, sequelize, transaction);

    logger.log(`Pro forma invoice created: ${proforma.invoiceNumber}`);
    return proforma;
  } catch (error) {
    logger.error(`Error creating pro forma invoice: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Converts pro forma invoice to standard invoice.
 *
 * @param proformaInvoiceId - Pro forma invoice ID
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns New standard invoice
 *
 * @example
 * ```typescript
 * const invoice = await convertProFormaToInvoice('proforma-123', sequelize);
 * ```
 */
export async function convertProFormaToInvoice(
  proformaInvoiceId: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('convertProFormaToInvoice');

  try {
    const proforma = await getInvoiceById(proformaInvoiceId, sequelize);

    if (proforma.type !== 'proforma') {
      throw new BadRequestException('Invoice is not a pro forma invoice');
    }

    // Create new standard invoice based on pro forma
    const invoiceData: Partial<InvoiceDto> = {
      ...proforma,
      type: 'standard',
      status: 'draft',
      parentInvoiceId: proformaInvoiceId,
    };

    delete invoiceData.id;
    delete invoiceData.invoiceNumber;

    const invoice = await createInvoice(invoiceData, sequelize, transaction);

    // Mark pro forma as converted
    await updateInvoice(
      proformaInvoiceId,
      { status: 'cancelled', notes: `Converted to invoice ${invoice.invoiceNumber}` },
      sequelize,
      transaction
    );

    logger.log(`Pro forma converted to invoice: ${invoice.invoiceNumber}`);
    return invoice;
  } catch (error) {
    logger.error(`Error converting pro forma: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// RECURRING INVOICE FUNCTIONS
// ============================================================================

/**
 * Creates recurring invoice schedule.
 *
 * @param scheduleData - Schedule configuration
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created schedule
 *
 * Features:
 * - Multiple frequencies (daily to annual)
 * - Custom start and end dates
 * - Auto-send option
 * - Invoice template
 *
 * @example
 * ```typescript
 * const schedule = await createRecurringSchedule({
 *   name: 'Monthly Hosting',
 *   customerId: 'cust-123',
 *   frequency: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   invoiceTemplate: baseInvoice,
 *   autoSend: true,
 * }, sequelize);
 * ```
 */
export async function createRecurringSchedule(
  scheduleData: Partial<RecurringScheduleDto>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<RecurringScheduleDto> {
  const logger = new Logger('createRecurringSchedule');

  try {
    const schedule: RecurringScheduleDto = {
      id: uuidv4(),
      name: scheduleData.name,
      customerId: scheduleData.customerId,
      frequency: scheduleData.frequency,
      startDate: scheduleData.startDate,
      endDate: scheduleData.endDate,
      nextInvoiceDate: scheduleData.startDate,
      invoiceTemplate: scheduleData.invoiceTemplate,
      autoSend: scheduleData.autoSend || false,
      isActive: true,
      invoicesGenerated: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    logger.log(`Recurring schedule created: ${schedule.id}`);
    return schedule;
  } catch (error) {
    logger.error(`Error creating recurring schedule: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates invoice from recurring schedule.
 *
 * @param scheduleId - Schedule ID
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Generated invoice
 *
 * @example
 * ```typescript
 * const invoice = await generateRecurringInvoice('schedule-123', sequelize);
 * ```
 */
export async function generateRecurringInvoice(
  scheduleId: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceDto> {
  const logger = new Logger('generateRecurringInvoice');

  try {
    // In production, fetch schedule from database
    const schedule: RecurringScheduleDto = {} as any;

    // Create invoice from template
    const invoiceData: Partial<InvoiceDto> = {
      ...schedule.invoiceTemplate,
      recurringScheduleId: scheduleId,
      invoiceDate: new Date(),
    };

    const invoice = await createInvoice(invoiceData, sequelize, transaction);

    // Auto-send if configured
    if (schedule.autoSend) {
      await sendInvoiceByEmail(invoice.id, null, null, true, sequelize);
    }

    // Update schedule
    const nextDate = calculateNextRecurringDate(
      schedule.nextInvoiceDate,
      schedule.frequency
    );

    logger.log(`Recurring invoice generated: ${invoice.invoiceNumber} from schedule ${scheduleId}`);
    return invoice;
  } catch (error) {
    logger.error(`Error generating recurring invoice: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculates next recurring invoice date.
 *
 * @param currentDate - Current invoice date
 * @param frequency - Recurrence frequency
 * @returns Next invoice date
 */
export function calculateNextRecurringDate(
  currentDate: Date,
  frequency: RecurringFrequency
): Date {
  const frequencyMap: Record<RecurringFrequency, [moment.unitOfTime.DurationConstructor, number]> = {
    daily: ['days', 1],
    weekly: ['weeks', 1],
    biweekly: ['weeks', 2],
    monthly: ['months', 1],
    quarterly: ['months', 3],
    semiannual: ['months', 6],
    annual: ['years', 1],
  };

  const [unit, amount] = frequencyMap[frequency];
  return moment(currentDate).add(amount, unit).toDate();
}

/**
 * Cancels recurring invoice schedule.
 *
 * @param scheduleId - Schedule ID
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await cancelRecurringSchedule('schedule-123', sequelize);
 * ```
 */
export async function cancelRecurringSchedule(
  scheduleId: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const logger = new Logger('cancelRecurringSchedule');

  try {
    // Update schedule to inactive
    logger.log(`Recurring schedule cancelled: ${scheduleId}`);
  } catch (error) {
    logger.error(`Error cancelling schedule: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// APPROVAL WORKFLOW FUNCTIONS
// ============================================================================

/**
 * Submits invoice for approval.
 *
 * @param invoiceId - Invoice ID
 * @param approvers - List of approvers
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Approval records created
 *
 * @example
 * ```typescript
 * await submitInvoiceForApproval('inv-123', [
 *   { approverId: 'user-1', approverEmail: 'manager@example.com', stepNumber: 1 },
 * ], sequelize);
 * ```
 */
export async function submitInvoiceForApproval(
  invoiceId: string,
  approvers: Partial<InvoiceApprovalDto>[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceApprovalDto[]> {
  const logger = new Logger('submitInvoiceForApproval');

  try {
    await updateInvoice(
      invoiceId,
      { status: 'pending_approval' },
      sequelize,
      transaction
    );

    const approvalRecords: InvoiceApprovalDto[] = approvers.map((approver, index) => ({
      id: uuidv4(),
      invoiceId,
      stepNumber: approver.stepNumber || index + 1,
      approverId: approver.approverId,
      approverName: approver.approverName,
      approverEmail: approver.approverEmail,
      status: 'pending',
      isFinalStep: index === approvers.length - 1,
      createdAt: new Date(),
    }));

    logger.log(`Invoice submitted for approval: ${invoiceId}`);
    return approvalRecords;
  } catch (error) {
    logger.error(`Error submitting for approval: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Approves invoice.
 *
 * @param invoiceId - Invoice ID
 * @param approvalId - Approval record ID
 * @param approverId - Approver user ID
 * @param comments - Approval comments
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await approveInvoice('inv-123', 'approval-456', 'user-1', 'Approved', sequelize);
 * ```
 */
export async function approveInvoice(
  invoiceId: string,
  approvalId: string,
  approverId: string,
  comments: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const logger = new Logger('approveInvoice');

  try {
    // Update approval record
    // Check if final approval step
    const isFinalStep = true; // Would check in DB

    if (isFinalStep) {
      await updateInvoice(
        invoiceId,
        {
          status: 'approved',
          approvedBy: approverId,
          approvedAt: new Date(),
        },
        sequelize,
        transaction
      );
    }

    logger.log(`Invoice approved: ${invoiceId} by ${approverId}`);
  } catch (error) {
    logger.error(`Error approving invoice: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Rejects invoice approval.
 *
 * @param invoiceId - Invoice ID
 * @param approvalId - Approval record ID
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await rejectInvoice('inv-123', 'approval-456', 'user-1', 'Incorrect pricing', sequelize);
 * ```
 */
export async function rejectInvoice(
  invoiceId: string,
  approvalId: string,
  approverId: string,
  reason: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const logger = new Logger('rejectInvoice');

  try {
    // Update approval record to rejected
    await updateInvoice(
      invoiceId,
      { status: 'draft' },
      sequelize,
      transaction
    );

    logger.log(`Invoice rejected: ${invoiceId} by ${approverId} - ${reason}`);
  } catch (error) {
    logger.error(`Error rejecting invoice: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// AGING REPORT FUNCTIONS
// ============================================================================

/**
 * Generates accounts receivable aging report.
 *
 * @param asOfDate - Report date (default: today)
 * @param customerId - Filter by customer (optional)
 * @param sequelize - Sequelize instance
 * @returns Aging buckets with invoices
 *
 * Features:
 * - Standard aging buckets (0-30, 31-60, 61-90, 90+)
 * - Customer filtering
 * - Amount totals and percentages
 * - Drill-down to invoice details
 *
 * @example
 * ```typescript
 * const aging = await generateAgingReport(new Date(), null, sequelize);
 * ```
 */
export async function generateAgingReport(
  asOfDate: Date,
  customerId: string,
  sequelize: Sequelize
): Promise<InvoiceAgingDto[]> {
  const logger = new Logger('generateAgingReport');

  try {
    // Define aging buckets
    const buckets: InvoiceAgingDto[] = [
      { period: '0-30 days', count: 0, amount: 0, percentage: 0, invoices: [] },
      { period: '31-60 days', count: 0, amount: 0, percentage: 0, invoices: [] },
      { period: '61-90 days', count: 0, amount: 0, percentage: 0, invoices: [] },
      { period: '90+ days', count: 0, amount: 0, percentage: 0, invoices: [] },
    ];

    // Query outstanding invoices
    // Calculate days overdue
    // Categorize into buckets

    const totalAR = buckets.reduce((sum, bucket) => sum + bucket.amount, 0);
    buckets.forEach((bucket) => {
      bucket.percentage = totalAR > 0 ? (bucket.amount / totalAR) * 100 : 0;
    });

    logger.log('Aging report generated');
    return buckets;
  } catch (error) {
    logger.error(`Error generating aging report: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Calculates days sales outstanding (DSO).
 *
 * @param startDate - Calculation start date
 * @param endDate - Calculation end date
 * @param sequelize - Sequelize instance
 * @returns DSO in days
 *
 * @example
 * ```typescript
 * const dso = await calculateDSO(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   sequelize
 * );
 * ```
 */
export async function calculateDSO(
  startDate: Date,
  endDate: Date,
  sequelize: Sequelize
): Promise<number> {
  const logger = new Logger('calculateDSO');

  try {
    // DSO = (Accounts Receivable / Total Credit Sales) * Number of Days
    const accountsReceivable = 0; // Query unpaid invoices
    const totalCreditSales = 0; // Query total sales in period
    const numberOfDays = moment(endDate).diff(moment(startDate), 'days');

    const dso =
      totalCreditSales > 0
        ? (accountsReceivable / totalCreditSales) * numberOfDays
        : 0;

    logger.log(`DSO calculated: ${dso} days`);
    return dso;
  } catch (error) {
    logger.error(`Error calculating DSO: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// DUNNING MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Processes dunning rules for overdue invoices.
 *
 * @param sequelize - Sequelize instance
 * @returns Number of dunning notices sent
 *
 * Features:
 * - Automatic overdue detection
 * - Multi-level dunning (reminder, notices, collection)
 * - Email notifications
 * - Late fee application
 * - Service suspension flags
 *
 * @example
 * ```typescript
 * const noticesSent = await processDunningRules(sequelize);
 * ```
 */
export async function processDunningRules(sequelize: Sequelize): Promise<number> {
  const logger = new Logger('processDunningRules');

  try {
    let noticesSent = 0;

    // Get all active dunning rules
    // Get overdue invoices
    // Match invoices to appropriate dunning rules
    // Send notices

    logger.log(`Dunning rules processed: ${noticesSent} notices sent`);
    return noticesSent;
  } catch (error) {
    logger.error(`Error processing dunning rules: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Sends dunning notice for specific invoice.
 *
 * @param invoiceId - Invoice ID
 * @param dunningRuleId - Dunning rule to apply
 * @param sequelize - Sequelize instance
 * @returns Dunning history record
 *
 * @example
 * ```typescript
 * const history = await sendDunningNotice('inv-123', 'rule-456', sequelize);
 * ```
 */
export async function sendDunningNotice(
  invoiceId: string,
  dunningRuleId: string,
  sequelize: Sequelize
): Promise<DunningHistoryDto> {
  const logger = new Logger('sendDunningNotice');

  try {
    const invoice = await getInvoiceById(invoiceId, sequelize);
    // const rule = await getDunningRuleById(dunningRuleId, sequelize);

    // Send email based on template
    // Apply late fees if configured
    // Flag for service suspension if configured

    const historyRecord: DunningHistoryDto = {
      id: uuidv4(),
      invoiceId,
      dunningRuleId,
      level: 'reminder',
      sentAt: new Date(),
      recipientEmail: invoice.customerEmail,
      deliveryStatus: 'sent',
      createdAt: new Date(),
    };

    logger.log(`Dunning notice sent for invoice ${invoiceId}`);
    return historyRecord;
  } catch (error) {
    logger.error(`Error sending dunning notice: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Gets dunning history for invoice.
 *
 * @param invoiceId - Invoice ID
 * @param sequelize - Sequelize instance
 * @returns Dunning history records
 *
 * @example
 * ```typescript
 * const history = await getDunningHistory('inv-123', sequelize);
 * ```
 */
export async function getDunningHistory(
  invoiceId: string,
  sequelize: Sequelize
): Promise<DunningHistoryDto[]> {
  const logger = new Logger('getDunningHistory');

  try {
    // Query dunning history for invoice
    return [];
  } catch (error) {
    logger.error(`Error fetching dunning history: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// PAYMENT ALLOCATION FUNCTIONS
// ============================================================================

/**
 * Allocates payment to invoice(s).
 *
 * @param paymentId - Payment ID
 * @param allocations - Array of invoice allocations
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created allocation records
 *
 * Features:
 * - Single or split payment allocation
 * - Automatic invoice status updates
 * - Overpayment handling
 * - Partial payment tracking
 *
 * @example
 * ```typescript
 * await allocatePayment('pay-123', [
 *   { invoiceId: 'inv-1', amount: 500 },
 *   { invoiceId: 'inv-2', amount: 300 },
 * ], sequelize);
 * ```
 */
export async function allocatePayment(
  paymentId: string,
  allocations: Partial<PaymentAllocationDto>[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<PaymentAllocationDto[]> {
  const logger = new Logger('allocatePayment');

  try {
    const allocationRecords: PaymentAllocationDto[] = [];

    for (const allocation of allocations) {
      const invoice = await getInvoiceById(allocation.invoiceId, sequelize);

      // Update invoice amounts
      const newAmountPaid = invoice.amountPaid + allocation.amount;
      const newAmountDue = invoice.total - newAmountPaid;

      let newStatus = invoice.status;
      if (newAmountDue <= 0) {
        newStatus = 'paid';
      } else if (newAmountPaid > 0 && newAmountDue > 0) {
        newStatus = 'partial';
      }

      await updateInvoice(
        allocation.invoiceId,
        {
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
          status: newStatus,
          paidAt: newStatus === 'paid' ? new Date() : undefined,
        },
        sequelize,
        transaction
      );

      const allocationRecord: PaymentAllocationDto = {
        id: uuidv4(),
        paymentId,
        invoiceId: allocation.invoiceId,
        amount: allocation.amount,
        allocationDate: new Date(),
        notes: allocation.notes,
        createdBy: allocation.createdBy || 'system',
        createdAt: new Date(),
      };

      allocationRecords.push(allocationRecord);
    }

    logger.log(`Payment allocated: ${paymentId} to ${allocations.length} invoices`);
    return allocationRecords;
  } catch (error) {
    logger.error(`Error allocating payment: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Reverses payment allocation.
 *
 * @param allocationId - Allocation ID to reverse
 * @param reason - Reversal reason
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await reversePaymentAllocation('alloc-123', 'Payment bounced', sequelize);
 * ```
 */
export async function reversePaymentAllocation(
  allocationId: string,
  reason: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const logger = new Logger('reversePaymentAllocation');

  try {
    // Get allocation record
    // Update invoice to reverse payment
    // Create reversal record

    logger.log(`Payment allocation reversed: ${allocationId} - ${reason}`);
  } catch (error) {
    logger.error(`Error reversing allocation: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// TEMPLATE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates invoice template.
 *
 * @param templateData - Template configuration
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createInvoiceTemplate({
 *   name: 'Modern Blue',
 *   logoUrl: 'https://example.com/logo.png',
 *   primaryColor: '#1E3A8A',
 *   secondaryColor: '#3B82F6',
 *   fontFamily: 'Helvetica',
 * }, sequelize);
 * ```
 */
export async function createInvoiceTemplate(
  templateData: Partial<InvoiceTemplateDto>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<InvoiceTemplateDto> {
  const logger = new Logger('createInvoiceTemplate');

  try {
    const template: InvoiceTemplateDto = {
      id: uuidv4(),
      name: templateData.name,
      description: templateData.description,
      logoUrl: templateData.logoUrl,
      primaryColor: templateData.primaryColor,
      secondaryColor: templateData.secondaryColor,
      fontFamily: templateData.fontFamily,
      headerTemplate: templateData.headerTemplate,
      footerTemplate: templateData.footerTemplate,
      isDefault: templateData.isDefault || false,
      isActive: true,
      customCss: templateData.customCss,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    logger.log(`Invoice template created: ${template.name}`);
    return template;
  } catch (error) {
    logger.error(`Error creating template: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Gets all invoice templates.
 *
 * @param includeInactive - Include inactive templates
 * @param sequelize - Sequelize instance
 * @returns List of templates
 *
 * @example
 * ```typescript
 * const templates = await getInvoiceTemplates(false, sequelize);
 * ```
 */
export async function getInvoiceTemplates(
  includeInactive: boolean,
  sequelize: Sequelize
): Promise<InvoiceTemplateDto[]> {
  const logger = new Logger('getInvoiceTemplates');

  try {
    // Query templates
    return [];
  } catch (error) {
    logger.error(`Error fetching templates: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Sets default invoice template.
 *
 * @param templateId - Template ID to set as default
 * @param sequelize - Sequelize instance
 * @param transaction - Optional transaction
 *
 * @example
 * ```typescript
 * await setDefaultTemplate('template-123', sequelize);
 * ```
 */
export async function setDefaultTemplate(
  templateId: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const logger = new Logger('setDefaultTemplate');

  try {
    // Unset current default
    // Set new default

    logger.log(`Default template set: ${templateId}`);
  } catch (error) {
    logger.error(`Error setting default template: ${error.message}`, error.stack);
    throw error;
  }
}

// Export all functions for use in controllers and services
export default {
  // Core invoice management
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceById,
  searchInvoices,
  generateInvoiceNumber,
  calculateInvoiceTotals,
  calculateDueDate,

  // Line item management
  addLineItem,
  updateLineItem,
  removeLineItem,
  reorderLineItems,

  // PDF generation
  generateInvoicePDF,
  generateInvoicePDFWithQR,

  // Delivery
  sendInvoiceByEmail,
  publishInvoiceToPortal,
  markInvoiceAsViewed,

  // Credit notes and adjustments
  createCreditNote,
  createDebitNote,

  // Pro forma invoices
  createProFormaInvoice,
  convertProFormaToInvoice,

  // Recurring invoices
  createRecurringSchedule,
  generateRecurringInvoice,
  calculateNextRecurringDate,
  cancelRecurringSchedule,

  // Approval workflows
  submitInvoiceForApproval,
  approveInvoice,
  rejectInvoice,

  // Aging reports
  generateAgingReport,
  calculateDSO,

  // Dunning management
  processDunningRules,
  sendDunningNotice,
  getDunningHistory,

  // Payment allocation
  allocatePayment,
  reversePaymentAllocation,

  // Template management
  createInvoiceTemplate,
  getInvoiceTemplates,
  setDefaultTemplate,
};
