/**
 * @fileoverview Create Allergy DTO
 * @module health-record/allergy/dto
 * @description Data Transfer Object for creating allergy records with validation
 * HIPAA Compliance: All allergy data is PHI and requires validation
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUUID,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import {
  AllergyType,
  AllergySeverity,
} from '../../../database/models/allergy.model';

export class CreateAllergyDto {
  @ApiProperty({
    description: 'Student ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty({ message: 'Student ID is required' })
  studentId: string;

  @ApiProperty({
    description: 'Allergen name or description',
    example: 'Peanuts',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Allergen name is required' })
  @MinLength(1, { message: 'Allergen name must not be empty' })
  @MaxLength(255, { message: 'Allergen name must not exceed 255 characters' })
  allergen: string;

  @ApiProperty({
    description: 'Type of allergy',
    enum: AllergyType,
    example: AllergyType.FOOD,
  })
  @IsEnum(AllergyType, { message: 'Invalid allergy type' })
  @IsNotEmpty({ message: 'Allergy type is required' })
  allergyType: AllergyType;

  @ApiProperty({
    description: 'Severity level of the allergy',
    enum: AllergySeverity,
    example: AllergySeverity.SEVERE,
  })
  @IsEnum(AllergySeverity, { message: 'Invalid allergy severity' })
  @IsNotEmpty({ message: 'Allergy severity is required' })
  severity: AllergySeverity;

  @ApiPropertyOptional({
    description: 'Symptoms experienced during allergic reaction',
    example: 'Hives, difficulty breathing, swelling of throat',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Symptoms must not exceed 2000 characters' })
  symptoms?: string;

  @ApiPropertyOptional({
    description: 'Treatment administered or recommended',
    example: 'EpiPen, antihistamines',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Treatment must not exceed 2000 characters' })
  treatment?: string;

  @ApiPropertyOptional({
    description: 'Emergency protocol to follow',
    example: 'Administer EpiPen immediately and call 911',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'Emergency protocol must not exceed 2000 characters',
  })
  emergencyProtocol?: string;

  @ApiPropertyOptional({
    description: 'Date when allergy first appeared',
    example: '2020-01-15',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid onset date format' })
  onsetDate?: string;

  @ApiPropertyOptional({
    description: 'Date when allergy was diagnosed',
    example: '2020-02-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid diagnosed date format' })
  diagnosedDate?: string;

  @ApiPropertyOptional({
    description: 'Name of healthcare provider who diagnosed the allergy',
    example: 'Dr. Jane Smith',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Diagnosed by must not exceed 255 characters' })
  diagnosedBy?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the allergy',
    example: 'Severe reaction to trace amounts',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Notes must not exceed 2000 characters' })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Whether an EpiPen is required for this allergy',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'EpiPen required must be a boolean' })
  epiPenRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Location where EpiPen is stored',
    example: 'Nurse office, first aid kit',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'EpiPen location must not exceed 255 characters' })
  epiPenLocation?: string;

  @ApiPropertyOptional({
    description: 'EpiPen expiration date',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid EpiPen expiration date format' })
  epiPenExpiration?: string;

  @ApiPropertyOptional({
    description: 'Associated health record ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID('4')
  healthRecordId?: string;
}
