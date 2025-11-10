import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FollowUpStatus } from '../../enums/follow-up-status.enum';

/**
 * DTO for filtering follow-up appointments
 */
export class FollowUpFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Filter by original visit ID' })
  @IsUUID()
  @IsOptional()
  originalVisitId?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: FollowUpStatus,
  })
  @IsEnum(FollowUpStatus)
  @IsOptional()
  status?: FollowUpStatus;

  @ApiPropertyOptional({ description: 'Filter by assigned staff member' })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'Show only pending (scheduled/reminded/confirmed)',
    default: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  pendingOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Show only upcoming appointments',
    default: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  upcomingOnly?: boolean;

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
