/**
 * International Student DTOs for admissions processing
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsDate,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum VisaType {
  F1 = 'F1',
  J1 = 'J1',
  M1 = 'M1',
  OTHER = 'other',
}

export enum CredentialEvaluationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REQUIRES_ADDITIONAL_INFO = 'requires_additional_info',
}

export class ProcessInternationalCredentialsDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Country of origin', example: 'China' })
  @IsString()
  @IsNotEmpty()
  countryOfOrigin: string;

  @ApiProperty({ description: 'Credential documents', type: 'array' })
  documents: Array<{
    documentType: string;
    documentUrl: string;
    institution: string;
  }>;

  @ApiPropertyOptional({ description: 'Evaluation service', example: 'WES' })
  @IsOptional()
  @IsString()
  evaluationService?: string;
}

export class CredentialEvaluationResponseDto {
  @ApiProperty({ description: 'Evaluation ID', example: 'EVAL-789' })
  evaluationId: string;

  @ApiProperty({ description: 'Evaluation status', enum: CredentialEvaluationStatus })
  status: CredentialEvaluationStatus;

  @ApiProperty({ description: 'US GPA equivalent', example: 3.45 })
  usGPAEquivalent: number;

  @ApiProperty({ description: 'Credits equivalent', example: 90 })
  creditsEquivalent: number;

  @ApiPropertyOptional({ description: 'Evaluation notes' })
  notes?: string;
}

export class ValidateVisaDocumentationDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Visa type', enum: VisaType })
  @IsEnum(VisaType)
  @IsNotEmpty()
  visaType: VisaType;

  @ApiProperty({ description: 'Passport number', minLength: 6, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @ApiProperty({ description: 'Passport expiration date' })
  @Type(() => Date)
  @IsDate()
  passportExpirationDate: Date;

  @ApiPropertyOptional({ description: 'Financial documentation provided' })
  @IsOptional()
  @IsBoolean()
  financialDocsProvided?: boolean;
}

export class VisaDocumentationResponseDto {
  @ApiProperty({ description: 'Whether documentation is valid', example: true })
  valid: boolean;

  @ApiProperty({ description: 'Missing documents', type: [String] })
  missingDocuments: string[];

  @ApiPropertyOptional({ description: 'Validation notes' })
  notes?: string;
}

export class CoordinateSEVISDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'SEVIS ID', minLength: 10, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  sevisId: string;

  @ApiProperty({ description: 'Program start date' })
  @Type(() => Date)
  @IsDate()
  programStartDate: Date;

  @ApiProperty({ description: 'Program end date' })
  @Type(() => Date)
  @IsDate()
  programEndDate: Date;
}

export class SEVISCoordinationResponseDto {
  @ApiProperty({ description: 'SEVIS coordination successful', example: true })
  success: boolean;

  @ApiProperty({ description: 'SEVIS ID', example: 'N1234567890' })
  sevisId: string;

  @ApiProperty({ description: 'I-20 generation status', example: 'pending' })
  i20Status: string;

  @ApiPropertyOptional({ description: 'Processing notes' })
  notes?: string;
}

export class GenerateI20Dto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Program of study', example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  programOfStudy: string;

  @ApiProperty({ description: 'Expected completion date' })
  @Type(() => Date)
  @IsDate()
  expectedCompletionDate: Date;

  @ApiProperty({ description: 'Financial information', type: 'object' })
  financialInfo: {
    totalCost: number;
    fundingSource: string;
    sponsorInfo?: string;
  };
}

export class I20GenerationResponseDto {
  @ApiProperty({ description: 'I-20 document ID', example: 'I20-456789' })
  i20Id: string;

  @ApiProperty({ description: 'Generation status', example: 'generated' })
  status: string;

  @ApiProperty({ description: 'Document URL' })
  documentUrl: string;

  @ApiProperty({ description: 'Generated date' })
  generatedDate: Date;
}
