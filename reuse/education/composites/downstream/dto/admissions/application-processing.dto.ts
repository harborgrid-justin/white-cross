/**
 * Application Processing DTOs for admissions backend
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
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PENDING_MATERIALS = 'pending_materials',
  COMMITTEE_REVIEW = 'committee_review',
  ADMITTED = 'admitted',
  DENIED = 'denied',
  WAITLISTED = 'waitlisted',
  DEFERRED = 'deferred',
}

export enum ApplicationType {
  FRESHMAN = 'freshman',
  TRANSFER = 'transfer',
  GRADUATE = 'graduate',
  INTERNATIONAL = 'international',
  NON_DEGREE = 'non_degree',
}

export class ProcessApplicationBatchDto {
  @ApiProperty({ description: 'Applications to process', type: 'array' })
  @IsArray()
  @ValidateNested({ each: true })
  applications: ApplicationDataDto[];
}

export class ApplicationDataDto {
  @ApiProperty({ description: 'Application identifier', example: 'APP-123456' })
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({ description: 'Application type', enum: ApplicationType })
  @IsEnum(ApplicationType)
  applicationType: ApplicationType;

  @ApiProperty({ description: 'Applicant first name', minLength: 1, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Applicant last name', minLength: 1, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email address', example: 'applicant@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Application data', type: 'object' })
  @IsOptional()
  data?: Record<string, any>;
}

export class ImportApplicationDataDto {
  @ApiProperty({ description: 'Data source', example: 'CommonApp', minLength: 1, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiPropertyOptional({ description: 'Import batch ID', example: 'BATCH-789' })
  @IsOptional()
  @IsString()
  batchId?: string;

  @ApiPropertyOptional({ description: 'Import options', type: 'object' })
  @IsOptional()
  options?: {
    overwrite?: boolean;
    validateOnly?: boolean;
  };
}

export class ValidateApplicationDataDto {
  @ApiProperty({ description: 'Application data to validate', type: 'object' })
  @IsNotEmpty()
  data: Record<string, any>;

  @ApiPropertyOptional({ description: 'Validation rules to apply', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rules?: string[];
}

export class ValidationResultDto {
  @ApiProperty({ description: 'Whether data is valid', example: true })
  valid: boolean;

  @ApiProperty({ description: 'Validation errors', type: [String] })
  errors: string[];

  @ApiPropertyOptional({ description: 'Warnings', type: [String] })
  warnings?: string[];
}

export class SyncExternalSystemResponseDto {
  @ApiProperty({ description: 'Number of records synced', example: 150, minimum: 0 })
  @IsNumber()
  @Min(0)
  synced: number;

  @ApiPropertyOptional({ description: 'Sync errors', type: [String] })
  errors?: string[];

  @ApiProperty({ description: 'Sync timestamp' })
  @Type(() => Date)
  @IsDate()
  syncedAt: Date;
}

export class TranscriptProcessingDto {
  @ApiProperty({ description: 'Transcript data', type: 'array' })
  @IsArray()
  transcriptData: Array<{
    studentId: string;
    institution: string;
    gpa: number;
    credits: number;
  }>;
}

export class TestScoreValidationDto {
  @ApiProperty({ description: 'Test scores to validate', type: 'array' })
  @IsArray()
  scores: Array<{
    testType: string;
    score: number;
    testDate: Date;
  }>;
}

export class DuplicateMatchResultDto {
  @ApiProperty({ description: 'Potential duplicate records found', type: 'array' })
  matches: Array<{
    recordId: string;
    matchScore: number;
    matchingFields: string[];
  }>;
}

export class MergeRecordsDto {
  @ApiProperty({ description: 'Record IDs to merge', type: [String] })
  @IsArray()
  @IsString({ each: true })
  recordIds: string[];

  @ApiProperty({ description: 'Primary record ID to keep', example: 'REC-123' })
  @IsString()
  @IsNotEmpty()
  primaryRecordId: string;
}

export class ApplicationMetricsResponseDto {
  @ApiProperty({ description: 'Total applications', example: 5000 })
  totalApplications: number;

  @ApiProperty({ description: 'Applications by status', type: 'object' })
  byStatus: Record<ApplicationStatus, number>;

  @ApiProperty({ description: 'Average processing time (days)', example: 14.5 })
  averageProcessingTime: number;

  @ApiProperty({ description: 'Admission rate', example: 0.35 })
  admissionRate: number;
}

export class DecisionRuleDto {
  @ApiProperty({ description: 'Rule name', example: 'Auto-admit high GPA' })
  ruleName: string;

  @ApiProperty({ description: 'Rule conditions', type: 'object' })
  conditions: Record<string, any>;

  @ApiProperty({ description: 'Decision outcome', enum: ApplicationStatus })
  outcome: ApplicationStatus;
}

export class ExceptionalCaseDto {
  @ApiProperty({ description: 'Application ID', example: 'APP-123456' })
  applicationId: string;

  @ApiProperty({ description: 'Exception reasons', type: [String] })
  reasons: string[];

  @ApiProperty({ description: 'Requires manual review', example: true })
  requiresManualReview: boolean;
}
