/**
 * Enrollment Verification DTOs for verifying student enrollments
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

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
  REQUIRES_REVIEW = 'requires_review',
}

export enum VerificationType {
  ENROLLMENT_STATUS = 'enrollment_status',
  CREDIT_HOURS = 'credit_hours',
  COURSE_PREREQUISITES = 'course_prerequisites',
  DEGREE_PROGRESS = 'degree_progress',
  FINANCIAL_HOLDS = 'financial_holds',
  ACADEMIC_STANDING = 'academic_standing',
}

export class EnrollmentVerificationRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    description: 'Verification type',
    enum: VerificationType,
    type: VerificationType,
  })
  @IsEnum(VerificationType)
  verificationType: VerificationType;

  @ApiPropertyOptional({
    description: 'Require full transcript verification',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  includeTranscript?: boolean;

  @ApiPropertyOptional({
    description: 'Check financial holds',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  checkFinancialHolds?: boolean;
}

export class EnrollmentVerificationResponseDto {
  @ApiProperty({
    description: 'Verification identifier',
    example: 'VER-2024001',
  })
  verificationId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Verification status',
    enum: VerificationStatus,
  })
  status: VerificationStatus;

  @ApiProperty({
    description: 'Is student currently enrolled',
    example: true,
  })
  isEnrolled: boolean;

  @ApiProperty({
    description: 'Academic term verified',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Total enrolled credits',
    example: 15,
    minimum: 0,
  })
  totalCredits: number;

  @ApiProperty({
    description: 'Course count',
    example: 5,
    minimum: 0,
  })
  courseCount: number;

  @ApiProperty({
    description: 'Has active financial holds',
    example: false,
  })
  hasFinancialHolds: boolean;

  @ApiProperty({
    description: 'Verification results',
    type: 'object',
  })
  verificationResults: {
    enrollmentValid: boolean;
    creditsValid: boolean;
    prerequisitesMet: boolean;
    academicStandingGood: boolean;
  };

  @ApiPropertyOptional({
    description: 'Verification warnings or notes',
    type: [String],
  })
  warnings?: string[];

  @ApiProperty({
    description: 'Verification timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  verifiedAt: Date;

  @ApiProperty({
    description: 'Verification expires at',
    example: '2025-12-10T12:00:00Z',
  })
  @Type(() => Date)
  expiresAt: Date;
}

export class BulkEnrollmentVerificationDto {
  @ApiProperty({
    description: 'Student identifiers to verify',
    type: [String],
    example: ['STU-2024001', 'STU-2024002'],
  })
  @IsArray()
  @IsString({ each: true })
  studentIds: string[];

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    description: 'Verification type',
    enum: VerificationType,
  })
  @IsEnum(VerificationType)
  verificationType: VerificationType;

  @ApiPropertyOptional({
    description: 'Parallel processing enabled',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  parallelProcess?: boolean;
}

export class BulkVerificationResultDto {
  @ApiProperty({
    description: 'Total students verified',
    example: 100,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Successfully verified',
    example: 98,
    minimum: 0,
  })
  successful: number;

  @ApiProperty({
    description: 'Verification failures',
    example: 2,
    minimum: 0,
  })
  failed: number;

  @ApiPropertyOptional({
    description: 'Failed verifications with reasons',
    type: 'array',
  })
  failures?: Array<{
    studentId: string;
    reason: string;
  }>;

  @ApiProperty({
    description: 'Processing start time',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  startedAt: Date;

  @ApiProperty({
    description: 'Processing completion time',
    example: '2025-11-10T12:10:00Z',
  })
  @Type(() => Date)
  completedAt: Date;
}

export class EnrollmentVerificationDetailsDto {
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
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Enrolled courses with details',
    type: 'array',
  })
  enrolledCourses: Array<{
    courseId: string;
    courseTitle: string;
    credits: number;
    status: string;
    meetsPrerequites: boolean;
  }>;

  @ApiProperty({
    description: 'Degree progress',
    type: 'object',
  })
  degreeProgress: {
    totalCreditsRequired: number;
    creditsCompleted: number;
    creditsInProgress: number;
    percentComplete: number;
  };

  @ApiProperty({
    description: 'Academic standing status',
    example: 'GOOD',
    enum: ['GOOD', 'PROBATION', 'SUSPENSION'],
  })
  academicStanding: string;
}

export class VerificationQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Verification status filter',
    enum: VerificationStatus,
  })
  @IsOptional()
  @IsEnum(VerificationStatus)
  status?: VerificationStatus;

  @ApiPropertyOptional({
    description: 'Verification type filter',
    enum: VerificationType,
  })
  @IsOptional()
  @IsEnum(VerificationType)
  verificationType?: VerificationType;

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
