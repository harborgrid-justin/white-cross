import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentType } from './create-appointment.dto';

/**
 * Recurrence frequency options
 */
export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

/**
 * DTO for recurring appointment configuration
 */
export class RecurrencePatternDto {
  @ApiProperty({
    description: 'How often the appointment repeats',
    enum: RecurrenceFrequency,
    example: RecurrenceFrequency.WEEKLY,
  })
  @IsEnum(RecurrenceFrequency)
  @IsNotEmpty()
  frequency: RecurrenceFrequency;

  @ApiProperty({
    description: 'Interval between recurrences (e.g., every 2 weeks)',
    example: 2,
    minimum: 1,
    maximum: 52,
  })
  @IsNumber()
  @Min(1)
  @Max(52)
  interval: number;

  @ApiProperty({
    description: 'End date for the recurring series',
    example: '2025-12-31',
    type: 'string',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @ApiPropertyOptional({
    description:
      'Days of the week for weekly recurrence (0=Sunday, 1=Monday, etc.)',
    example: [1, 3, 5],
    type: 'array',
    items: { type: 'number', minimum: 0, maximum: 6 },
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];
}

/**
 * DTO for creating recurring appointments
 */
export class CreateRecurringAppointmentDto {
  @ApiProperty({
    description: 'Student UUID for all recurring appointments',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Nurse UUID for all recurring appointments',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  nurseId: string;

  @ApiProperty({
    description: 'Type of recurring appointments',
    enum: AppointmentType,
    example: AppointmentType.MEDICATION_ADMINISTRATION,
  })
  @IsEnum(AppointmentType)
  @IsNotEmpty()
  type: AppointmentType;

  @ApiProperty({
    description: 'Date and time for the first appointment in the series',
    example: '2025-10-28T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  scheduledAt: Date;

  @ApiPropertyOptional({
    description: 'Duration of each appointment in minutes',
    example: 30,
    minimum: 15,
    maximum: 120,
    default: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(120)
  duration?: number;

  @ApiProperty({
    description: 'Reason for the recurring appointments',
    example: 'Daily insulin administration',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({
    description: 'Additional notes for all appointments in the series',
    example: 'Check blood sugar before administering',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Recurrence pattern configuration',
    type: RecurrencePatternDto,
  })
  @Type(() => RecurrencePatternDto)
  recurrence: RecurrencePatternDto;
}
