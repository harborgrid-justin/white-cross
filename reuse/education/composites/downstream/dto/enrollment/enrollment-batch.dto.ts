/**
 * Enrollment Batch DTOs for enrollment management
 * Handles batch processing of student enrollments
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
  IsUUID,
  IsISO8601,
} from 'class-validator';

export enum EnrollmentBatchStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  PARTIAL_FAILURE = 'partial_failure',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum EnrollmentStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  ENROLLED = 'enrolled',
  DROPPED = 'dropped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class EnrollmentBatchRequestDto {
  @ApiProperty({
    description: 'Batch identifier',
    example: 'BATCH-202411-001',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  batchId: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    description: 'List of student enrollments to process',
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentEnrollmentDataDto)
  enrollments: StudentEnrollmentDataDto[];

  @ApiPropertyOptional({
    description: 'Processing priority (1-10)',
    example: 5,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  priority?: number;

  @ApiPropertyOptional({
    description: 'Send notifications to students',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  notifyStudents?: boolean;
}

export class StudentEnrollmentDataDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Student first name',
    example: 'John',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Student last name',
    example: 'Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Student email',
    example: 'john.doe@university.edu',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'List of course IDs to enroll',
    type: [String],
    example: ['CRS-CS101', 'CRS-MATH201'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  courseIds: string[];

  @ApiPropertyOptional({
    description: 'Enrollment notes',
    example: 'Transfer student',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class EnrollmentBatchResponseDto {
  @ApiProperty({
    description: 'Batch processing status',
    enum: EnrollmentBatchStatus,
    example: EnrollmentBatchStatus.COMPLETED,
  })
  status: EnrollmentBatchStatus;

  @ApiProperty({
    description: 'Batch identifier',
    example: 'BATCH-202411-001',
  })
  batchId: string;

  @ApiProperty({
    description: 'Total enrollments processed',
    example: 150,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalProcessed: number;

  @ApiProperty({
    description: 'Successfully enrolled students',
    example: 148,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  successful: number;

  @ApiProperty({
    description: 'Failed enrollments',
    example: 2,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  failed: number;

  @ApiPropertyOptional({
    description: 'Error details for failed enrollments',
    type: 'array',
  })
  errors?: Array<{
    studentId: string;
    error: string;
  }>;

  @ApiProperty({
    description: 'Processing start time',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  startedAt: Date;

  @ApiProperty({
    description: 'Processing completion time',
    example: '2025-11-10T12:05:00Z',
  })
  @Type(() => Date)
  completedAt: Date;
}

export class EnrollmentBatchQueryDto {
  @ApiPropertyOptional({
    description: 'Batch status filter',
    enum: EnrollmentBatchStatus,
  })
  @IsOptional()
  @IsEnum(EnrollmentBatchStatus)
  status?: EnrollmentBatchStatus;

  @ApiPropertyOptional({
    description: 'Academic term filter',
    example: 'FALL2025',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class EnrollmentBatchDetailDto {
  @ApiProperty({
    description: 'Batch identifier',
    example: 'BATCH-202411-001',
  })
  batchId: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Batch status',
    enum: EnrollmentBatchStatus,
  })
  status: EnrollmentBatchStatus;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2025-11-10T11:00:00Z',
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Updated timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description: 'Enrollment records in batch',
    type: 'array',
  })
  enrollmentRecords: Array<{
    studentId: string;
    status: EnrollmentStatus;
    coursesEnrolled: number;
  }>;
}
