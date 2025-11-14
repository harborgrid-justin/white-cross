import { IsDate, IsEnum, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentType } from './create-appointment.dto';
import { AppointmentStatus } from './update-appointment.dto';

/**
 * DTO for filtering and paginating appointment queries
 */
export class AppointmentFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter appointments by nurse/healthcare provider UUID',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  nurseId?: string;

  @ApiPropertyOptional({
    description: 'Filter appointments by student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Filter appointments by status',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    description: 'Filter appointments by type',
    enum: AppointmentType,
    example: AppointmentType.ROUTINE_CHECKUP,
  })
  @IsOptional()
  @IsEnum(AppointmentType)
  appointmentType?: AppointmentType;

  @ApiPropertyOptional({
    description: 'Filter appointments from this date (inclusive)',
    example: '2025-10-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @ApiPropertyOptional({
    description: 'Filter appointments to this date (inclusive)',
    example: '2025-10-31T23:59:59Z',
    type: 'string',
    format: 'date-time',
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
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page (1-100)',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}
