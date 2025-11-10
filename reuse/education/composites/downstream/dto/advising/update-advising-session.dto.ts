/**
 * DTO for updating an advising session
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsDate,
  IsBoolean,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { AppointmentType, MeetingFormat } from './create-advising-session.dto';

export enum AdvisingSessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export class UpdateAdvisingSessionDto {
  @ApiPropertyOptional({
    description: 'Updated session status',
    enum: AdvisingSessionStatus,
    example: AdvisingSessionStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(AdvisingSessionStatus)
  sessionStatus?: AdvisingSessionStatus;

  @ApiPropertyOptional({
    description: 'Updated appointment type',
    enum: AppointmentType,
    example: AppointmentType.ACADEMIC_PLANNING,
  })
  @IsOptional()
  @IsEnum(AppointmentType)
  appointmentType?: AppointmentType;

  @ApiPropertyOptional({
    description: 'Updated scheduled start time (ISO 8601)',
    example: '2025-11-15T10:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledStart?: Date;

  @ApiPropertyOptional({
    description: 'Updated scheduled end time (ISO 8601)',
    example: '2025-11-15T11:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledEnd?: Date;

  @ApiPropertyOptional({
    description: 'Actual start time (ISO 8601)',
    example: '2025-11-15T10:05:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  actualStart?: Date;

  @ApiPropertyOptional({
    description: 'Actual end time (ISO 8601)',
    example: '2025-11-15T10:55:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  actualEnd?: Date;

  @ApiPropertyOptional({
    description: 'Updated location',
    example: 'Virtual Meeting',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({
    description: 'Updated meeting format',
    enum: MeetingFormat,
    example: MeetingFormat.VIRTUAL,
  })
  @IsOptional()
  @IsEnum(MeetingFormat)
  meetingFormat?: MeetingFormat;

  @ApiPropertyOptional({
    description: 'Updated discussion topics',
    type: [String],
    example: ['degree planning', 'course selection', 'career goals'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @ApiPropertyOptional({
    description: 'Updated notes',
    example: 'Discussed graduation requirements',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Whether follow-up is required',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Follow-up date (ISO 8601)',
    example: '2025-11-22T10:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  followUpDate?: Date;
}
