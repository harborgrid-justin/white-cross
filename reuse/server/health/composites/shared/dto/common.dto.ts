/**
 * LOC: DTO-COMMON-001
 * File: /reuse/server/health/composites/shared/dto/common.dto.ts
 * Purpose: Common DTOs used across healthcare system
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Base DTO with common timestamp fields
 */
export class BaseEntityDto {
  @ApiProperty({ description: 'Record creation timestamp' })
  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ description: 'Record last update timestamp' })
  @IsDateString()
  @IsOptional()
  updatedAt?: string;

  @ApiPropertyOptional({ description: 'User who created this record' })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'User who last updated this record' })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}

/**
 * Pagination query DTO
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20, minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Sort field' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

/**
 * Date range query DTO
 */
export class DateRangeQueryDto {
  @ApiProperty({ description: 'Start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date' })
  @IsDateString()
  endDate: string;
}

/**
 * Patient identifier DTO
 */
export class PatientIdentifierDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  patientId: string;

  @ApiPropertyOptional({ description: 'Medical record number (MRN)' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  mrn?: string;

  @ApiPropertyOptional({ description: 'Facility ID' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  facilityId?: string;
}

/**
 * Address DTO
 */
export class AddressDto {
  @ApiProperty({ description: 'Street address line 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  street1: string;

  @ApiPropertyOptional({ description: 'Street address line 2' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  street2?: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ description: 'State/Province' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  state: string;

  @ApiProperty({ description: 'ZIP/Postal code' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'Invalid ZIP code format' })
  zipCode: string;

  @ApiPropertyOptional({ description: 'Country', default: 'USA' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  country?: string = 'USA';
}

/**
 * Contact information DTO
 */
export class ContactInfoDto {
  @ApiPropertyOptional({ description: 'Primary phone number' })
  @IsPhoneNumber('US')
  @IsOptional()
  primaryPhone?: string;

  @ApiPropertyOptional({ description: 'Secondary phone number' })
  @IsPhoneNumber('US')
  @IsOptional()
  secondaryPhone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Preferred contact method' })
  @IsEnum(['phone', 'email', 'sms', 'portal'])
  @IsOptional()
  preferredMethod?: 'phone' | 'email' | 'sms' | 'portal';
}

/**
 * Insurance information DTO
 */
export class InsuranceDto {
  @ApiProperty({ description: 'Insurance provider name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  provider: string;

  @ApiProperty({ description: 'Policy number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  policyNumber: string;

  @ApiProperty({ description: 'Group number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  groupNumber: string;

  @ApiPropertyOptional({ description: 'Subscriber name' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  subscriberName?: string;

  @ApiPropertyOptional({ description: 'Relationship to subscriber' })
  @IsEnum(['self', 'spouse', 'child', 'other'])
  @IsOptional()
  relationship?: 'self' | 'spouse' | 'child' | 'other';

  @ApiPropertyOptional({ description: 'Coverage start date' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Coverage end date' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Insurance type' })
  @IsEnum(['primary', 'secondary', 'tertiary'])
  @IsOptional()
  type?: 'primary' | 'secondary' | 'tertiary' = 'primary';
}

/**
 * Clinical code DTO (ICD-10, CPT, SNOMED, etc.)
 */
export class ClinicalCodeDto {
  @ApiProperty({ description: 'Code system (ICD10, CPT, SNOMED, LOINC, etc.)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  system: string;

  @ApiProperty({ description: 'Code value' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Code display text' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  display: string;

  @ApiPropertyOptional({ description: 'Code system version' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  version?: string;
}

/**
 * Provider identifier DTO
 */
export class ProviderIdentifierDto {
  @ApiProperty({ description: 'Provider ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  providerId: string;

  @ApiPropertyOptional({ description: 'National Provider Identifier (NPI)' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{10}$/, { message: 'NPI must be exactly 10 digits' })
  npi?: string;

  @ApiPropertyOptional({ description: 'DEA number for controlled substances' })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]{2}\d{7}$/, { message: 'Invalid DEA number format' })
  deaNumber?: string;

  @ApiPropertyOptional({ description: 'State license number' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  licenseNumber?: string;
}

/**
 * Allergy DTO
 */
export class AllergyDto {
  @ApiProperty({ description: 'Allergen name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  allergen: string;

  @ApiProperty({ description: 'Allergy type' })
  @IsEnum(['drug', 'food', 'environment', 'other'])
  type: 'drug' | 'food' | 'environment' | 'other';

  @ApiProperty({ description: 'Severity' })
  @IsEnum(['mild', 'moderate', 'severe'])
  severity: 'mild' | 'moderate' | 'severe';

  @ApiPropertyOptional({ description: 'Reaction description' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  reaction?: string;

  @ApiPropertyOptional({ description: 'Onset date' })
  @IsDateString()
  @IsOptional()
  onsetDate?: string;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

/**
 * Vital signs DTO
 */
export class VitalSignsDto {
  @ApiPropertyOptional({ description: 'Blood pressure systolic (mmHg)' })
  @IsNumber()
  @Min(0)
  @Max(300)
  @IsOptional()
  bpSystolic?: number;

  @ApiPropertyOptional({ description: 'Blood pressure diastolic (mmHg)' })
  @IsNumber()
  @Min(0)
  @Max(200)
  @IsOptional()
  bpDiastolic?: number;

  @ApiPropertyOptional({ description: 'Heart rate (bpm)' })
  @IsNumber()
  @Min(0)
  @Max(300)
  @IsOptional()
  heartRate?: number;

  @ApiPropertyOptional({ description: 'Respiratory rate (breaths/min)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  respiratoryRate?: number;

  @ApiPropertyOptional({ description: 'Temperature (°F)' })
  @IsNumber()
  @Min(90)
  @Max(110)
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional({ description: 'Oxygen saturation (%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  oxygenSaturation?: number;

  @ApiPropertyOptional({ description: 'Weight (lbs)' })
  @IsNumber()
  @Min(0)
  @Max(1000)
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Height (inches)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  height?: number;

  @ApiProperty({ description: 'Measurement timestamp' })
  @IsDateString()
  measuredAt: string;
}
