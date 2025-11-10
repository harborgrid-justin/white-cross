/**
 * Aid Application DTOs for financial aid application management
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
} from 'class-validator';

export enum AidApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  PENDING_DOCUMENTS = 'pending_documents',
  COMPLETED = 'completed',
}

export enum AidYear {
  YEAR_2024_2025 = '2024-2025',
  YEAR_2025_2026 = '2025-2026',
  YEAR_2026_2027 = '2026-2027',
}

export enum EducationLevel {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  PROFESSIONAL = 'professional',
  NON_DEGREE = 'non_degree',
}

export class AidApplicationRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Financial aid year',
    enum: AidYear,
    example: AidYear.YEAR_2025_2026,
  })
  @IsEnum(AidYear)
  aidYear: AidYear;

  @ApiProperty({
    description: 'Education level',
    enum: EducationLevel,
  })
  @IsEnum(EducationLevel)
  educationLevel: EducationLevel;

  @ApiPropertyOptional({
    description: 'FAFSA application ID',
    example: 'FAFSA-123456',
  })
  @IsOptional()
  @IsString()
  fafsaId?: string;

  @ApiPropertyOptional({
    description: 'Expected family contribution',
    example: 5000.00,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  expectedFamilyContribution?: number;

  @ApiPropertyOptional({
    description: 'Cost of attendance',
    example: 50000.00,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costOfAttendance?: number;

  @ApiPropertyOptional({
    description: 'Application notes',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AidApplicationResponseDto {
  @ApiProperty({
    description: 'Application identifier',
    example: 'AID-APP-2024001',
  })
  applicationId: string;

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
    description: 'Financial aid year',
    enum: AidYear,
  })
  aidYear: AidYear;

  @ApiProperty({
    description: 'Application status',
    enum: AidApplicationStatus,
  })
  status: AidApplicationStatus;

  @ApiProperty({
    description: 'Education level',
    enum: EducationLevel,
  })
  educationLevel: EducationLevel;

  @ApiProperty({
    description: 'Submission date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  submittedDate: Date;

  @ApiPropertyOptional({
    description: 'Review completion date',
    example: '2025-11-15T14:30:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  reviewedDate?: Date;

  @ApiPropertyOptional({
    description: 'FAFSA application ID',
    example: 'FAFSA-123456',
  })
  @IsOptional()
  fafsaId?: string;

  @ApiPropertyOptional({
    description: 'Expected family contribution',
    example: 5000.00,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  expectedFamilyContribution?: number;

  @ApiPropertyOptional({
    description: 'Cost of attendance',
    example: 50000.00,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  costOfAttendance?: number;

  @ApiPropertyOptional({
    description: 'Financial need',
    example: 45000.00,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  financialNeed?: number;

  @ApiProperty({
    description: 'Required documents',
    type: [String],
  })
  requiredDocuments: string[];

  @ApiProperty({
    description: 'Submitted documents',
    type: [String],
  })
  submittedDocuments: string[];
}

export class AidApplicationUpdateDto {
  @ApiPropertyOptional({
    description: 'FAFSA application ID',
  })
  @IsOptional()
  @IsString()
  fafsaId?: string;

  @ApiPropertyOptional({
    description: 'Expected family contribution',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  expectedFamilyContribution?: number;

  @ApiPropertyOptional({
    description: 'Cost of attendance',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  costOfAttendance?: number;

  @ApiPropertyOptional({
    description: 'Updated notes',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkAidApplicationDto {
  @ApiProperty({
    description: 'Student identifiers',
    type: [String],
    example: ['STU-2024001', 'STU-2024002'],
  })
  @IsArray()
  @IsString({ each: true })
  studentIds: string[];

  @ApiProperty({
    description: 'Financial aid year',
    enum: AidYear,
  })
  @IsEnum(AidYear)
  aidYear: AidYear;

  @ApiProperty({
    description: 'Education level',
    enum: EducationLevel,
  })
  @IsEnum(EducationLevel)
  educationLevel: EducationLevel;
}

export class AidApplicationQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Application status filter',
    enum: AidApplicationStatus,
  })
  @IsOptional()
  @IsEnum(AidApplicationStatus)
  status?: AidApplicationStatus;

  @ApiPropertyOptional({
    description: 'Aid year filter',
    enum: AidYear,
  })
  @IsOptional()
  @IsEnum(AidYear)
  aidYear?: AidYear;

  @ApiPropertyOptional({
    description: 'Education level filter',
    enum: EducationLevel,
  })
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

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

export class DocumentRequirementDto {
  @ApiProperty({
    description: 'Document type',
    example: 'Tax Return',
  })
  documentType: string;

  @ApiProperty({
    description: 'Is document required',
    example: true,
  })
  required: boolean;

  @ApiProperty({
    description: 'Document description',
    example: 'Last year federal tax return',
  })
  description: string;

  @ApiProperty({
    description: 'Due date',
    example: '2025-12-31T23:59:00Z',
  })
  @Type(() => Date)
  dueDate: Date;

  @ApiPropertyOptional({
    description: 'Document upload URL',
    example: 'https://upload.university.edu/aid-docs',
  })
  @IsOptional()
  uploadUrl?: string;
}

export class AidApplicationDetailDto {
  @ApiProperty({
    description: 'Application identifier',
    example: 'AID-APP-2024001',
  })
  applicationId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Financial aid year',
    enum: AidYear,
  })
  aidYear: AidYear;

  @ApiProperty({
    description: 'Application status',
    enum: AidApplicationStatus,
  })
  status: AidApplicationStatus;

  @ApiProperty({
    description: 'Document requirements',
    type: 'array',
    isArray: true,
  })
  documents: DocumentRequirementDto[];

  @ApiProperty({
    description: 'Financial information',
    type: 'object',
  })
  financialInfo: {
    expectedFamilyContribution: number;
    costOfAttendance: number;
    financialNeed: number;
    estimatedAidAmount: number;
  };

  @ApiProperty({
    description: 'Application timeline',
    type: 'object',
  })
  timeline: {
    submittedDate: Date;
    reviewStartDate?: Date;
    reviewCompletedDate?: Date;
    approvalDate?: Date;
  };
}
