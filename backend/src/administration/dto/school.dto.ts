import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

/**
 * DTO for creating a new school
 */
export class CreateSchoolDto {
  @ApiProperty({ description: 'School name', minLength: 2, maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Unique school code (uppercase alphanumeric)',
    example: 'SCH001',
  })
  @IsString()
  @Matches(/^[A-Z0-9]+$/, {
    message: 'School code must contain only uppercase letters and numbers',
  })
  code: string;

  @ApiProperty({ description: 'Parent district UUID' })
  @IsUUID()
  districtId: string;

  @ApiPropertyOptional({ description: 'Street address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City name', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'State abbreviation (2 uppercase letters)',
    example: 'CA',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}$/, {
    message: 'State must be a 2-letter uppercase abbreviation',
  })
  state?: string;

  @ApiPropertyOptional({
    description: 'ZIP code (12345 or 12345-6789)',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{5}(-[0-9]{4})?$/, {
    message: 'ZIP code must be in format 12345 or 12345-6789',
  })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  @Matches(/^[\d\s\-\(\)\+\.]+$/, {
    message: 'Invalid phone number format',
  })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Principal name', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  principal?: string;

  @ApiPropertyOptional({
    description: 'Total student enrollment (0-50000)',
    minimum: 0,
    maximum: 50000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50000)
  totalEnrollment?: number;
}

/**
 * DTO for updating a school
 */
export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * DTO for querying schools with pagination and filters
 */
export class SchoolQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Filter by district UUID' })
  @IsOptional()
  @IsUUID()
  districtId?: string;
}
