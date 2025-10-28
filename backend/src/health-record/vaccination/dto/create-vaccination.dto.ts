/**
 * @fileoverview Create Vaccination DTO
 * @module health-record/vaccination/dto/create-vaccination.dto
 * @description DTO for recording vaccinations with CDC CVX compliance
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDate,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVaccinationDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsUUID(4, { message: 'Student ID must be a valid UUID' })
  studentId: string;

  @ApiProperty({
    description: 'Vaccine name',
    example: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose',
    maxLength: 200,
  })
  @IsNotEmpty({ message: 'Vaccine name is required' })
  @IsString()
  @MaxLength(200, { message: 'Vaccine name cannot exceed 200 characters' })
  vaccineName: string;

  @ApiProperty({
    description: 'CDC CVX code',
    example: '208',
    maxLength: 10,
  })
  @IsNotEmpty({ message: 'Vaccine code (CVX) is required' })
  @IsString()
  @MaxLength(10, { message: 'Vaccine code cannot exceed 10 characters' })
  vaccineCode: string;

  @ApiProperty({
    description: 'Administration date',
    example: '2024-10-28',
    type: 'string',
    format: 'date',
  })
  @IsNotEmpty({ message: 'Administration date is required' })
  @IsDate({ message: 'Administration date must be a valid date' })
  @Type(() => Date)
  administrationDate: Date;

  @ApiProperty({
    description: 'Dose number in series',
    example: 1,
    minimum: 1,
    maximum: 10,
  })
  @IsNotEmpty({ message: 'Dose number is required' })
  @IsNumber()
  @Min(1, { message: 'Dose number must be at least 1' })
  @Max(10, { message: 'Dose number cannot exceed 10' })
  doseNumber: number;

  @ApiProperty({
    description: 'Vaccine lot number',
    example: 'EK9231',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Lot number is required' })
  @IsString()
  @MaxLength(50, { message: 'Lot number cannot exceed 50 characters' })
  lotNumber: string;

  @ApiProperty({
    description: 'Manufacturer name',
    example: 'Pfizer-BioNTech',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Manufacturer cannot exceed 200 characters' })
  manufacturer?: string;

  @ApiProperty({
    description: 'Expiration date',
    example: '2025-12-31',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate({ message: 'Expiration date must be a valid date' })
  @Type(() => Date)
  expirationDate?: Date;

  @ApiProperty({
    description: 'Route of administration',
    example: 'Intramuscular',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Route cannot exceed 50 characters' })
  route?: string;

  @ApiProperty({
    description: 'Site of administration',
    example: 'Left deltoid',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Site cannot exceed 100 characters' })
  site?: string;

  @ApiProperty({
    description: 'Name of person who administered vaccine',
    example: 'Nurse Jane Smith, RN',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Administered by cannot exceed 200 characters' })
  administeredBy?: string;

  @ApiProperty({
    description: 'UUID of provider who administered vaccine',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Provider ID must be a valid UUID' })
  providerId?: string;

  @ApiProperty({
    description: 'Additional notes',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes cannot exceed 1000 characters' })
  notes?: string;
}
