import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for medication list query parameters
 *
 * Supports pagination, search, and filtering by various criteria.
 */
export class ListMedicationsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Search term for medication name (case-insensitive)',
    example: 'ibuprofen',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by student UUID',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by controlled substance status',
    example: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isControlled?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by DEA schedule (II-V)',
    example: 'II',
  })
  @IsString()
  @IsOptional()
  deaSchedule?: string;
}
