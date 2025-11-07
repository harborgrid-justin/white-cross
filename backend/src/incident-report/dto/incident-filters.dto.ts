import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentSeverity, IncidentType } from '../enums';

export class IncidentFiltersDto {
  @ApiPropertyOptional({ description: 'Student ID filter' })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Reporter ID filter' })
  @IsOptional()
  @IsUUID()
  reportedById?: string;

  @ApiPropertyOptional({
    description: 'Incident type filter',
    enum: IncidentType,
  })
  @IsOptional()
  @IsEnum(IncidentType)
  type?: IncidentType;

  @ApiPropertyOptional({
    description: 'Severity filter',
    enum: IncidentSeverity,
  })
  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @ApiPropertyOptional({
    description: 'Date from filter',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @ApiPropertyOptional({ description: 'Date to filter', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  dateTo?: Date;

  @ApiPropertyOptional({ description: 'Parent notified filter' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  parentNotified?: boolean;

  @ApiPropertyOptional({ description: 'Follow-up required filter' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  followUpRequired?: boolean;

  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
