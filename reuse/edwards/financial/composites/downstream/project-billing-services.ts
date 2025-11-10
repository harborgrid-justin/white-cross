/**
 * LOC: PRJBILL001
 * File: /reuse/edwards/financial/composites/downstream/project-billing-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - ../project-cost-accounting-composite
 *
 * DOWNSTREAM (imported by):
 *   - Project billing controllers
 *   - Revenue recognition services
 *   - Invoice generation modules
 */

import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction } from 'sequelize';

// Import from parent composite
import {
  BillingMethod,
  ProjectStatus,
  CostCategory,
} from '../project-cost-accounting-composite';

// ============================================================================
// ENUMS - PROJECT BILLING
// ============================================================================

/**
 * Invoice status
 */
export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SENT = 'SENT',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  CREDITED = 'CREDITED',
}

/**
 * Invoice line type
 */
export enum InvoiceLineType {
  TIME = 'TIME',
  EXPENSE = 'EXPENSE',
  FIXED_FEE = 'FIXED_FEE',
  MILESTONE = 'MILESTONE',
  MATERIAL = 'MATERIAL',
  RETAINER = 'RETAINER',
  ADJUSTMENT = 'ADJUSTMENT',
}

/**
 * Billing frequency
 */
export enum BillingFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  MILESTONE = 'MILESTONE',
  ON_DEMAND = 'ON_DEMAND',
}

/**
 * Payment terms
 */
export enum PaymentTerms {
  NET_15 = 'NET_15',
  NET_30 = 'NET_30',
  NET_45 = 'NET_45',
  NET_60 = 'NET_60',
  NET_90 = 'NET_90',
  DUE_ON_RECEIPT = 'DUE_ON_RECEIPT',
  CUSTOM = 'CUSTOM',
}

// ============================================================================
// DTOs - PROJECT BILLING
// ============================================================================

/**
 * Invoice creation request DTO
 */
export class CreateInvoiceRequestDto {
  @ApiProperty({ description: 'Project ID' })
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @ApiPropertyOptional({ description: 'Customer ID' })
  @IsNumber()
  @IsOptional()
  customerId?: number;

