import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PrescriptionStatus } from '../../enums/prescription-status.enum';

/**
 * DTO for filtering prescriptions
 */
export class PrescriptionFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Filter by clinic visit ID' })
  @IsUUID()
  @IsOptional()
  visitId?: string;

  @ApiPropertyOptional({ description: 'Filter by treatment plan ID' })
  @IsUUID()
  @IsOptional()
  treatmentPlanId?: string;

  @ApiPropertyOptional({ description: 'Filter by prescriber' })
  @IsUUID()
  @IsOptional()
  prescribedBy?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: PrescriptionStatus,
  })
  @IsEnum(PrescriptionStatus)
  @IsOptional()
  status?: PrescriptionStatus;

  @ApiPropertyOptional({ description: 'Filter by drug name (partial match)' })
  @IsString()
  @IsOptional()
  drugName?: string;

  @ApiPropertyOptional({
    description: 'Show only active prescriptions',
    default: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  activeOnly?: boolean;

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
