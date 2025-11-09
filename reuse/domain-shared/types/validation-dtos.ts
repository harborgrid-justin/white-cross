import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsDate,
  IsString,
  IsOptional,
  IsObject,
  IsNumber,
  Min,
  Max,
  IsEmail,
  IsPhoneNumber,
  IsUrl,
  Length,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsPositive,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// BASE DTOs
// ============================================================================

/**
 * Base DTO for all entities, providing common fields.
 */
export abstract class BaseDto {
  @ApiPropertyOptional({ description: 'Entity UUID' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'UUID of user who created the entity' })
  @IsUUID()
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'UUID of user who last updated the entity' })
  @IsUUID()
  @IsOptional()
  updatedBy?: string;
}

/**
 * Base DTO for entities with metadata and notes.
 */
export abstract class BaseMetadataDto extends BaseDto {
  @ApiPropertyOptional({ description: 'Optional metadata as JSON object' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Optional notes or comments' })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  notes?: string;
}

/**
 * DTO for updating a base entity.
 */
export class UpdateBaseDto {
  @ApiProperty({ description: 'Entity UUID to update' })
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @ApiPropertyOptional({ description: 'Optional metadata as JSON object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Optional notes or comments' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}

// ============================================================================
// COMMON DATA STRUCTURE DTOs
// ============================================================================

/**
 * DTO for a physical address.
 */
export class AddressDto {
  @ApiProperty({ description: 'Street address line 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street1!: string;

  @ApiPropertyOptional({ description: 'Street address line 2' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  street2?: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @ApiProperty({ description: 'State or province' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state!: string;

  @ApiProperty({ description: 'Postal or ZIP code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postalCode!: string;

  @ApiProperty({ description: 'Country' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country!: string;

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
 * DTO for contact information.
 */
export class ContactDto {
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
 * DTO for monetary values.
 */
export class MoneyDto {
  @ApiProperty({ description: 'Monetary amount' })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ description: 'ISO 4217 currency code', example: 'USD' })
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  @Matches(/^[A-Z]{3}$/, { message: 'Invalid currency code' })
  currency!: string;
}

/**
 * DTO for date ranges.
 */
export class DateRangeDto {
  @ApiProperty({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;
}

// ============================================================================
// GENERIC DTOs for common API patterns
// ============================================================================

/**
 * DTO for pagination parameters.
 */
export class PaginationQueryDto {
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
 * DTO for sorting parameters.
 */
export class SortQueryDto {
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
 * DTO for search parameters.
 */
export class SearchQueryDto {
  @ApiPropertyOptional({ description: 'Search query string' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  query?: string;
}

/**
 * Combined DTO for APIs supporting pagination, sorting, and searching.
 */
export class PaginatedSearchSortQueryDto extends PaginationQueryDto {
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
  query?: string;
}

/**
 * DTO for file information.
 */
export class FileDto {
  @ApiProperty({ description: 'File name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName!: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber()
  @IsPositive()
  fileSize!: number;

  @ApiProperty({ description: 'MIME type' })
  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @ApiProperty({ description: 'Storage key or path' })
  @IsString()
  @IsNotEmpty()
  storageKey!: string;

  @ApiPropertyOptional({ description: 'File description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

/**
 * DTO for bulk operations on a list of IDs.
 */
export class BulkIdsDto {
  @ApiProperty({ description: 'Array of entity UUIDs to operate on', type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  ids!: string[];
}

/**
 * DTO for bulk delete operations.
 */
export class BulkDeleteDto extends BulkIdsDto {
  @ApiPropertyOptional({ description: 'Perform hard delete instead of soft delete', default: false })
  @IsOptional()
  @IsBoolean()
  force?: boolean = false;
}