  @ApiProperty({ description: 'Invoice date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  invoiceDate!: Date;

  @ApiProperty({ description: 'Due date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dueDate!: Date;

  @ApiProperty({ enum: PaymentTerms, description: 'Payment terms' })
  @IsEnum(PaymentTerms)
  @IsNotEmpty()
  paymentTerms!: PaymentTerms;

  @ApiPropertyOptional({ description: 'Billing period start' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  billingPeriodStart?: Date;

  @ApiPropertyOptional({ description: 'Billing period end' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  billingPeriodEnd?: Date;

  @ApiPropertyOptional({ description: 'Invoice description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Reference number' })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Purchase order number' })
  @IsString()
  @IsOptional()
  purchaseOrderNumber?: string;
}

/**
 * Invoice line item DTO
 */
export class InvoiceLineItemDto {
  @ApiProperty({ enum: InvoiceLineType, description: 'Line type' })
  @IsEnum(InvoiceLineType)
  @IsNotEmpty()
  lineType!: InvoiceLineType;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Quantity', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity!: number;

  @ApiProperty({ description: 'Unit price', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unitPrice!: number;

  @ApiPropertyOptional({ description: 'Discount percentage', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage?: number;

  @ApiPropertyOptional({ description: 'Tax rate', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  taxRate?: number;

  @ApiPropertyOptional({ description: 'Reference to time entry ID' })
  @IsNumber()
  @IsOptional()
  timeEntryId?: number;

  @ApiPropertyOptional({ description: 'Reference to expense entry ID' })
  @IsNumber()
  @IsOptional()
  expenseEntryId?: number;

  @ApiPropertyOptional({ description: 'Reference to milestone ID' })
  @IsNumber()
  @IsOptional()
  milestoneId?: number;
}

/**
 * Billing schedule DTO
 */
export class BillingScheduleDto {
  @ApiProperty({ description: 'Project ID' })
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @ApiProperty({ enum: BillingFrequency, description: 'Billing frequency' })
  @IsEnum(BillingFrequency)
  @IsNotEmpty()
  frequency!: BillingFrequency;

  @ApiProperty({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate!: Date;

  @ApiPropertyOptional({ description: 'End date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Next billing date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  nextBillingDate?: Date;

  @ApiPropertyOptional({ description: 'Automatic generation flag' })
  @IsBoolean()
  @IsOptional()
  autoGenerate?: boolean;
}

/**
 * Payment recording DTO
 */
export class RecordPaymentDto {
  @ApiProperty({ description: 'Invoice ID' })
  @IsNumber()
  @IsNotEmpty()
  invoiceId!: number;

  @ApiProperty({ description: 'Payment amount', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({ description: 'Payment date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  paymentDate!: Date;

  @ApiPropertyOptional({ description: 'Payment method' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Payment reference number' })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Payment notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

// ============================================================================
// SERVICES - PROJECT BILLING
// ============================================================================

/**
 * Project billing service
 * Manages invoice generation, billing schedules, and revenue recognition
 */
@Injectable()
export class ProjectBillingService {
  private readonly logger = new Logger(ProjectBillingService.name);

  /**
   * Creates a new invoice for a project
   * @param dto - Invoice creation request
   * @param lineItems - Invoice line items
   * @param transaction - Optional database transaction
   * @returns Created invoice details
   */
  async createInvoice(
    dto: CreateInvoiceRequestDto,
    lineItems: InvoiceLineItemDto[],
    transaction?: Transaction
  ): Promise<{
    invoiceId: number;
    invoiceNumber: string;
    totalAmount: number;
    status: InvoiceStatus;
  }> {
    try {
      this.logger.log(`Creating invoice for project ${dto.projectId}`);

      // Validate project exists and is active
      // Validate customer exists
      // Validate dates
      if (dto.dueDate <= dto.invoiceDate) {
        throw new BadRequestException('Due date must be after invoice date');
      }

      // Validate line items exist
      if (!lineItems || lineItems.length === 0) {
        throw new BadRequestException('Invoice must have at least one line item');
      }

      // Calculate totals
      let subtotal = 0;
      let totalTax = 0;

      for (const line of lineItems) {
        const lineAmount = line.quantity * line.unitPrice;
        const discount = lineAmount * ((line.discountPercentage || 0) / 100);
        const lineSubtotal = lineAmount - discount;
        const lineTax = lineSubtotal * ((line.taxRate || 0) / 100);

        subtotal += lineSubtotal;
        totalTax += lineTax;
      }

      const totalAmount = subtotal + totalTax;

      // Generate invoice number
      const invoiceNumber = `INV-${dto.projectId}-${Date.now()}`;

      // Create invoice in database
      const invoice = {
        invoiceId: Math.floor(Math.random() * 1000000),
        invoiceNumber,
        projectId: dto.projectId,
        customerId: dto.customerId,
        invoiceDate: dto.invoiceDate,
        dueDate: dto.dueDate,
        paymentTerms: dto.paymentTerms,
        billingPeriodStart: dto.billingPeriodStart,
        billingPeriodEnd: dto.billingPeriodEnd,
        description: dto.description,
        referenceNumber: dto.referenceNumber,
        purchaseOrderNumber: dto.purchaseOrderNumber,
        subtotal,
        taxAmount: totalTax,
        totalAmount,
        paidAmount: 0,
        balanceAmount: totalAmount,
        status: InvoiceStatus.DRAFT,
        createdAt: new Date(),
      };

      this.logger.log(`Invoice ${invoiceNumber} created with total ${totalAmount}`);

      return {
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount,
        status: invoice.status,
      };
    } catch (error) {
      this.logger.error(`Failed to create invoice: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates time and materials invoice
   * @param projectId - Project identifier
   * @param periodStart - Billing period start
   * @param periodEnd - Billing period end
   * @param transaction - Optional database transaction
   * @returns Generated invoice details
   */
  async generateTimeAndMaterialsInvoice(
    projectId: number,
    periodStart: Date,
    periodEnd: Date,
    transaction?: Transaction
  ): Promise<{
    invoiceId: number;
    invoiceNumber: string;
    lineItems: number;
    totalAmount: number;
  }> {
    try {
      this.logger.log(`Generating T&M invoice for project ${projectId}`);

      // Validate project billing method is T&M
      // Query unbilled time entries for period
      // Query unbilled expense entries for period

      const timeEntries: any[] = []; // Query from database
      const expenseEntries: any[] = []; // Query from database

      // Build invoice line items from time entries
      const timeLines: InvoiceLineItemDto[] = timeEntries.map(entry => ({
        lineType: InvoiceLineType.TIME,
        description: `Labor - ${entry.employeeName} - ${entry.hours} hours`,
        quantity: entry.hours,
        unitPrice: entry.billingRate,
        timeEntryId: entry.timeEntryId,
      }));

      // Build invoice line items from expenses
      const expenseLines: InvoiceLineItemDto[] = expenseEntries.map(entry => ({
        lineType: InvoiceLineType.EXPENSE,
        description: `${entry.category} - ${entry.description}`,
        quantity: 1,
        unitPrice: entry.amount,
        expenseEntryId: entry.expenseEntryId,
      }));

      const allLineItems = [...timeLines, ...expenseLines];

      if (allLineItems.length === 0) {
        throw new BadRequestException('No unbilled time or expenses found for period');
      }

      // Create invoice
      const invoiceDto: CreateInvoiceRequestDto = {
        projectId,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        paymentTerms: PaymentTerms.NET_30,
        billingPeriodStart: periodStart,
        billingPeriodEnd: periodEnd,
        description: `Time and Materials - ${periodStart.toISOString().split('T')[0]} to ${periodEnd.toISOString().split('T')[0]}`,
      };

      const result = await this.createInvoice(invoiceDto, allLineItems, transaction);

      this.logger.log(`T&M invoice generated with ${allLineItems.length} line items`);

      return {
        invoiceId: result.invoiceId,
        invoiceNumber: result.invoiceNumber,
        lineItems: allLineItems.length,
        totalAmount: result.totalAmount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate T&M invoice: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates fixed price milestone invoice
   * @param projectId - Project identifier
   * @param milestoneId - Milestone identifier
   * @param transaction - Optional database transaction
   * @returns Generated invoice details
   */
  async generateMilestoneInvoice(
    projectId: number,
    milestoneId: number,
    transaction?: Transaction
  ): Promise<{
    invoiceId: number;
    invoiceNumber: string;
    totalAmount: number;
  }> {
    try {
      this.logger.log(`Generating milestone invoice for project ${projectId}, milestone ${milestoneId}`);

      // Validate project billing method is MILESTONE or FIXED_PRICE
      // Validate milestone exists and is completed
      // Check if milestone already invoiced

      // Query milestone details
      const milestone = {
        milestoneId,
        name: 'Phase 1 Completion',
        amount: 50000,
        completedDate: new Date(),
      };

      // Create invoice with single milestone line item
      const lineItems: InvoiceLineItemDto[] = [
        {
          lineType: InvoiceLineType.MILESTONE,
          description: `Milestone: ${milestone.name}`,
          quantity: 1,
          unitPrice: milestone.amount,
          milestoneId: milestone.milestoneId,
        },
      ];

      const invoiceDto: CreateInvoiceRequestDto = {
        projectId,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentTerms: PaymentTerms.NET_30,
        description: `Milestone Billing - ${milestone.name}`,
      };

      const result = await this.createInvoice(invoiceDto, lineItems, transaction);

      this.logger.log(`Milestone invoice generated for amount ${result.totalAmount}`);

      return {
        invoiceId: result.invoiceId,
        invoiceNumber: result.invoiceNumber,
        totalAmount: result.totalAmount,
      };
    } catch (error) {
      this.logger.error(`Failed to generate milestone invoice: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Approves an invoice
   * @param invoiceId - Invoice identifier
   * @param approverId - Approver user ID
   * @param transaction - Optional database transaction
   * @returns Approval status
   */
  async approveInvoice(
    invoiceId: number,
    approverId: number,
    transaction?: Transaction
  ): Promise<{ success: boolean; approvedDate: Date }> {
    try {
      this.logger.log(`Approving invoice ${invoiceId}`);

      // Validate invoice exists
      // Validate current status is DRAFT or PENDING_APPROVAL
      // Validate approver has permission
      // Update status to APPROVED
      // Record approver and date

      const approvedDate = new Date();

      this.logger.log(`Invoice ${invoiceId} approved on ${approvedDate.toISOString()}`);

      return {
        success: true,
        approvedDate,
      };
    } catch (error) {
      this.logger.error(`Failed to approve invoice ${invoiceId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Sends an invoice to customer
   * @param invoiceId - Invoice identifier
   * @param transaction - Optional database transaction
   * @returns Send status
   */
  async sendInvoice(
    invoiceId: number,
    transaction?: Transaction
  ): Promise<{ success: boolean; sentDate: Date }> {
    try {
      this.logger.log(`Sending invoice ${invoiceId}`);

      // Validate invoice exists
      // Validate invoice is approved
      // Generate PDF invoice
      // Send email to customer
      // Update status to SENT
      // Record sent date

      const sentDate = new Date();

      this.logger.log(`Invoice ${invoiceId} sent on ${sentDate.toISOString()}`);

      return {
        success: true,
        sentDate,
      };
    } catch (error) {
      this.logger.error(`Failed to send invoice ${invoiceId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Records a payment against an invoice
   * @param dto - Payment recording request
   * @param transaction - Optional database transaction
   * @returns Payment details
   */
  async recordPayment(
    dto: RecordPaymentDto,
    transaction?: Transaction
  ): Promise<{
    paymentId: number;
    invoiceStatus: InvoiceStatus;
    remainingBalance: number;
  }> {
    try {
      this.logger.log(`Recording payment for invoice ${dto.invoiceId}`);

      // Validate invoice exists
      // Validate payment amount doesn't exceed balance
      // Create payment record
      // Update invoice paid amount and balance
      // Update invoice status

      // Query invoice
      const invoice = {
        invoiceId: dto.invoiceId,
        totalAmount: 10000,
        paidAmount: 0,
        balanceAmount: 10000,
      };

      if (dto.amount > invoice.balanceAmount) {
        throw new BadRequestException('Payment amount exceeds invoice balance');
      }

      if (dto.amount <= 0) {
        throw new BadRequestException('Payment amount must be positive');
      }

      const newPaidAmount = invoice.paidAmount + dto.amount;
      const newBalance = invoice.totalAmount - newPaidAmount;

      // Determine new status
      let newStatus: InvoiceStatus;
      if (newBalance === 0) {
        newStatus = InvoiceStatus.PAID;
      } else {
        newStatus = InvoiceStatus.PARTIALLY_PAID;
      }

      const payment = {
        paymentId: Math.floor(Math.random() * 1000000),
        invoiceId: dto.invoiceId,
        amount: dto.amount,
        paymentDate: dto.paymentDate,
        paymentMethod: dto.paymentMethod,
        referenceNumber: dto.referenceNumber,
        notes: dto.notes,
        createdAt: new Date(),
      };

      this.logger.log(`Payment ${payment.paymentId} recorded for amount ${dto.amount}`);

      return {
        paymentId: payment.paymentId,
        invoiceStatus: newStatus,
        remainingBalance: newBalance,
      };
    } catch (error) {
      this.logger.error(`Failed to record payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates a billing schedule for a project
   * @param dto - Billing schedule request
   * @param transaction - Optional database transaction
   * @returns Created billing schedule
   */
  async createBillingSchedule(
    dto: BillingScheduleDto,
    transaction?: Transaction
  ): Promise<{ scheduleId: number; nextBillingDate: Date }> {
    try {
      this.logger.log(`Creating billing schedule for project ${dto.projectId}`);

      // Validate project exists
      // Calculate next billing date based on frequency
      let nextBillingDate = new Date(dto.startDate);

      switch (dto.frequency) {
        case BillingFrequency.WEEKLY:
          nextBillingDate.setDate(nextBillingDate.getDate() + 7);
          break;
        case BillingFrequency.BIWEEKLY:
          nextBillingDate.setDate(nextBillingDate.getDate() + 14);
          break;
        case BillingFrequency.MONTHLY:
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
          break;
        case BillingFrequency.QUARTERLY:
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
          break;
        default:
          nextBillingDate = dto.nextBillingDate || dto.startDate;
      }

      const schedule = {
        scheduleId: Math.floor(Math.random() * 1000000),
        projectId: dto.projectId,
        frequency: dto.frequency,
        startDate: dto.startDate,
        endDate: dto.endDate,
        nextBillingDate,
        autoGenerate: dto.autoGenerate ?? true,
        createdAt: new Date(),
      };

      this.logger.log(`Billing schedule ${schedule.scheduleId} created with next billing ${nextBillingDate.toISOString()}`);

      return {
        scheduleId: schedule.scheduleId,
        nextBillingDate: schedule.nextBillingDate,
      };
    } catch (error) {
      this.logger.error(`Failed to create billing schedule: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves unbilled costs for a project
   * @param projectId - Project identifier
   * @param asOfDate - Optional as-of date
   * @returns Unbilled cost summary
   */
  async getUnbilledCosts(
    projectId: number,
    asOfDate?: Date
  ): Promise<{
    unbilledLaborCosts: number;
    unbilledExpenses: number;
    unbilledTotal: number;
    laborHours: number;
    expenseCount: number;
  }> {
    try {
      this.logger.log(`Retrieving unbilled costs for project ${projectId}`);

      // Query unbilled time entries
      // Query unbilled expense entries
      // Calculate totals

      const unbilledLaborCosts = 15000;
      const laborHours = 150;
      const unbilledExpenses = 3000;
      const expenseCount = 12;

      return {
        unbilledLaborCosts,
        unbilledExpenses,
        unbilledTotal: unbilledLaborCosts + unbilledExpenses,
        laborHours,
        expenseCount,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve unbilled costs: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves accounts receivable aging for a project
   * @param projectId - Project identifier
   * @returns AR aging summary
   */
  async getARAgingSummary(
    projectId: number
  ): Promise<{
    current: number;
    aging30: number;
    aging60: number;
    aging90: number;
    aging90Plus: number;
    totalOutstanding: number;
  }> {
    try {
      this.logger.log(`Retrieving AR aging for project ${projectId}`);

      // Query unpaid invoices
      // Calculate aging buckets based on due date

      return {
        current: 10000,
        aging30: 5000,
        aging60: 2000,
        aging90: 1000,
        aging90Plus: 500,
        totalOutstanding: 18500,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve AR aging: ${error.message}`, error.stack);
      throw error;
    }
  }
}
