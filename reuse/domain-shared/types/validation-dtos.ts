/**
 * File: /reuse/domain-shared/types/validation-dtos.ts
 * Purpose: Common validation DTO base classes and decorators for domain kits
 *
 * Provides reusable DTO base classes and validation patterns used across
 * construction, consulting, and engineer domains.
 *
 * @module DomainShared/ValidationDTOs
 * @version 1.0.0
 */

import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  IsEmail,
  IsUrl,
  Min,
  Max,
  MinLength,
  MaxLength,
  ValidateNested,
  IsNotEmpty,
  IsObject,
  IsInt,
  IsPositive,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Base DTO with common audit fields
 */
export abstract class BaseDTO {
  @ApiPropertyOptional({ description: 'Entity UUID' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'UUID of user who created the entity' })
  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'UUID of user who last updated the entity' })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;
}

/**
 * Base create DTO - excludes id and audit timestamps
 */
export abstract class CreateDTO {
  @ApiPropertyOptional({ description: 'Optional metadata as JSON object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Optional notes or comments' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}

/**
 * Base update DTO - all fields optional except id
 */
export abstract class UpdateDTO {
  @ApiProperty({ description: 'Entity UUID to update' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Optional metadata as JSON object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Optional notes or comments' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}

/**
 * Address validation DTO
 */
export class AddressDTO {
  @ApiProperty({ description: 'Street address line 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street1: string;

  @ApiPropertyOptional({ description: 'Street address line 2' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  street2?: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ description: 'State or province' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @ApiProperty({ description: 'Postal or ZIP code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;

  @ApiPropertyOptional({ description: 'Latitude coordinate' })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate' })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}

/**
 * Contact information validation DTO
 */
export class ContactInfoDTO {
  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Mobile number' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid mobile number format' })
  mobile?: string;

  @ApiPropertyOptional({ description: 'Fax number' })
  @IsOptional()
  @IsString()
  fax?: string;

  @ApiPropertyOptional({ description: 'Website URL' })
  @IsOptional()
  @IsUrl()
  website?: string;
}

/**
 * Money amount validation DTO
 */
export class MoneyAmountDTO {
  @ApiProperty({ description: 'Monetary amount' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'ISO 4217 currency code', example: 'USD' })
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  @Matches(/^[A-Z]{3}$/, { message: 'Invalid currency code' })
  currency: string;
}

/**
 * Date range validation DTO
 */
export class DateRangeDTO {
  @ApiProperty({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

/**
 * Pagination query DTO
 */
export class PaginationQueryDTO {
  @ApiPropertyOptional({ description: 'Page number (1-indexed)', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

/**
 * Sort query DTO
 */
export class SortQueryDTO {
  @ApiPropertyOptional({ description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

/**
 * Search query DTO
 */
export class SearchQueryDTO {
  @ApiPropertyOptional({ description: 'Search query string' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}

/**
 * Combined list query DTO with pagination, sorting, and search
 */
export class ListQueryDTO extends PaginationQueryDTO {
  @ApiPropertyOptional({ description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiPropertyOptional({ description: 'Search query string' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}

/**
 * File attachment DTO
 */
export class AttachmentDTO {
  @ApiProperty({ description: 'File name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber()
  @IsPositive()
  fileSize: number;

  @ApiProperty({ description: 'MIME type' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ description: 'Storage key or path' })
  @IsString()
  @IsNotEmpty()
  storageKey: string;

  @ApiPropertyOptional({ description: 'File description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

/**
 * Bulk operation DTO
 */
export class BulkOperationDTO {
  @ApiProperty({ description: 'Array of entity UUIDs to operate on', type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  ids: string[];
}

/**
 * Bulk delete DTO
 */
export class BulkDeleteDTO extends BulkOperationDTO {
  @ApiPropertyOptional({ description: 'Perform hard delete instead of soft delete', default: false })
  @IsOptional()
  @IsBoolean()
  hardDelete?: boolean = false;
}
