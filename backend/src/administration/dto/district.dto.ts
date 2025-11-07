import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/**
 * DTO for creating a new district
 */
export class CreateDistrictDto {
  @ApiProperty({ description: 'District name', minLength: 2, maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Unique district code (uppercase alphanumeric)',
    example: 'DIST001',
  })
  @IsString()
  @Matches(/^[A-Z0-9]+$/, {
    message: 'District code must contain only uppercase letters and numbers',
  })
  code: string;

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
}

/**
 * DTO for updating a district
 */
export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {
  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * DTO for querying districts with pagination
 */
export class DistrictQueryDto {
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
}
