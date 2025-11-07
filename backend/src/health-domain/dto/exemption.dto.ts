/**
 * @fileoverview Immunization Exemption DTOs
 * @module health-domain/dto/exemption
 * @description Data transfer objects for vaccine exemption requests and management
 *
 * HIPAA Compliance: Medical exemptions contain PHI requiring audit logging
 * State Compliance: Exemption types and documentation requirements vary by state
 */

import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Exemption types recognized across states
 * - MEDICAL: Provider-documented medical contraindication
 * - RELIGIOUS: Religious belief exemption (varies by state)
 * - PHILOSOPHICAL: Personal belief exemption (not all states)
 * - TEMPORARY: Temporary delay due to illness/conditions
 */
export enum ExemptionType {
  MEDICAL = 'MEDICAL',
  RELIGIOUS = 'RELIGIOUS',
  PHILOSOPHICAL = 'PHILOSOPHICAL',
  TEMPORARY = 'TEMPORARY',
}

/**
 * Exemption status lifecycle
 */
export enum ExemptionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

/**
 * Create Exemption Request DTO
 * Used when recording a new vaccine exemption
 */
export class HealthDomainCreateExemptionDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  studentId: string;

  @ApiProperty({
    description: 'Vaccine name or CDC CVX code being exempted',
    example: 'MMR',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  vaccineName: string;

  @ApiProperty({
    description: 'CVX code for vaccine (if applicable)',
    example: '03',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  cvxCode?: string;

  @ApiProperty({
    description: 'Type of exemption being requested',
    enum: ExemptionType,
    example: ExemptionType.MEDICAL,
  })
  @IsEnum(ExemptionType)
  exemptionType: ExemptionType;

  @ApiProperty({
    description: 'Detailed reason for exemption',
    example: 'Severe allergic reaction to vaccine component (egg allergy)',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  reason: string;

  @ApiProperty({
    description: 'Medical provider name (required for MEDICAL exemptions)',
    example: 'Dr. Jane Smith, MD',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  providerName?: string;

  @ApiProperty({
    description: 'Medical provider license number',
    example: 'MD123456',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  providerLicense?: string;

  @ApiProperty({
    description: 'Provider NPI number (National Provider Identifier)',
    example: '1234567890',
    required: false,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  providerNPI?: string;

  @ApiProperty({
    description: 'Date provider signed exemption (required for MEDICAL)',
    example: '2025-01-15',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  providerSignatureDate?: Date;

  @ApiProperty({
    description: 'Exemption expiration date (permanent if null)',
    example: '2026-01-15',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expirationDate?: Date;

  @ApiProperty({
    description: 'Supporting document URL or file reference',
    example: 'documents/exemptions/student-123-mmr-exemption.pdf',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  documentUrl?: string;

  @ApiProperty({
    description: 'State-specific exemption form reference',
    example: 'CA-PM-286',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  stateFormNumber?: string;

  @ApiProperty({
    description: 'Parent/guardian consent obtained',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  parentConsent?: boolean;

  @ApiProperty({
    description: 'Parent/guardian name who provided consent',
    example: 'John Doe',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  parentName?: string;

  @ApiProperty({
    description: 'Date parent consent was obtained',
    example: '2025-01-15',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  parentConsentDate?: Date;

  @ApiProperty({
    description: 'Additional notes or context',
    example:
      'Family physician will monitor for future administration possibility',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiProperty({
    description: 'User ID who created the exemption request',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  createdBy: string;
}

/**
 * Update Exemption DTO
 * Partial update of existing exemption
 */
export class UpdateExemptionDto extends PartialType(
  HealthDomainCreateExemptionDto,
) {
  @ApiProperty({
    description: 'Exemption status',
    enum: ExemptionStatus,
    example: ExemptionStatus.APPROVED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExemptionStatus)
  status?: ExemptionStatus;

  @ApiProperty({
    description: 'Status change reason (required when approving/denying)',
    example: 'Medical documentation verified by school nurse',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  statusChangeReason?: string;

  @ApiProperty({
    description: 'User ID who reviewed/updated the exemption',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  reviewedBy?: string;

  @ApiProperty({
    description: 'Date exemption was reviewed',
    example: '2025-01-16',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  reviewedDate?: Date;
}

/**
 * Exemption Filter DTO
 * Query parameters for listing exemptions
 */
export class ExemptionFilterDto {
  @ApiProperty({
    description: 'Filter by student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  studentId?: string;

  @ApiProperty({
    description: 'Filter by exemption type',
    enum: ExemptionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExemptionType)
  exemptionType?: ExemptionType;

  @ApiProperty({
    description: 'Filter by exemption status',
    enum: ExemptionStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExemptionStatus)
  status?: ExemptionStatus;

  @ApiProperty({
    description: 'Filter by vaccine name',
    example: 'MMR',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  vaccineName?: string;

  @ApiProperty({
    description: 'Include expired exemptions',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeExpired?: boolean;
}
