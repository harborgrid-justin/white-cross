/**
 * Eligibility DTOs for determining financial aid eligibility
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

export enum EligibilityStatus {
  ELIGIBLE = 'eligible',
  INELIGIBLE = 'ineligible',
  CONDITIONALLY_ELIGIBLE = 'conditionally_eligible',
  PENDING_REVIEW = 'pending_review',
  SUSPENDED = 'suspended',
}

export enum EligibilityReason {
  ENROLLMENT_STATUS = 'enrollment_status',
  SATISFACTORY_ACADEMIC_PROGRESS = 'satisfactory_academic_progress',
  CITIZENSHIP = 'citizenship',
  FINANCIAL_AID_HISTORY = 'financial_aid_history',
  LOAN_DEFAULT = 'loan_default',
  ACADEMIC_STANDING = 'academic_standing',
  DEGREE_SEEKING = 'degree_seeking',
  CRIMINAL_RECORD = 'criminal_record',
}

export enum CitizenshipStatus {
  US_CITIZEN = 'us_citizen',
  PERMANENT_RESIDENT = 'permanent_resident',
  ELIGIBLE_NON_CITIZEN = 'eligible_non_citizen',
  NON_CITIZEN = 'non_citizen',
  UNKNOWN = 'unknown',
}

export class EligibilityCheckRequestDto {
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

  @ApiPropertyOptional({
    description: 'Aid year',
    example: '2025-2026',
  })
  @IsOptional()
  @IsString()
  aidYear?: string;

  @ApiPropertyOptional({
    description: 'Check all eligibility criteria',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  thoroughCheck?: boolean;
}

export class EligibilityResponseDto {
  @ApiProperty({
    description: 'Eligibility check identifier',
    example: 'ELIG-2024001',
  })
  eligibilityId: string;

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
    description: 'Overall eligibility status',
    enum: EligibilityStatus,
  })
  status: EligibilityStatus;

  @ApiProperty({
    description: 'Is eligible for aid',
    example: true,
  })
  isEligible: boolean;

  @ApiProperty({
    description: 'Eligibility reason',
    enum: EligibilityReason,
  })
  primaryReason: EligibilityReason;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiPropertyOptional({
    description: 'Aid year',
    example: '2025-2026',
  })
  @IsOptional()
  aidYear?: string;

  @ApiProperty({
    description: 'Eligibility criteria results',
    type: 'object',
  })
  criteria: {
    enrollmentStatus: CriterionResultDto;
    satisfactoryProgress: CriterionResultDto;
    citizenship: CriterionResultDto;
    academicStanding: CriterionResultDto;
    degreeStatus: CriterionResultDto;
    financialAidHistory: CriterionResultDto;
  };

  @ApiPropertyOptional({
    description: 'Conditions that must be met',
    type: [String],
  })
  @IsOptional()
  conditions?: string[];

  @ApiProperty({
    description: 'Last checked date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  checkedDate: Date;

  @ApiPropertyOptional({
    description: 'Eligibility expires at',
    example: '2025-12-10T12:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date;
}

export class CriterionResultDto {
  @ApiProperty({
    description: 'Criterion name',
    example: 'Satisfactory Academic Progress',
  })
  name: string;

  @ApiProperty({
    description: 'Criterion met',
    example: true,
  })
  met: boolean;

  @ApiProperty({
    description: 'Criterion description',
    example: 'Student is maintaining 2.0 GPA',
  })
  description: string;

  @ApiPropertyOptional({
    description: 'Detailed results',
    type: 'object',
  })
  @IsOptional()
  details?: any;
}

export class EnrollmentStatusCheckDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Is enrolled',
    example: true,
  })
  isEnrolled: boolean;

  @ApiProperty({
    description: 'Enrollment status',
    example: 'Full-time',
    enum: ['Full-time', 'Half-time', 'Less than half-time'],
  })
  enrollmentStatus: string;

  @ApiProperty({
    description: 'Enrolled credits',
    example: 15,
    minimum: 0,
  })
  enrolledCredits: number;

  @ApiProperty({
    description: 'Minimum credits required',
    example: 12,
    minimum: 0,
  })
  minimumCreditsRequired: number;

  @ApiProperty({
    description: 'Meets enrollment eligibility',
    example: true,
  })
  meetsEligibility: boolean;
}

export class SatisfactoryProgressCheckDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Current GPA',
    example: 3.5,
    minimum: 0,
    maximum: 4,
  })
  currentGPA: number;

  @ApiProperty({
    description: 'Minimum required GPA',
    example: 2.0,
    minimum: 0,
    maximum: 4,
  })
  minimumGPA: number;

  @ApiProperty({
    description: 'GPA meets requirement',
    example: true,
  })
  gpaOk: boolean;

  @ApiProperty({
    description: 'Completion rate percentage',
    example: 85.5,
    minimum: 0,
    maximum: 100,
  })
  completionRate: number;

  @ApiProperty({
    description: 'Minimum completion rate required',
    example: 67,
    minimum: 0,
    maximum: 100,
  })
  minimumCompletionRate: number;

  @ApiProperty({
    description: 'Completion rate meets requirement',
    example: true,
  })
  completionRateOk: boolean;

  @ApiProperty({
    description: 'Meets satisfactory progress',
    example: true,
  })
  meetsSatisfactoryProgress: boolean;

  @ApiPropertyOptional({
    description: 'Last warning date',
    example: '2024-11-10T12:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  lastWarningDate?: Date;
}

export class CitizenshipCheckDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Citizenship status',
    enum: CitizenshipStatus,
  })
  citizenshipStatus: CitizenshipStatus;

  @ApiProperty({
    description: 'Is eligible based on citizenship',
    example: true,
  })
  isEligible: boolean;

  @ApiPropertyOptional({
    description: 'Citizenship verification date',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  verificationDate?: Date;

  @ApiPropertyOptional({
    description: 'Social security number verification',
    example: true,
  })
  @IsOptional()
  ssnVerified?: boolean;
}

export class BulkEligibilityCheckDto {
  @ApiProperty({
    description: 'Student identifiers',
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

  @ApiPropertyOptional({
    description: 'Process in parallel',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  parallel?: boolean;
}

export class BulkEligibilityResultDto {
  @ApiProperty({
    description: 'Total checked',
    example: 100,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Eligible students',
    example: 95,
    minimum: 0,
  })
  eligible: number;

  @ApiProperty({
    description: 'Ineligible students',
    example: 3,
    minimum: 0,
  })
  ineligible: number;

  @ApiProperty({
    description: 'Pending review',
    example: 2,
    minimum: 0,
  })
  pendingReview: number;

  @ApiPropertyOptional({
    description: 'Detailed results per student',
    type: 'array',
  })
  details?: Array<{
    studentId: string;
    status: EligibilityStatus;
    reason: EligibilityReason;
  }>;

  @ApiProperty({
    description: 'Processing timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  processedAt: Date;
}

export class EligibilityQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Eligibility status filter',
    enum: EligibilityStatus,
  })
  @IsOptional()
  @IsEnum(EligibilityStatus)
  status?: EligibilityStatus;

  @ApiPropertyOptional({
    description: 'Eligibility reason filter',
    enum: EligibilityReason,
  })
  @IsOptional()
  @IsEnum(EligibilityReason)
  reason?: EligibilityReason;

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
