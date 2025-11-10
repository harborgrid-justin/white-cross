/**
 * Disbursement DTOs for managing financial aid disbursements
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';

export enum DisbursementStatus {
  SCHEDULED = 'scheduled',
  PENDING = 'pending',
  PROCESSED = 'processed',
  DISBURSED = 'disbursed',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

export enum DisbursementMethod {
  DIRECT_DEPOSIT = 'direct_deposit',
  CHECK = 'check',
  STUDENT_ACCOUNT = 'student_account',
  REFUND = 'refund',
}

export enum DisbursementPeriod {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
}

export class DisbursementScheduleDto {
  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Disbursement period',
    enum: DisbursementPeriod,
  })
  period: DisbursementPeriod;

  @ApiProperty({
    description: 'Scheduled disbursement date',
    example: '2025-08-15T00:00:00Z',
  })
  @Type(() => Date)
  scheduledDate: Date;

  @ApiPropertyOptional({
    description: 'Actual disbursement date',
    example: '2025-08-15T14:30:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  actualDate?: Date;

  @ApiProperty({
    description: 'Disbursement status',
    enum: DisbursementStatus,
  })
  status: DisbursementStatus;

  @ApiPropertyOptional({
    description: 'Status notes',
    maxLength: 500,
  })
  @IsOptional()
  notes?: string;
}

export class DisbursementRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Award identifier',
    example: 'AWD-2024001',
  })
  @IsString()
  @IsNotEmpty()
  awardId: string;

  @ApiProperty({
    description: 'Disbursement amount',
    example: 2500.00,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Disbursement method',
    enum: DisbursementMethod,
  })
  @IsEnum(DisbursementMethod)
  method: DisbursementMethod;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({
    description: 'Requested disbursement date',
    example: '2025-08-15T00:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  requestedDate?: Date;
}

export class DisbursementResponseDto {
  @ApiProperty({
    description: 'Disbursement identifier',
    example: 'DISB-2024001',
  })
  disbursementId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'Award identifier',
    example: 'AWD-2024001',
  })
  awardId: string;

  @ApiProperty({
    description: 'Award name',
    example: 'Merit Scholarship',
  })
  awardName: string;

  @ApiProperty({
    description: 'Disbursement amount',
    example: 2500.00,
    minimum: 0,
  })
  amount: number;

  @ApiProperty({
    description: 'Disbursement method',
    enum: DisbursementMethod,
  })
  method: DisbursementMethod;

  @ApiProperty({
    description: 'Disbursement status',
    enum: DisbursementStatus,
  })
  status: DisbursementStatus;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Created date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  createdDate: Date;

  @ApiPropertyOptional({
    description: 'Scheduled disbursement date',
    example: '2025-08-15T00:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  scheduledDate?: Date;

  @ApiPropertyOptional({
    description: 'Actual disbursement date',
    example: '2025-08-15T14:30:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  disbursedDate?: Date;

  @ApiPropertyOptional({
    description: 'Reference number',
    example: 'REF-123456',
  })
  @IsOptional()
  referenceNumber?: string;
}

export class BulkDisbursementRequestDto {
  @ApiProperty({
    description: 'Disbursement requests',
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DisbursementRequestDto)
  disbursements: DisbursementRequestDto[];

  @ApiPropertyOptional({
    description: 'Process in parallel',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  parallel?: boolean;

  @ApiPropertyOptional({
    description: 'Batch processing notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkDisbursementResultDto {
  @ApiProperty({
    description: 'Batch identifier',
    example: 'BATCH-2024001',
  })
  batchId: string;

  @ApiProperty({
    description: 'Total disbursements',
    example: 100,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Successfully processed',
    example: 98,
    minimum: 0,
  })
  successful: number;

  @ApiProperty({
    description: 'Failed disbursements',
    example: 2,
    minimum: 0,
  })
  failed: number;

  @ApiProperty({
    description: 'Total amount disbursed',
    example: 245000.00,
    minimum: 0,
  })
  totalAmount: number;

  @ApiPropertyOptional({
    description: 'Errors encountered',
    type: 'array',
  })
  errors?: Array<{
    studentId: string;
    awardId: string;
    error: string;
  }>;

  @ApiProperty({
    description: 'Processing timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  processedAt: Date;
}

export class DisbursementScheduleListDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'Disbursement schedules',
    type: 'array',
  })
  disbursementSchedules: DisbursementScheduleDto[];

  @ApiProperty({
    description: 'Next scheduled disbursement',
    type: 'object',
  })
  nextDisbursement: {
    amount: number;
    scheduledDate: Date;
    method: DisbursementMethod;
  };
}

export class DisbursementQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Disbursement status filter',
    enum: DisbursementStatus,
  })
  @IsOptional()
  @IsEnum(DisbursementStatus)
  status?: DisbursementStatus;

  @ApiPropertyOptional({
    description: 'Academic term filter',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description: 'Disbursement method filter',
    enum: DisbursementMethod,
  })
  @IsOptional()
  @IsEnum(DisbursementMethod)
  method?: DisbursementMethod;

  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class DisbursementHistoryDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Disbursement history records',
    type: 'array',
  })
  history: Array<{
    disbursementId: string;
    awardName: string;
    amount: number;
    method: DisbursementMethod;
    status: DisbursementStatus;
    disbursedDate: Date;
  }>;

  @ApiProperty({
    description: 'Total amount disbursed',
    example: 125000.00,
    minimum: 0,
  })
  totalDisbursed: number;

  @ApiProperty({
    description: 'Last disbursement date',
    example: '2025-08-15T14:30:00Z',
  })
  @Type(() => Date)
  lastDisbursementDate: Date;
}

export class DisbursementStatisticsDto {
  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Total students with disbursements',
    example: 5000,
    minimum: 0,
  })
  totalStudents: number;

  @ApiProperty({
    description: 'Total amount disbursed',
    example: 175000000.00,
    minimum: 0,
  })
  totalAmountDisbursed: number;

  @ApiProperty({
    description: 'Average disbursement per student',
    example: 35000.00,
    minimum: 0,
  })
  averagePerStudent: number;

  @ApiProperty({
    description: 'Disbursements by status',
    type: 'object',
  })
  byStatus: Record<DisbursementStatus, number>;

  @ApiProperty({
    description: 'Disbursements by method',
    type: 'object',
  })
  byMethod: Record<DisbursementMethod, number>;
}
