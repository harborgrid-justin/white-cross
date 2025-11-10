/**
 * Shared date range DTOs for downstream composites
 * Used for filtering and querying by date ranges
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsISO8601, ValidateIf } from 'class-validator';

/**
 * Date range query DTO
 */
export class DateRangeQueryDto {
  @ApiPropertyOptional({
    description: 'Start date (ISO 8601)',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date (ISO 8601)',
    example: '2025-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;
}

/**
 * Date range DTO with Date objects
 */
export class DateRangeDto {
  @ApiProperty({
    description: 'Start date',
    example: '2025-01-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date',
    example: '2025-12-31T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}

/**
 * Optional date range DTO
 */
export class OptionalDateRangeDto {
  @ApiPropertyOptional({
    description: 'Start date',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date',
    example: '2025-12-31T23:59:59Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}

/**
 * Academic year date range DTO
 */
export class AcademicYearRangeDto {
  @ApiProperty({
    description: 'Academic year (e.g., 2024-2025)',
    example: '2024-2025',
  })
  academicYear: string;

  @ApiProperty({
    description: 'Start date of academic year',
    example: '2024-08-15T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date of academic year',
    example: '2025-05-31T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}

/**
 * Term date range DTO
 */
export class TermDateRangeDto {
  @ApiProperty({
    description: 'Term identifier',
    example: 'FALL2025',
  })
  termId: string;

  @ApiProperty({
    description: 'Term start date',
    example: '2025-08-15T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Term end date',
    example: '2025-12-15T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
