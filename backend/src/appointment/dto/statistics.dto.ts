import {
  IsOptional,
  IsUUID,
  IsString,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from './update-appointment.dto';
import { AppointmentType } from './create-appointment.dto';

/**
 * DTO for appointment statistics filters
 */
export class StatisticsFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter statistics by nurse UUID',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  nurseId?: string;

  @ApiPropertyOptional({
    description: 'Start date for statistics period',
    example: '2025-10-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @ApiPropertyOptional({
    description: 'End date for statistics period',
    example: '2025-10-31',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;
}

/**
 * DTO for search parameters
 */
export class SearchAppointmentsDto {
  @ApiPropertyOptional({
    description: 'Search query (searches in reason, notes, student name, nurse name)',
    example: 'flu shot',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by nurse UUID',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  nurseId?: string;

  @ApiPropertyOptional({
    description: 'Filter by student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by appointment status',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    description: 'Filter by appointment type',
    enum: AppointmentType,
    example: AppointmentType.ROUTINE_CHECKUP,
  })
  @IsOptional()
  @IsEnum(AppointmentType)
  type?: AppointmentType;

  @ApiPropertyOptional({
    description: 'Start date for date range filter',
    example: '2025-10-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @ApiPropertyOptional({
    description: 'End date for date range filter',
    example: '2025-10-31',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  limit?: number;
}

/**
 * DTO for bulk operations
 */
export class BulkCancelDto {
  @ApiPropertyOptional({
    description: 'List of appointment UUIDs to cancel',
    example: ['123e4567-e89b-12d3-a456-426614174000', '987fcdeb-51a2-43d1-b456-426614174001'],
    type: 'array',
    items: { type: 'string', format: 'uuid' },
  })
  appointmentIds: string[];

  @ApiPropertyOptional({
    description: 'Reason for bulk cancellation',
    example: 'Nurse unavailable due to emergency',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * DTO for date range queries
 */
export class DateRangeDto {
  @ApiPropertyOptional({
    description: 'Start date for range',
    example: '2025-10-01',
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  dateFrom: Date;

  @ApiPropertyOptional({
    description: 'End date for range',
    example: '2025-10-31',
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  dateTo: Date;

  @ApiPropertyOptional({
    description: 'Filter by nurse UUID',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  nurseId?: string;
}
