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
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  nurseId: string;

  @IsEnum(AppointmentType)
  @IsNotEmpty()
  appointmentType: AppointmentType;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  scheduledDate: Date;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(120)
  duration?: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
