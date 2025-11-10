/**
 * Drop/Add DTOs for managing course drops and adds
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
  IsEmail,
} from 'class-validator';

export enum DropAddAction {
  ADD = 'add',
  DROP = 'drop',
  SWAP = 'swap',
}

export enum DropAddStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum DropReason {
  SCHEDULE_CONFLICT = 'schedule_conflict',
  FAILED_PREREQUISITE = 'failed_prerequisite',
  WORKLOAD = 'workload',
  FINANCIAL = 'financial',
  MEDICAL = 'medical',
  WITHDRAWAL = 'withdrawal',
  OTHER = 'other',
}

export enum RefundPolicy {
  FULL_REFUND = 'full_refund',
  PARTIAL_REFUND = 'partial_refund',
  NO_REFUND = 'no_refund',
}

export class AddCourseRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Section number',
    example: '01',
  })
  @IsString()
  @IsNotEmpty()
  sectionNumber: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class DropCourseRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Enrollment identifier',
    example: 'ENR-2024001',
  })
  @IsString()
  @IsNotEmpty()
  enrollmentId: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Drop reason',
    enum: DropReason,
  })
  @IsEnum(DropReason)
  dropReason: DropReason;

  @ApiPropertyOptional({
    description: 'Detailed explanation',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional({
    description: 'Withdraw completely from course',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  withdraw?: boolean;
}

export class SwapCoursesRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Enrollment ID to drop',
    example: 'ENR-2024001',
  })
  @IsString()
  @IsNotEmpty()
  dropEnrollmentId: string;

  @ApiProperty({
    description: 'Course ID to drop',
    example: 'CRS-CS101',
  })
  @IsString()
  @IsNotEmpty()
  dropCourseId: string;

  @ApiProperty({
    description: 'Course ID to add',
    example: 'CRS-CS102',
  })
  @IsString()
  @IsNotEmpty()
  addCourseId: string;

  @ApiProperty({
    description: 'Section number for new course',
    example: '01',
  })
  @IsString()
  @IsNotEmpty()
  addSectionNumber: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({
    description: 'Reason for swap',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class DropAddResponseDto {
  @ApiProperty({
    description: 'Drop/Add request identifier',
    example: 'DROPD-2024001',
  })
  requestId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Action type',
    enum: DropAddAction,
  })
  action: DropAddAction;

  @ApiProperty({
    description: 'Request status',
    enum: DropAddStatus,
  })
  status: DropAddStatus;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  courseId: string;

  @ApiProperty({
    description: 'Course title',
    example: 'Introduction to Computer Science',
  })
  courseTitle: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiPropertyOptional({
    description: 'Course credits',
    example: 3,
    minimum: 0,
  })
  credits?: number;

  @ApiProperty({
    description: 'Request created date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  createdDate: Date;

  @ApiPropertyOptional({
    description: 'Request processed date',
    example: '2025-11-10T13:30:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  processedDate?: Date;

  @ApiPropertyOptional({
    description: 'Refund applicable',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  refundApplicable?: boolean;

  @ApiPropertyOptional({
    description: 'Refund policy applied',
    enum: RefundPolicy,
  })
  @IsOptional()
  refundPolicy?: RefundPolicy;

  @ApiPropertyOptional({
    description: 'Refund amount',
    example: 450.00,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  refundAmount?: number;
}

export class BulkDropAddDto {
  @ApiProperty({
    description: 'Drop/add requests',
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DropAddItemDto)
  items: DropAddItemDto[];

  @ApiPropertyOptional({
    description: 'Process requests in parallel',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  parallel?: boolean;
}

export class DropAddItemDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Action type',
    enum: DropAddAction,
  })
  @IsEnum(DropAddAction)
  action: DropAddAction;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({
    description: 'Section number',
    example: '01',
  })
  @IsOptional()
  @IsString()
  sectionNumber?: string;

  @ApiPropertyOptional({
    description: 'Reason for action',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class DropAddAuditLogDto {
  @ApiProperty({
    description: 'Audit log identifier',
    example: 'AUDIT-2024001',
  })
  auditId: string;

  @ApiProperty({
    description: 'Drop/Add request identifier',
    example: 'DROPD-2024001',
  })
  requestId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Action performed',
    enum: DropAddAction,
  })
  action: DropAddAction;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  courseId: string;

  @ApiProperty({
    description: 'Action status',
    enum: DropAddStatus,
  })
  status: DropAddStatus;

  @ApiPropertyOptional({
    description: 'Processing notes',
    maxLength: 500,
  })
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Action timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  timestamp: Date;

  @ApiPropertyOptional({
    description: 'Processed by staff member',
    example: 'staff@university.edu',
  })
  @IsOptional()
  processedBy?: string;
}

export class DropAddQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Action type filter',
    enum: DropAddAction,
  })
  @IsOptional()
  @IsEnum(DropAddAction)
  action?: DropAddAction;

  @ApiPropertyOptional({
    description: 'Status filter',
    enum: DropAddStatus,
  })
  @IsOptional()
  @IsEnum(DropAddStatus)
  status?: DropAddStatus;

  @ApiPropertyOptional({
    description: 'Academic term filter',
  })
  @IsOptional()
  @IsString()
  term?: string;

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
