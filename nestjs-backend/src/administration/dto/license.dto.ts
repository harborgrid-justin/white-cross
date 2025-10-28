import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsArray,
  IsNumber,
  IsDate,
  Min,
  Matches,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LicenseType, LicenseStatus } from '../enums/administration.enums';

/**
 * DTO for creating a new license
 */
export class CreateLicenseDto {
  @ApiProperty({
    description: 'License key (uppercase alphanumeric with hyphens)',
    example: 'ABC-DEF-123-456',
  })
  @IsString()
  @Matches(/^[A-Z0-9-]+$/, {
    message:
      'License key can only contain uppercase letters, numbers, and hyphens',
  })
  licenseKey: string;

  @ApiProperty({ description: 'License type', enum: LicenseType })
  @IsEnum(LicenseType)
  type: LicenseType;

  @ApiPropertyOptional({ description: 'Maximum number of users', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsers?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of schools',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxSchools?: number;

  @ApiProperty({
    description: 'Array of feature codes included in license',
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  features: string[];

  @ApiPropertyOptional({ description: 'Organization or person issued to' })
  @IsOptional()
  @IsString()
  issuedTo?: string;

  @ApiPropertyOptional({ description: 'Associated district UUID' })
  @IsOptional()
  @IsUUID()
  districtId?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'License expiration date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;
}

/**
 * DTO for updating a license
 */
export class UpdateLicenseDto extends PartialType(CreateLicenseDto) {
  @ApiPropertyOptional({ description: 'License status', enum: LicenseStatus })
  @IsOptional()
  @IsEnum(LicenseStatus)
  status?: LicenseStatus;
}

/**
 * DTO for querying licenses with pagination
 */
export class LicenseQueryDto {
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

  @ApiPropertyOptional({ description: 'Filter by status', enum: LicenseStatus })
  @IsOptional()
  @IsEnum(LicenseStatus)
  status?: LicenseStatus;
}
