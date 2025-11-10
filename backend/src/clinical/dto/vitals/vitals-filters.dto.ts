import { IsDate, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for filtering vital signs records
 */
export class VitalsFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Filter by clinic visit ID' })
  @IsUUID()
  @IsOptional()
  visitId?: string;

  @ApiPropertyOptional({ description: 'Filter by recorder' })
  @IsUUID()
  @IsOptional()
  recordedBy?: string;

  @ApiPropertyOptional({ description: 'Start date for date range filter' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateFrom?: Date;

  @ApiPropertyOptional({ description: 'End date for date range filter' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateTo?: Date;

  @ApiPropertyOptional({
    description: 'Number of results to return',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Number of results to skip',
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
