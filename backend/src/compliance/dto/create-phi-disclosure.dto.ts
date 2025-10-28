/**
 * DTO for creating PHI disclosure records
 * HIPAA §164.528 - Accounting of Disclosures
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDate,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DisclosureType, DisclosurePurpose, DisclosureMethod, RecipientType } from '../enums';

export class CreatePhiDisclosureDto {
  @ApiProperty({
    description: 'ID of the student whose PHI is being disclosed',
    example: 'student-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Type of disclosure',
    enum: DisclosureType,
    example: DisclosureType.TREATMENT,
  })
  @IsEnum(DisclosureType)
  disclosureType: DisclosureType;

  @ApiProperty({
    description: 'Purpose of the disclosure',
    enum: DisclosurePurpose,
    example: DisclosurePurpose.TREATMENT,
  })
  @IsEnum(DisclosurePurpose)
  purpose: DisclosurePurpose;

  @ApiProperty({
    description: 'Method of disclosure',
    enum: DisclosureMethod,
    example: DisclosureMethod.ELECTRONIC,
  })
  @IsEnum(DisclosureMethod)
  method: DisclosureMethod;

  @ApiProperty({
    description: 'Date of disclosure',
    type: Date,
    example: '2025-01-15T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  disclosureDate: Date;

  @ApiProperty({
    description: 'Array of information types disclosed',
    type: [String],
    example: ['Medications', 'Immunization Records', 'Allergies'],
  })
  @IsArray()
  @IsString({ each: true })
  informationDisclosed: string[];

  @ApiProperty({
    description: 'Minimum necessary justification (HIPAA requirement, min 10 characters)',
    example: 'Information required for emergency treatment coordination with external provider',
    minLength: 10,
  })
  @IsString()
  @MinLength(10, { message: 'Minimum necessary justification must be at least 10 characters' })
  minimumNecessary: string;

  @ApiProperty({
    description: 'Type of recipient',
    enum: RecipientType,
    example: RecipientType.HEALTHCARE_PROVIDER,
  })
  @IsEnum(RecipientType)
  recipientType: RecipientType;

  @ApiProperty({
    description: 'Name of the recipient',
    example: 'Dr. John Smith',
  })
  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @ApiPropertyOptional({
    description: 'Organization of the recipient',
    example: 'City General Hospital',
  })
  @IsString()
  @IsOptional()
  recipientOrganization?: string;

  @ApiPropertyOptional({
    description: 'Address of the recipient',
    example: '123 Medical Center Drive, City, ST 12345',
  })
  @IsString()
  @IsOptional()
  recipientAddress?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the recipient',
    example: '(555) 123-4567',
  })
  @IsString()
  @IsOptional()
  recipientPhone?: string;

  @ApiPropertyOptional({
    description: 'Email address of the recipient',
    example: 'dr.smith@hospital.org',
  })
  @IsEmail()
  @IsOptional()
  recipientEmail?: string;

  @ApiProperty({
    description: 'Whether patient authorization was obtained',
    example: true,
  })
  @IsBoolean()
  authorizationObtained: boolean;

  @ApiPropertyOptional({
    description: 'Date authorization was obtained',
    type: Date,
    example: '2025-01-14T09:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  authorizationDate?: Date;

  @ApiPropertyOptional({
    description: 'Authorization expiry date',
    type: Date,
    example: '2026-01-14T09:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  authorizationExpiryDate?: Date;

  @ApiProperty({
    description: 'Whether disclosure was requested by patient',
    example: false,
  })
  @IsBoolean()
  patientRequested: boolean;

  @ApiProperty({
    description: 'Whether follow-up is required',
    example: true,
  })
  @IsBoolean()
  followUpRequired: boolean;

  @ApiPropertyOptional({
    description: 'Date follow-up is due',
    type: Date,
    example: '2025-02-15T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  followUpDate?: Date;

  @ApiPropertyOptional({
    description: 'Additional notes about the disclosure',
    example: 'Emergency situation required immediate disclosure to treating physician',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
