import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VisitDisposition } from '../../enums/visit-disposition.enum';
import { Type } from 'class-transformer';

/**
 * Visit Filters DTO
 * Used for filtering and paginating clinic visits
 */
export class VisitFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4')
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by attending healthcare provider ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID('4')
  attendedBy?: string;

  @ApiPropertyOptional({
    description: 'Filter by visit disposition',
    enum: VisitDisposition,
    example: VisitDisposition.RETURN_TO_CLASS,
  })
  @IsOptional()
  @IsEnum(VisitDisposition)
  disposition?: VisitDisposition;

  @ApiPropertyOptional({
    description: 'Filter visits from this date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @ApiPropertyOptional({
    description: 'Filter visits until this date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: Date;

  @ApiPropertyOptional({
    description: 'Show only active visits (not checked out)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  activeOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum number of results',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Number of results to skip (for pagination)',
    example: 0,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  offset?: number = 0;
}
