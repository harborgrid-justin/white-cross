/**
 * Registration Validation DTOs for validating registrations
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

export enum ValidationStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  WARNING = 'warning',
  REQUIRES_REVIEW = 'requires_review',
}

export enum ValidationRule {
  PREREQUISITE_CHECK = 'prerequisite_check',
  CREDIT_LIMIT = 'credit_limit',
  MINIMUM_CREDITS = 'minimum_credits',
  SCHEDULE_CONFLICT = 'schedule_conflict',
  DEGREE_AUDIT = 'degree_audit',
  ACADEMIC_STANDING = 'academic_standing',
  FINANCIAL_HOLD = 'financial_hold',
  CLASS_RESTRICTION = 'class_restriction',
}

export class RegistrationValidationRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Course identifiers to validate',
    type: [String],
    example: ['CRS-CS101', 'CRS-MATH201'],
  })
  @IsArray()
  @IsString({ each: true })
  courseIds: string[];

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({
    description: 'Validation rules to apply',
    type: [String],
    enum: ValidationRule,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ValidationRule, { each: true })
  rules?: ValidationRule[];
}

export class RegistrationValidationResponseDto {
  @ApiProperty({
    description: 'Validation identifier',
    example: 'VAL-2024001',
  })
  validationId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Overall validation status',
    enum: ValidationStatus,
  })
  status: ValidationStatus;

  @ApiProperty({
    description: 'Is registration allowed',
    example: true,
  })
  isAllowed: boolean;

  @ApiProperty({
    description: 'Validation results by rule',
    type: 'object',
  })
  results: {
    [key in ValidationRule]?: {
      status: ValidationStatus;
      message: string;
      details?: any;
    };
  };

  @ApiPropertyOptional({
    description: 'Validation errors',
    type: [String],
  })
  errors?: string[];

  @ApiPropertyOptional({
    description: 'Validation warnings',
    type: [String],
  })
  warnings?: string[];

  @ApiProperty({
    description: 'Validation timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  validatedAt: Date;
}

export class PrerequisiteValidationDto {
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
    description: 'Prerequisites met',
    example: true,
  })
  prerequisitesMet: boolean;

  @ApiProperty({
    description: 'Required prerequisites',
    type: 'array',
  })
  requiredPrerequisites: Array<{
    courseId: string;
    courseTitle: string;
    completed: boolean;
    grade: string;
  }>;

  @ApiPropertyOptional({
    description: 'Corequisites required',
    type: 'array',
  })
  corequisites?: Array<{
    courseId: string;
    courseTitle: string;
    enrolled: boolean;
  }>;
}

export class CreditLimitValidationDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Maximum credits allowed',
    example: 18,
    minimum: 0,
  })
  maxCredits: number;

  @ApiProperty({
    description: 'Currently enrolled credits',
    example: 12,
    minimum: 0,
  })
  currentCredits: number;

  @ApiProperty({
    description: 'Proposed additional credits',
    example: 3,
    minimum: 0,
  })
  proposedCredits: number;

  @ApiProperty({
    description: 'Total credits after registration',
    example: 15,
    minimum: 0,
  })
  totalCredits: number;

  @ApiProperty({
    description: 'Within credit limit',
    example: true,
  })
  withinLimit: boolean;

  @ApiPropertyOptional({
    description: 'Requires special approval',
    example: false,
  })
  @IsOptional()
  requiresApproval?: boolean;
}

export class ScheduleConflictValidationDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Has schedule conflicts',
    example: false,
  })
  hasConflicts: boolean;

  @ApiProperty({
    description: 'Conflict details',
    type: 'array',
  })
  conflicts: Array<{
    courseId1: string;
    courseId2: string;
    conflictType: string;
    overlapTime: {
      day: string;
      startTime: string;
      endTime: string;
    };
  }>;

  @ApiProperty({
    description: 'Can be resolved',
    example: true,
  })
  canBeResolved: boolean;
}

export class DegreeAuditValidationDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Degree program',
    example: 'BS Computer Science',
  })
  degreeProgram: string;

  @ApiProperty({
    description: 'Registration aligns with degree plan',
    example: true,
  })
  alignsWithDegreePlan: boolean;

  @ApiProperty({
    description: 'Required courses missing',
    type: [String],
  })
  missingRequired: string[];

  @ApiProperty({
    description: 'Substitutions needed',
    type: 'array',
  })
  substitutions: Array<{
    required: string;
    proposed: string;
    approved: boolean;
  }>;

  @ApiProperty({
    description: 'Degree audit summary',
    type: 'object',
  })
  auditSummary: {
    creditsRequired: number;
    creditsCompleted: number;
    creditsInProgress: number;
    percentComplete: number;
  };
}

export class BulkValidationRequestDto {
  @ApiProperty({
    description: 'Validation requests',
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegistrationValidationRequestDto)
  validations: RegistrationValidationRequestDto[];

  @ApiPropertyOptional({
    description: 'Parallel processing',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  parallel?: boolean;
}

export class BulkValidationResultDto {
  @ApiProperty({
    description: 'Total validations',
    example: 10,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Valid registrations',
    example: 9,
    minimum: 0,
  })
  valid: number;

  @ApiProperty({
    description: 'Invalid registrations',
    example: 1,
    minimum: 0,
  })
  invalid: number;

  @ApiProperty({
    description: 'Warnings',
    example: 2,
    minimum: 0,
  })
  warnings: number;

  @ApiPropertyOptional({
    description: 'Detailed results per student',
    type: 'array',
  })
  details?: Array<{
    studentId: string;
    status: ValidationStatus;
    errors?: string[];
  }>;

  @ApiProperty({
    description: 'Processing timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  processedAt: Date;
}
