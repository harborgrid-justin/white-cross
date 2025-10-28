import {
  IsUUID,
  IsEnum,
  IsDate,
  IsOptional,
  IsNumber,
  IsString,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Appointment type classification
 */
export enum AppointmentType {
  ROUTINE_CHECKUP = 'ROUTINE_CHECKUP',
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  INJURY_ASSESSMENT = 'INJURY_ASSESSMENT',
  ILLNESS_EVALUATION = 'ILLNESS_EVALUATION',
  FOLLOW_UP = 'FOLLOW_UP',
  SCREENING = 'SCREENING',
  EMERGENCY = 'EMERGENCY',
}

/**
 * DTO for creating a new appointment
 */
export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Student UUID who the appointment is for',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Nurse/healthcare provider UUID assigned to the appointment',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  nurseId: string;

  @ApiProperty({
    description: 'Type of appointment being scheduled',
    enum: AppointmentType,
    example: AppointmentType.ROUTINE_CHECKUP,
  })
  @IsEnum(AppointmentType)
  @IsNotEmpty()
  appointmentType: AppointmentType;

  @ApiProperty({
    description: 'Scheduled date and time for the appointment',
    example: '2025-10-28T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  scheduledDate: Date;

  @ApiPropertyOptional({
    description: 'Duration of appointment in minutes (15-120 minutes)',
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

  @ApiPropertyOptional({
    description: 'Reason for the appointment',
    example: 'Annual physical examination',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Additional notes or special instructions for the appointment',
    example: 'Student has fear of needles, please use distraction techniques',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
