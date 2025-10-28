import { IsOptional, IsUUID, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TreatmentStatus } from '../../enums/treatment-status.enum';

/**
 * DTO for filtering treatment plans
 */
export class TreatmentPlanFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Filter by clinic visit ID' })
  @IsUUID()
  @IsOptional()
  visitId?: string;

  @ApiPropertyOptional({ description: 'Filter by status', enum: TreatmentStatus })
  @IsEnum(TreatmentStatus)
  @IsOptional()
  status?: TreatmentStatus;

  @ApiPropertyOptional({ description: 'Filter by creator' })
  @IsUUID()
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Number of results to return', minimum: 1, maximum: 100, default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Number of results to skip', minimum: 0, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
