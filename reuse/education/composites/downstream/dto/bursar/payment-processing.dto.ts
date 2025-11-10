/**
 * Bursar Payment Processing DTOs
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
  Min,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  ACH = 'ach',
  CHECK = 'check',
  CASH = 'cash',
  WIRE_TRANSFER = 'wire_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum TransactionType {
  TUITION = 'tuition',
  FEES = 'fees',
  HOUSING = 'housing',
  MEAL_PLAN = 'meal_plan',
  PARKING = 'parking',
  LIBRARY_FINE = 'library_fine',
  OTHER = 'other',
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Payment amount', example: 2500.00, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiPropertyOptional({ description: 'Payment reference number', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Payment notes', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ description: 'Payment details (encrypted)', type: 'object' })
  @IsOptional()
  paymentDetails?: {
    cardLast4?: string;
    accountLast4?: string;
    checkNumber?: string;
  };
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment identifier', example: 'PAY-1234567890' })
  paymentId: string;

  @ApiProperty({ description: 'Transaction ID', example: 'TXN-9876543210' })
  transactionId: string;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ description: 'Amount processed', example: 2500.00 })
  amount: number;

  @ApiProperty({ description: 'Payment date' })
  @Type(() => Date)
  @IsDate()
  paymentDate: Date;

  @ApiProperty({ description: 'Confirmation number', example: 'CONF-ABC123XYZ' })
  confirmationNumber: string;

  @ApiPropertyOptional({ description: 'Receipt URL' })
  receiptUrl?: string;
}

export class BillingStatementDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  studentId: string;

  @ApiProperty({ description: 'Statement period', example: 'Fall 2025' })
  period: string;

  @ApiProperty({ description: 'Total charges', example: 15000.00 })
  totalCharges: number;

  @ApiProperty({ description: 'Total payments', example: 12500.00 })
  totalPayments: number;

  @ApiProperty({ description: 'Current balance', example: 2500.00 })
  currentBalance: number;

  @ApiProperty({ description: 'Due date' })
  dueDate: Date;

  @ApiProperty({ description: 'Line items', type: 'array' })
  lineItems: Array<{
    description: string;
    amount: number;
    date: Date;
    type: TransactionType;
  }>;
}

export class SetupPaymentPlanDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Total amount', example: 10000.00, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  totalAmount: number;

  @ApiProperty({ description: 'Down payment', example: 2000.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  downPayment: number;

  @ApiProperty({ description: 'Number of installments', example: 4, minimum: 2, maximum: 12 })
  @IsNumber()
  @Min(2)
  installments: number;

  @ApiProperty({ description: 'First payment date' })
  @Type(() => Date)
  @IsDate()
  firstPaymentDate: Date;
}

export class PaymentPlanResponseDto {
  @ApiProperty({ description: 'Payment plan identifier', example: 'PLAN-789' })
  planId: string;

  @ApiProperty({ description: 'Total amount', example: 10000.00 })
  totalAmount: number;

  @ApiProperty({ description: 'Down payment', example: 2000.00 })
  downPayment: number;

  @ApiProperty({ description: 'Installment amount', example: 2000.00 })
  installmentAmount: number;

  @ApiProperty({ description: 'Number of installments', example: 4 })
  installments: number;

  @ApiProperty({ description: 'Payment schedule', type: 'array' })
  schedule: Array<{
    installmentNumber: number;
    dueDate: Date;
    amount: number;
    status: PaymentStatus;
  }>;
}

export class RefundRequestDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Refund amount', example: 1500.00, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Refund reason', minLength: 10, maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  reason: string;

  @ApiProperty({ description: 'Original transaction ID', example: 'TXN-9876543210' })
  @IsString()
  @IsNotEmpty()
  originalTransactionId: string;
}

export class RefundResponseDto {
  @ApiProperty({ description: 'Refund identifier', example: 'REF-456789' })
  refundId: string;

  @ApiProperty({ description: 'Refund status', enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ description: 'Amount refunded', example: 1500.00 })
  amount: number;

  @ApiProperty({ description: 'Refund date' })
  refundDate: Date;

  @ApiPropertyOptional({ description: 'Expected processing time', example: '5-7 business days' })
  processingTime?: string;
}

export class FinancialSummaryDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  studentId: string;

  @ApiProperty({ description: 'Total charges (all time)', example: 45000.00 })
  totalCharges: number;

  @ApiProperty({ description: 'Total payments (all time)', example: 42000.00 })
  totalPayments: number;

  @ApiProperty({ description: 'Current balance', example: 3000.00 })
  currentBalance: number;

  @ApiProperty({ description: 'Financial aid awarded', example: 15000.00 })
  financialAidAwarded: number;

  @ApiProperty({ description: 'Financial aid disbursed', example: 12000.00 })
  financialAidDisbursed: number;

  @ApiProperty({ description: 'Has payment plan', example: true })
  hasPaymentPlan: boolean;

  @ApiProperty({ description: 'Has holds', example: false })
  hasHolds: boolean;
}
